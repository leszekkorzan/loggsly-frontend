import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Menu from './components/Menu';
import Reset from './pages/Reset';
import Settings from './pages/Settings';
import PassHealth from './pages/PassHealth';
import AddPass from './pages/AddPass';
import PassGenerator from './pages/PassGenerator';

const App = ()=> {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <Menu/>
        <Switch>
          <Route path="/reset">
            <Reset/>
          </Route>
          <Route path="/settings">
            <Settings/>
          </Route>
          <Route path="/passwords-health">
            <PassHealth/>
          </Route>
          <Route path="/add-password">
            <AddPass/>
          </Route>
          <Route path="/password-generator">
            <PassGenerator/>
          </Route>
          <Route path="/">
            <Dashboard/>
          </Route>
        </Switch>
      </ThemeProvider>
    </Router>

  );
}

export default App;
