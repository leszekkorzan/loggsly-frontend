import React, {useState, useEffect} from 'react';
import {Box, Typography, TextField, Button} from '@mui/material';
import sha256 from 'crypto-js/sha256';
import Connect from './Connect';
const System = () => {
    const [pass, setPass] = useState('');
    const [err, setErr] = useState(false);
    const [logged,setLogged] = useState(false);
    useEffect(()=>{
        if(window.sessionStorage.getItem('pass') !== null){
            setLogged(true)
        }
    },[])
    const login = ()=> {
        if(pass.length>0 && sha256(pass).toString() === localStorage.getItem('pass')){
            window.sessionStorage.setItem('pass',window.btoa(pass));
            setLogged(true);
        }else{
            setErr(true)
        }
    }
    return(
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', color: '#fff', mt:5}}>
            {logged ? <Connect/>
            :<div>
                <Typography variant='h4'>Login</Typography>
                <br></br>
                <form onSubmit={e => login() & e.preventDefault()}style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <TextField autoFocus error={err} value={pass} onChange={(e)=>setPass(e.target.value)} type='password' label="enter password" variant="outlined" />
                    <Button onClick={login} sx={{ml:1}} variant='contained' size='large'>Login</Button>  
                </form>

            </div>
            }

        </Box>
    )
}
export default System