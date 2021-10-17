import React, {useState, useEffect} from 'react';
import {Box, TextField, Button, InputAdornment, Paper} from '@mui/material';

import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import FingerprintTwoToneIcon from '@mui/icons-material/FingerprintTwoTone';

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
            :<Paper sx={{marginLeft:'auto',marginRight:'auto',p:[2,5],borderRadius:'10px'}} elevation={8}>
                <FingerprintTwoToneIcon sx={{fontSize:'100px', mb:5}}/>
                <br></br>
                <form onSubmit={e => login() & e.preventDefault()}style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <TextField sx={{minWidth:'320px'}} fullWidth autoFocus error={err} value={pass} onChange={(e)=>setPass(e.target.value)} type='password' label="enter password" variant="outlined" InputProps={{startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>),endAdornment: (<InputAdornment position="end"><Button onClick={login} variant='outlined'><ArrowForwardTwoToneIcon /></Button></InputAdornment>)}}/>
                </form>

            </Paper>
            }

        </Box>
    )
}
export default System