import React from 'react';
import Setup from '../components/Setup';
import System from '../components/System';
import { useGlobalState } from '../lib/state';

function Dashboard() {
  const [logged] = useGlobalState('logged');
  if (window.localStorage.getItem('csv_url') !== null || logged) {
    return <System />;
  }
  return <Setup />;
}
export default Dashboard;
