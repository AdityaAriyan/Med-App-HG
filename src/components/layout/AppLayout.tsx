import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { SimulationDrawer } from '../health/SimulationDrawer';

export const AppLayout: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar mode="user" />
      <main className="main-content">
        <TopBar />
        <Outlet />
      </main>
      <SimulationDrawer />
    </div>
  );
};

export const ManagerLayout: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar mode="manager" />
      <main className="main-content">
        <TopBar title="Manager Oversight Console" subtitle="Fleet heat risk monitoring, microclimate alerts, and workforce safety compliance" />
        <Outlet />
      </main>
      <SimulationDrawer />
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar mode="admin" />
      <main className="main-content">
        <TopBar title="Enterprise Administration" subtitle="User accounts, manager assignments, and device fleet configurations" />
        <Outlet />
      </main>
      <SimulationDrawer />
    </div>
  );
};
