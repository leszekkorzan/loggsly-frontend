import React, {useEffect, useState} from 'react';
import { Container, Typography, TextField, Button, Divider, Link, Paper } from '@mui/material';
import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8'
import {useGlobalState} from '../components/state';

const Settings = () => {
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
            window.alert('Wyłączono!')
        }else{
            const text = aes.encrypt(apiInpt, pass).toString();
            window.localStorage.setItem('manage_api', text);
            window.alert('Włączono!')
        }
    }

    return(
        <Container sx={{mt:5,color:'#000',textAlign:'center'}}>
            {!logged ? (
                <>
                    <Button color='error' href='/reset' sx={{mb:2}} variant='outlined'>Reset ustawień</Button>
                    <br></br>
                    {window.sessionStorage.getItem('pass')!==null &&
                    <>
                        <Divider/>
                        <br></br>
                        <Typography variant='h5'>Konfiguracja zarządzania hasłami z aplikacji</Typography>
                        <Link href='#'>Instrukcja tutaj</Link>
                        <br></br>
                        <Paper sx={{p:1,mt:2,maxWidth:'400px',ml:'auto',mr:'auto'}}>
                            <TextField sx={{minWidth:'320px', mt:3}} value={apiInpt} onChange={(e)=>setApiInpt(e.target.value)} label="wpisz appscript API endpoint" variant="outlined" />
                            <br></br>
                            <Button color='error' onClick={encrypt} sx={{m:1}} variant='contained'>Zapisz</Button>
                        </Paper>
                    </>
                    }
                </>
            ) : (
                <>
                <Typography sx={{m:1,color:'#000'}}>W trybie Cloud Save ustawienia lokalne są niedostępne.</Typography>
                <Button color='error' href='/cloudsave' variant='contained'>Panel Cloud Save</Button>
                </>
            )}

        </Container>
    )
}
export default Settings