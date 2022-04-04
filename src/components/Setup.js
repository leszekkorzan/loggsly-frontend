import React, {useState} from 'react';
import {Box, Typography, TextField, Button, Alert, AlertTitle, InputAdornment, Paper} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import StorageIcon from '@mui/icons-material/Storage';
import { encryptFn } from '../lib/encryption';
import { useIntl } from 'react-intl';

const messages = {
    start: { id: 'app.setup.start' },
    readBefore: { id: 'app.setup.readBefore' },
    csvApiUrl: { id: 'app.setup.csvApiUrl' },
    masterPass: { id: 'app.setup.masterPass' },
    repeatMasterPass: { id: 'app.setup.repeatMasterPass' },
    save: { id: 'app.setup.save' },
    success: { id: 'app.setup.success' },
    profileSaved: { id: 'app.setup.profileSaved' },
    signIn: { id: 'app.setup.signIn' },
};

const Setup = () => {
    const intl = useIntl();
    const [url, setUrl] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');

    const [err, setErr] = useState(false);
    const [ok, setOk] = useState(false);

    const save = () => {
        if(url.length > 5 && pass1.length > 1 && pass1 === pass2){
            window.localStorage.setItem('csv_url', encryptFn(url, pass1))
            if(url.toLowerCase().startsWith('https://script.google.com/')){
                window.localStorage.setItem('manage_api', encryptFn(url, pass1))
            }
            setOk(true)
        }else{
            setErr(true);
        }
    }

    return(
        <Box sx={{display: 'flex', justifyContent: 'center', mt:'100px', color: '#000', textAlign: 'center'}}>
            <div>
                <Typography sx={{mb:2}} variant='h4'>{intl.formatMessage(messages.start)}</Typography>
                <Button href='https://docs.loggsly.com/o-aplikacji/zaczynamy' target='_blank' sx={{mb:1}} color='error' variant="contained">{intl.formatMessage(messages.readBefore)}</Button>
                {!ok ?
                    <Paper sx={{p:[1,2]}}>
                        <form>
                            <TextField error={err} value={url} onChange={(e)=>setUrl(e.target.value)} sx={{m: 1}} type='url' label={intl.formatMessage(messages.csvApiUrl)} variant="outlined" InputProps={{startAdornment: (<InputAdornment position="start"><StorageIcon /></InputAdornment>),}}/>
                            <br></br>
                            <TextField error={err}  value={pass1} onChange={(e)=>setPass1(e.target.value)} sx={{m: 1}} type='password' label={intl.formatMessage(messages.masterPass)} variant="outlined" InputProps={{startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>),}}/>
                            <br></br>
                            <TextField error={err} value={pass2} onChange={(e)=>setPass2(e.target.value)} sx={{m: 1}} type='password' label={intl.formatMessage(messages.repeatMasterPass)}variant="outlined" InputProps={{startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>),}}/>
                            <br></br>
                            <Button color='error' onClick={save} variant="contained">{intl.formatMessage(messages.save)}</Button>
                        </form>   
                    </Paper>

                : <div>
                    <Alert sx={{textAlign: 'left', m:2}} severity="success">
                        <AlertTitle>{intl.formatMessage(messages.success)}</AlertTitle>
                        {intl.formatMessage(messages.profileSaved)}
                    </Alert>
                    <Button color='error' onClick={()=>window.location = '/'} variant='contained'>{intl.formatMessage(messages.signIn)}</Button>
                </div>}

            </div>

        </Box>
    )
}
export default Setup