import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IntlProvider } from 'react-intl';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import localeEn from './lang/en.json';
import localePl from './lang/pl.json';
import Dashboard from './pages/Dashboard';
import Menu from './components/Menu';
import Reset from './pages/Reset';
import Settings from './pages/Settings';
import PassHealth from './pages/PassHealth';
import AddPass from './pages/AddPass';
import PassGenerator from './pages/PassGenerator';
import CloudSave from './pages/CloudSave';

import { setGlobalState, useGlobalState } from './lib/state';

const auth = getAuth();
const messages = {
  en: localeEn,
  pl: localePl
};

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });
  const [lang] = useGlobalState('lang');
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setGlobalState('logged', true);
      } else {
        setGlobalState('logged', false);
      }
    });

    const langLocalStorage = window.localStorage.getItem('lang');
    setGlobalState('lang', langLocalStorage !== null ? langLocalStorage : 'pl');
  }, []);

  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <IntlProvider messages={messages[lang]} locale={lang} defaultLocale="pl">
          <SnackbarProvider>
            <Menu />
            <Routes>
              <Route path="/reset" element={<Reset />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/passwords-health" element={<PassHealth />} />
              <Route path="/add-password" element={<AddPass />} />
              <Route path="/password-generator" element={<PassGenerator />} />
              <Route path="/cloudsave" element={<CloudSave />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </SnackbarProvider>
        </IntlProvider>
      </ThemeProvider>
    </Router>

  );
}

export default App;
