import React from 'react';
import {
  Container, Typography, Accordion, AccordionSummary, AccordionDetails, Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useIntl } from 'react-intl';
import { useGlobalState } from '../lib/state';

const messages = {
  reset: { id: 'app.reset.reset' },
  resetTitle: { id: 'app.reset.resetTitle' },
  resetText: { id: 'app.reset.resetText' },
  info: { id: 'app.reset.info' },
  delete: { id: 'app.reset.delete' },
  cloudsaveInfo: { id: 'app.reset.cloudsaveInfo' }
};

function Reset() {
  const intl = useIntl();
  const [logged] = useGlobalState('logged');
  const resetFn = () => {
    if (window.confirm(intl.formatMessage(messages.reset))) {
      localStorage.clear();
      sessionStorage.clear();
      window.location = '/';
    }
  };
  return (
    <Container
      maxWidth="sm"
      sx={{
        marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', color: '#000'
      }}
    >
      <Typography sx={{ my: 3 }} variant="h5">
        {intl.formatMessage(messages.resetTitle)}
      </Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{intl.formatMessage(messages.resetText)}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ mb: 1 }}>
            {intl.formatMessage(messages.info)}
          </Typography>
          <Button color="error" disabled={logged} onClick={resetFn} variant="contained">
            {intl.formatMessage(messages.delete)}
          </Button>
          {logged && (
            <Typography sx={{ m: 1, color: '#f44336' }}>
              {intl.formatMessage(messages.cloudsaveInfo)}
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}
export default Reset;
