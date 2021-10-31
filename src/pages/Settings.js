import React, {useEffect, useState} from 'react';
import { Container, Typography, TextField, Button, Divider, Link } from '@mui/material';
import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8'

const Settings = () => {
    const pass = window.atob(window.sessionStorage.getItem('pass'));
    const [apiInpt, setApiInpt] = useState('');
    useEffect(()=>{
        if(window.localStorage.getItem('manage_api')!==null){
            var URLbytes  = aes.decrypt(window.localStorage.getItem('manage_api'), pass);
            var URL = URLbytes.toString(enc);
            setApiInpt(URL);
        }
    },[])

    const encrypt = () => {
        if(apiInpt === ""){
            window.localStorage.removeItem('manage_api');
            window.alert('Wyłączono!')
        }else{
            const text = aes.encrypt(apiInpt, pass).toString();
            window.localStorage.setItem('manage_api', text);
            window.alert('Włączono!')
        }
    }

    return(
        <Container sx={{mt:5,color:'#fff',textAlign:'center'}}>
            <Button href='/reset' sx={{mb:2}} variant='outlined'>Reset ustawień</Button>
            <br></br>
            {window.sessionStorage.getItem('pass')!==null &&
            <>
                <Divider/>
                <br></br>
                <Typography variant='h5'>Konfiguracja zarządzania hasłami z aplikacji</Typography>
                <Link href='#'>Instrukcja tutaj</Link>
                <br></br>
                <TextField sx={{minWidth:'320px', mt:3}} value={apiInpt} onChange={(e)=>setApiInpt(e.target.value)} label="wpisz appscript API endpoint" variant="outlined" />
                <br></br>
                <Button onClick={encrypt} sx={{m:1}} variant='contained'>Zapisz</Button>
            </>
            }
        </Container>
    )
}
export default Settings