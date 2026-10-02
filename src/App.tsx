/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TopGovBanner } from './components/TopGovBanner';
import { Navbar, NavTab } from './components/Navbar';
import { RoutePlannerView } from './components/RoutePlannerView';
import { LiveTrafficMapView } from './components/LiveTrafficMapView';
import { IncidentsAlertsView } from './components/IncidentsAlertsView';
import { RoadClosuresView } from './components/RoadClosuresView';
import { ERPCamerasView } from './components/ERPCamerasView';
import { GovFooter } from './components/GovFooter';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('planner');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSelectIncident = (incidentId: string) => {
    setActiveTab('incidents');
    setSearchQuery(incidentId.replace('inc-', ''));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased selection:bg-[#2563eb] selection:text-white">
      {/* 1. Official Singapore Government Agency Top Banner */}
      <TopGovBanner />

      {/* 2. Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectIncident={handleSelectIncident}
      />

      {/* 3. Main Screen Viewport based on selected Tab */}
      <main className="flex-1 pb-12">
        {activeTab === 'planner' && (
          <RoutePlannerView
            onSelectIncident={handleSelectIncident}
            searchFilter={searchQuery}
          />
        )}
        {activeTab === 'map' && <LiveTrafficMapView />}
        {activeTab === 'incidents' && (
          <IncidentsAlertsView onSelectIncident={handleSelectIncident} />
        )}
        {activeTab === 'closures' && <RoadClosuresView />}
        {activeTab === 'erp' && <ERPCamerasView />}
      </main>

      {/* 4. Singapore Government & LTA Dark Civil Footer */}
      <GovFooter onNavClick={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}
