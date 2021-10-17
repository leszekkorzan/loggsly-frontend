import React, {useState} from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import aes from 'crypto-js/aes';


const Settings = () => {
    const pass = window.atob(window.sessionStorage.getItem('pass'));
    const [passInpt, setPassInpt] = useState('');
    const [encrypted, setEncrypted] = useState('');

    const encrypt = () => {
        const text = aes.encrypt(passInpt, pass).toString();
        setEncrypted(text)
        navigator.clipboard.writeText(text)
    }

    return(
        <Container sx={{mt:5,color:'#fff',textAlign:'center'}}>
            <Button href='/reset' sx={{mb:5}} variant='outlined'>Reset App</Button>
            <br></br>
            {window.sessionStorage.getItem('pass')!==null &&
            <>
                <Typography variant='h5'>Add new password</Typography>
                <br></br>
                <TextField value={passInpt} onChange={(e)=>setPassInpt(e.target.value)} label="password to encode" variant="outlined" />
                <br></br>
                <Button onClick={encrypt} sx={{m:1}} variant='contained'>Encrypt</Button>
                <br></br>
                <Typography>{encrypted}</Typography>
                <br></br>
                {encrypted.length>0 &&
                <>
                    <Typography>Paste above hash as a password in Google Sheet.</Typography>
                    <Button onClick={() => {navigator.clipboard.writeText(encrypted)}} sx={{m:1}} variant='outlined'>Copy</Button>
                </>
                }

            </>
            }
        </Container>
    )
}
export default Settings