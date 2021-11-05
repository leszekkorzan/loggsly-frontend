import React from 'react';
import {Container, Typography, Accordion, AccordionSummary, AccordionDetails, Button} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useGlobalState} from '../components/state';

const Reset = ()=> {
    const [logged] = useGlobalState('logged')
    const resetFn = () => {
        if(window.confirm('Czy na pewno chcesz zresetować ustawienia?')){
            localStorage.clear();
            sessionStorage.clear();
            window.location = '/';
        }
    }
    return(
        <Container maxWidth='sm' sx={{marginLeft:'auto',marginRight:'auto', textAlign:'center', color:'#fff'}}>
            <Typography sx={{my:3}} variant='h5'>
                Reset Ustawień
            </Typography>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography>Reset</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography sx={{mb:1}}>Wszystkie ustawienia zostaną usunięte z tego urządzenia!</Typography>
                    <Button disabled={logged} onClick={resetFn} variant='contained'>USUŃ</Button>
                    {logged && <Typography sx={{m:1,color:'#f44336'}}>W trybie Cloud Save nie można wyzerować aplikacji lokalnie.</Typography>}
                </AccordionDetails>
            </Accordion>
        </Container>
    )
}
export default Reset;