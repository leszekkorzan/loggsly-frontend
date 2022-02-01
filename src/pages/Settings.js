import React, {useEffect, useState} from 'react';
import { Container, Typography, TextField, Button, Divider, Paper } from '@mui/material';
import { useIntl } from 'react-intl';
import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8'
import {useGlobalState} from '../components/state';
import { useSnackbar } from 'notistack';

const messages = {
    disabled: { id: 'app.settings.disabled' },
    enabled: { id: 'app.settings.enabled' },
    reset: { id: 'app.settings.reset' },
    info: { id: 'app.settings.info' },
    apiUrl: { id: 'app.settings.apiUrl' },
    save: { id: 'app.settings.save' },
    cloudsaveInfo: { id: 'app.settings.cloudsaveInfo' },
    panel: { id: 'app.settings.panel' },
};

const Settings = () => {
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();

    const [logged] = useGlobalState('logged')

    const pass = window.atob(window.sessionStorage.getItem('pass'));
    const [apiInpt, setApiInpt] = useState('');
    useEffect(()=>{
        if(window.localStorage.getItem('manage_api')!==null){
            try{
                var URLbytes  = aes.decrypt(window.localStorage.getItem('manage_api'), pass);
                var URL = URLbytes.toString(enc);
                setApiInpt(URL);
            }catch{
                console.log('err parsing data')
            }
        }
    },[])

    const encrypt = () => {
        if(apiInpt === ""){
            window.localStorage.removeItem('manage_api');
            enqueueSnackbar(intl.formatMessage(messages.disabled), { 
                variant: 'success',
            })
        }else{
            const text = aes.encrypt(apiInpt, pass).toString();
            window.localStorage.setItem('manage_api', text);
            enqueueSnackbar(intl.formatMessage(messages.enabled), { 
                variant: 'success',
            })        
        }
    }

    return(
        <Container sx={{mt:5,color:'#000',textAlign:'center'}}>
            {!logged ? (
                <>
                    <Button color='error' href='/reset' sx={{mb:2}} variant='outlined'>{intl.formatMessage(messages.reset)}</Button>
                    <br></br>
                    {window.sessionStorage.getItem('pass')!==null &&
                    <>
                        <Divider/>
                        <br></br>
                        <Typography variant='h5'>{intl.formatMessage(messages.info)}</Typography>
                        <br></br>
                        <Paper sx={{p:1,mt:2,maxWidth:'400px',ml:'auto',mr:'auto'}}>
                            <TextField sx={{minWidth:'320px', mt:3}} value={apiInpt} onChange={(e)=>setApiInpt(e.target.value)} label={intl.formatMessage(messages.apiUrl)} variant="outlined" />
                            <br></br>
                            <Button color='error' onClick={encrypt} sx={{m:1}} variant='contained'>{intl.formatMessage(messages.save)}</Button>
                        </Paper>
                    </>
                    }
                </>
            ) : (
                <>
                <Typography sx={{m:1,color:'#000'}}>{intl.formatMessage(messages.cloudsaveInfo)}</Typography>
                <Button color='error' href='/cloudsave' variant='contained'>{intl.formatMessage(messages.panel)}</Button>
                </>
            )}

        </Container>
    )
}
export default Settings