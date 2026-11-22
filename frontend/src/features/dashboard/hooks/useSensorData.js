import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchLatest, fetchReadings, simulateData, getDownloadUrl } from '../../../services/api';

const SEND_INTERVAL_MS = 30000;
const OFFLINE_TIMEOUT_MS = SEND_INTERVAL_MS * 2.5;

export function useSensorData(roomId = 'h5', timeRange = '7d') {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('connecting'); // connecting, ok, offline, err
  const [statusText, setStatusText] = useState('CONNECTING...');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const lastIdRef = useRef(null);

  const parseTime = (timestamp) => {
    if (!timestamp) return new Date();
    return new Date(String(timestamp).replace(' ', 'T') + 'Z');
  };

  const processReading = useCallback((data) => {
    if (!data || !data.id) return;
    if (data.id === lastIdRef.current) return;

    lastIdRef.current = data.id;
    setLatest(data);
    setLastUpdated(new Date());

    setHistory((prev) => {
      const exists = prev.some((item) => item.id === data.id);
      if (exists) return prev;
      return [...prev, data];
    });

    const recordedDate = parseTime(data.recorded_at);
    const ageMs = Date.now() - recordedDate.getTime();

    if (ageMs > OFFLINE_TIMEOUT_MS) {
      setStatus('offline');
      setStatusText('OFFLINE');
    } else {
      setStatus('ok');
      setStatusText('LIVE');
    }
  }, []);

  // Fetch data whenever roomId or timeRange changes directly from the backend
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function loadRoomData() {
      try {
        const [readingsData, latestData] = await Promise.all([
          fetchReadings({ room: roomId, range: timeRange }),
          fetchLatest(roomId),
        ]);

        if (!isMounted) return;

        setHistory(readingsData || []);
        if (latestData && latestData.id) {
          lastIdRef.current = latestData.id;
          setLatest(latestData);
          setLastUpdated(new Date());

          const recordedDate = parseTime(latestData.recorded_at);
          const ageMs = Date.now() - recordedDate.getTime();
          if (ageMs > OFFLINE_TIMEOUT_MS) {
            setStatus('offline');
            setStatusText('OFFLINE');
          } else {
            setStatus('ok');
            setStatusText('LIVE');
          }
        } else if (readingsData && readingsData.length > 0) {
          const last = readingsData[readingsData.length - 1];
          lastIdRef.current = last.id;
          setLatest(last);
          setLastUpdated(new Date());
          setStatus('ok');
          setStatusText('LIVE');
        } else {
          setLatest(null);
          setStatus('warning');
          setStatusText('BELUM ADA DATA');
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching data from backend:', err);
        setStatus('err');
        setStatusText('BRIDGE OFFLINE');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadRoomData();

    // Poll latest reading for the selected room every 2.5s
    const interval = setInterval(async () => {
      try {
        const current = await fetchLatest(roomId);
        if (!isMounted) return;
        if (current && current.id) {
          processReading(current);
        }
      } catch (err) {
        if (!isMounted) return;
        // Don't override status if already offline
      }
    }, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [roomId, timeRange, processReading]);

  const triggerSimulation = async () => {
    setIsSimulating(true);
    try {
      await simulateData({ room: roomId });
      const newLatest = await fetchLatest(roomId);
      processReading(newLatest);
    } catch (e) {
      console.error('Simulation error:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  const downloadData = (formatRange = timeRange) => {
    const url = getDownloadUrl(roomId, formatRange);
    window.open(url, '_blank');
  };

  return {
    latest,
    history,
    status,
    statusText,
    lastUpdated,
    triggerSimulation,
    isSimulating,
    isLoading,
    downloadData,
  };
}
