import React from 'react';
import HeroSection from './components/HeroSection';
import AirQualityOverviewSection from './components/AirQualityOverviewSection';
import AboutSection from './components/AboutSection';
import SensorsSection from './components/SensorsSection';

export default function LandingPage({ onOpenDashboard, latest }) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <HeroSection onOpenDashboard={onOpenDashboard} latest={latest} />
      <AirQualityOverviewSection latest={latest} onOpenDashboard={onOpenDashboard} />
      <SensorsSection />
      <AboutSection />
    </div>
  );
}
