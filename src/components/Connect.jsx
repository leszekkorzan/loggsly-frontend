import React, { useState, useEffect } from 'react';
import {
  Alert, AlertTitle, Button, Box
} from '@mui/material';
import { useIntl } from 'react-intl';
import RingLoader from 'react-spinners/RingLoader';
import Papa from 'papaparse';
import logoOnly from '../assets/logo-only-red.svg';

import { decryptFn } from '../lib/encryption';
import Passes from './Passes';

const messages = {
  error: { id: 'app.connect.error' },
  dbError: { id: 'app.connect.dbError' },
  reset: { id: 'app.connect.reset' }
};

function Connect() {
  const intl = useIntl();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [dataFetched, setDataFetched] = useState(null);
  const updated = window.sessionStorage.getItem('updated') || '';

  const password = window.atob(window.sessionStorage.getItem('pass'));
  const URL = decryptFn(window.localStorage.getItem('csv_url'), password);

  useEffect(() => {
    const fetchData = () => {
      if (URL.toLowerCase().startsWith('https://script.google.com/')) {
        window.fetch(URL, {
          redirect: 'follow',
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify({ type: 'view' })
        }).then((res) => res.json())
          .then((results) => {
            setLoading(false);
            setDataFetched(results);
            window.sessionStorage.setItem('csv_data', JSON.stringify(results));
            window.sessionStorage.setItem('API_fetch', true);
          })
          .catch(() => {
            setLoading(false);
            setErr(true);
          });
      } else {
        setTimeout(() => {
          Papa.parse(`${URL}&_=${updated}`, {
            download: true,
            header: true,
            error() {
              setLoading(false);
              setErr(true);
            },
            complete(results) {
              setLoading(false);
              if (results) {
                const { data } = results;
                if (['website', 'login', 'password', 'category'].every((elm) => results.meta.fields.includes(elm))) {
                  setErr(false);
                  setDataFetched(data);
                  window.sessionStorage.setItem('csv_data', JSON.stringify(data));
                } else {
                  setErr(true);
                }
              } else {
                setErr(true);
              }
            }
          });
        }, 1300);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      {loading && (
        <Box sx={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'
        }}
        >
          <RingLoader css={{ marginRight: '25px', marginBottom: '25px' }} color="#ed1c25" loading={loading} size="150px" />
          <img className="loaderImg" style={{ width: '100px', position: 'absolute' }} src={logoOnly} alt="Loggsly logo" />
        </Box>
      )}
      {err
            && (
            <Box sx={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: '400px' }}>
              <Alert sx={{ textAlign: 'left' }} severity="error">
                <AlertTitle>{intl.formatMessage(messages.error)}</AlertTitle>
                {intl.formatMessage(messages.dbError)}
              </Alert>
              <Button color="error" sx={{ m: 1, textAlign: 'center' }} variant="outlined" href="/reset">{intl.formatMessage(messages.reset)}</Button>
            </Box>
            )}
      {dataFetched !== null && !err ? <Passes data={dataFetched} pass={password} /> : null}
    </>
  );
}
export default Connect;
