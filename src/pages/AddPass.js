import React, {useState} from 'react';
import { Container, Typography, TextField, Button, Divider, Alert, AlertTitle, Paper } from '@mui/material';
import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8'

import copy from 'copy-to-clipboard';

const AddPass = () => {
    const pass = window.atob(window.sessionStorage.getItem('pass'));
    const [passInpt, setPassInpt] = useState('');
    const [encrypted, setEncrypted] = useState('');

    const [err,setErr] = useState('');
    const [loading,setLoading] = useState(false);
    const [website,setwebsite] = useState('');
    const [login,setLogin] = useState('');
    const [password,setPassword] = useState('');
    const [category,setCategory] = useState('');

    const [success, setSuccess] = useState(false)

    const encrypt = () => {
        const text = aes.encrypt(passInpt, pass).toString();
        setEncrypted(text)
        setPassInpt('')
    }

    const addPass = () => {
        if(window.localStorage.getItem('manage_api')!==null && website.length>0 && login.length>0 && password.length>0){
            setErr('')
            setLoading(true);
            var URLbytes  = aes.decrypt(window.localStorage.getItem('manage_api'), pass);
            var URL = URLbytes.toString(enc);

            window.fetch(`${URL}?type=add&website=${website}&login=${window.btoa(login)}&password=${window.btoa(aes.encrypt(password, pass).toString())}&category=${category}`).then(res => res.json())
            .then(res => {
                if(res.success){
                    setSuccess(true)
                }else{
                    setErr('API zwróciło błąd.');
                    setLoading(false)
                }
            })
            .catch(err => {
                setLoading(false)
                setErr('Wystąpił problem z API.')
            });

        }else{
            setErr('Dane wejściowe są nieprawidłowe.');
            setLoading(false);
        }
    }

    return(
        <>
        {window.sessionStorage.getItem('pass')!==null &&
            <Container sx={{mt:5,color:'#fff',textAlign:'center'}}>
                <Typography variant='h5'>Dodaj nowe hasło z aplikacji</Typography>
                <br></br>
                {window.localStorage.getItem('manage_api')!==null ? (
                    <div>
                        {!success ? (
                            <Paper sx={{maxWidth:'400px',p:2,marginLeft:'auto',marginRight:'auto'}}>
                                <TextField disabled={loading} value={website} onChange={(e)=>setwebsite(e.target.value)} sx={{minWidth:'300px', m:1}} type='text' placeholder='strona*'/>
                                <br></br>
                                <TextField disabled={loading} value={login} onChange={(e)=>setLogin(e.target.value)} sx={{minWidth:'300px', m:1}} type='text' placeholder='login*'/>
                                <br></br>
                                <TextField disabled={loading} value={password} onChange={(e)=>setPassword(e.target.value)} sx={{minWidth:'300px', m:1}} type='text' placeholder='hasło*'/>
                                <br></br>
                                <TextField disabled={loading} value={category} onChange={(e)=>setCategory(e.target.value)} sx={{minWidth:'300px', m:1}} type='text' placeholder='kategoria'/>
                                <br></br>
                                <Button disabled={loading} onClick={addPass} sx={{m:1}} variant='contained'>Dodaj</Button>
                                <Typography sx={{fontSize:'14px', color:'#f44336'}}>{err}</Typography>
                                <Typography sx={{fontSize:'15px'}}>{loading && 'Dodawanie...'}</Typography>
                            </Paper>    
                        ): (
                            <>
                            <Alert sx={{textAlign: 'left', m:2, maxWidth:'300px',marginLeft:'auto',marginRight:'auto'}} severity="success">
                                <AlertTitle>Sukces</AlertTitle>
                                Hasło zostało dodane! Zmiany będą widoczne w ciągu kilku minut.
                            </Alert>
                            <Button onClick={()=>window.location = '/add-password'} variant='contained'>Ok</Button>
                            </>
                        )}

                    </div>
                ):(
                    <>
                    <Typography>Najpierw należy skonfigurować możliwość dodawania haseł z aplikacji.</Typography>
                    <br></br>
                    <Button href='/settings' sx={{mt:1}} variant='outlined'>Konfiguracja</Button>
                    </>
                )}
                <Divider sx={{my:2}}/>
                <Typography variant='h5'>Dodaj nowe hasło manualnie</Typography>
                <br></br>
                <TextField sx={{minWidth:'300px'}} value={passInpt} onChange={(e)=>setPassInpt(e.target.value)} label="hasło*" variant="outlined" />
                <br></br>
                <Button onClick={encrypt} sx={{m:1}} variant='contained'>Zaszyfruj</Button>
                <br></br>
                <Typography sx={{wordBreak:'break-all'}}><i>{encrypted}</i></Typography>
                <br></br>
                {encrypted.length>0 &&
                    <>
                        <Typography>Wklej powyższy hash do Twojego arkusza Google Sheet.</Typography>
                        <Button onClick={() => copy(encrypted)} sx={{m:1,mb:5}} variant='outlined'>Skopiuj</Button>
                    </>
                }
            </Container>
        }
        </>
    )
}
export default AddPass