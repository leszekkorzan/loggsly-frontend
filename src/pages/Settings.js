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
            window.alert('Disabled!')
        }else{
            const text = aes.encrypt(apiInpt, pass).toString();
            window.localStorage.setItem('manage_api', text);
            window.alert('Enabled!')
        }
    }

    return(
        <Container sx={{mt:5,color:'#fff',textAlign:'center'}}>
            <Button href='/reset' sx={{mb:2}} variant='outlined'>Reset App</Button>
            <br></br>
            {window.sessionStorage.getItem('pass')!==null &&
            <>
                <Divider/>
                <br></br>
                <Typography variant='h5'>Configuration of password management from the application</Typography>
                <Link href='#'>Follow instructions here</Link>
                <br></br>
                <TextField sx={{minWidth:'320px', mt:3}} value={apiInpt} onChange={(e)=>setApiInpt(e.target.value)} label="enter appscript API endpoint" variant="outlined" />
                <br></br>
                <Button onClick={encrypt} sx={{m:1}} variant='contained'>Save</Button>
            </>
            }
        </Container>
    )
}
export default Settings