import React, {useState} from 'react';
import {Box, Typography, TextField, Button, Alert, AlertTitle, InputAdornment} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import StorageIcon from '@mui/icons-material/Storage';
import aes from 'crypto-js/aes';

const Setup = () => {
    const [url, setUrl] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');

    const [err, setErr] = useState(false);
    const [ok, setOk] = useState(false);

    const save = () => {
        if(url.length > 5 && pass1.length > 1 && pass1 === pass2){
            window.localStorage.setItem('csv_url', aes.encrypt(url, pass1).toString())
            setOk(true)
        }else{
            setErr(true);
        }
    }

    return(
        <Box sx={{display: 'flex', justifyContent: 'center', mt:'100px', color: '#fff', textAlign: 'center'}}>
            <div>
                <Typography sx={{mb:1}} variant='h4'>Setup</Typography>
                {!ok ?
                    <form>
                        <TextField error={err} value={url} onChange={(e)=>setUrl(e.target.value)} sx={{m: 1}} type='url' label="CSV DB URL" variant="outlined" InputProps={{startAdornment: (<InputAdornment position="start"><StorageIcon /></InputAdornment>),}}/>
                        <br></br>
                        <TextField error={err}  value={pass1} onChange={(e)=>setPass1(e.target.value)} sx={{m: 1}} type='password' label="master password" variant="outlined" InputProps={{startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>),}}/>
                        <br></br>
                        <TextField error={err} value={pass2} onChange={(e)=>setPass2(e.target.value)} sx={{m: 1}} type='password' label="repeat password" variant="outlined" InputProps={{startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>),}}/>
                        <br></br>
                        <Button onClick={save} variant="outlined">Save</Button>
                    </form>
                : <div>
                    <Alert sx={{textAlign: 'left', m:2}} severity="success">
                        <AlertTitle>Success</AlertTitle>
                        Password storage has been added!
                    </Alert>
                    <Button onClick={()=>window.location = '/'} variant='contained'>Login</Button>
                </div>}



            </div>

        </Box>
    )
}
export default Setup