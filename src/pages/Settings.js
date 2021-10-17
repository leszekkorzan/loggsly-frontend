import React, {useState} from 'react';
import { Container, Typography, TextField, Button, Divider } from '@mui/material';
import aes from 'crypto-js/aes';

import copy from 'copy-to-clipboard';

const Settings = () => {
    const pass = window.atob(window.sessionStorage.getItem('pass'));
    const [passInpt, setPassInpt] = useState('');
    const [encrypted, setEncrypted] = useState('');

    const encrypt = () => {
        const text = aes.encrypt(passInpt, pass).toString();
        setEncrypted(text)
        setPassInpt('')
    }
    const logout = () => {
        window.sessionStorage.clear();
        window.location = '/';
    }

    return(
        <Container sx={{mt:5,color:'#fff',textAlign:'center'}}>
            <Button href='/reset' sx={{mb:2}} variant='outlined'>Reset App</Button>
            <br></br>
            {window.sessionStorage.getItem('pass')!==null &&
            <>
                <Button onClick={logout} sx={{mb:5}} variant='outlined'>Logout</Button>
                <Divider/>
                <br></br>
                <Typography variant='h5'>Add new password</Typography>
                <br></br>
                <TextField sx={{minWidth:'320px'}} value={passInpt} onChange={(e)=>setPassInpt(e.target.value)} label="password to encode" variant="outlined" />
                <br></br>
                <Button onClick={encrypt} sx={{m:1}} variant='contained'>Encrypt</Button>
                <br></br>
                <Typography sx={{wordBreak:'break-all'}}><i>{encrypted}</i></Typography>
                <br></br>
                {encrypted.length>0 &&
                <>
                    <Typography>Paste above hash as a password in Google Sheet.</Typography>
                    <Button onClick={() => copy(encrypted)} sx={{m:1}} variant='outlined'>Copy</Button>
                </>
                }

            </>
            }
        </Container>
    )
}
export default Settings