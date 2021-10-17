import React from 'react';
import {Container, Typography, Accordion, AccordionSummary, AccordionDetails, Button} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Reset = ()=> {
    const resetFn = () => {
        if(window.confirm('Are you sure?')){
            localStorage.clear();
            sessionStorage.clear();
            window.location = '/';
        }
    }
    return(
        <Container maxWidth='sm' sx={{marginLeft:'auto',marginRight:'auto', textAlign:'center', color:'#fff'}}>
            <Typography sx={{my:3}} variant='h5'>
                Reset Config
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
                    <Typography sx={{mb:1}}>All config data on this device will be lost!</Typography>
                    <Button onClick={resetFn} variant='contained'>RESET NOW</Button>
                </AccordionDetails>
            </Accordion>
        </Container>
    )
}
export default Reset;