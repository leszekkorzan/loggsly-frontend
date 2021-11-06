import React, {useEffect} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Menu from './components/Menu';
import Reset from './pages/Reset';
import Settings from './pages/Settings';
import PassHealth from './pages/PassHealth';
import AddPass from './pages/AddPass';
import PassGenerator from './pages/PassGenerator';
import CloudSave from './pages/CloudSave';

import {setGlobalState} from './components/state';

import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();

const App = ()=> {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    }
  });
  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setGlobalState('logged',true)
      } else {
        setGlobalState('logged',false)
      }
    });
  },[])

  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <Menu/>
        <Routes>
          <Route path="/reset" element={<Reset/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/passwords-health" element={<PassHealth/>} />
          <Route path="/add-password" element={<AddPass/>} />
          <Route path="/password-generator" element={<PassGenerator/>} />
          <Route path="/cloudsave" element={<CloudSave/>} />
          <Route path="/" element={<Dashboard/>} />
        </Routes>
      </ThemeProvider>
    </Router>

  );
}

export default App;
