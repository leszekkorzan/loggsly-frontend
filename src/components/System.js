import React, {useState, useEffect} from 'react';
import {Box, TextField, Button, InputAdornment, Paper, InputLabel, MenuItem, FormControl, Select, Typography, CircularProgress} from '@mui/material';
import { useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import FingerprintTwoToneIcon from '@mui/icons-material/FingerprintTwoTone';
import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8'
import Connect from './Connect';

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, child } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBZl4fO64qGFaYdWZx8trV5Vy1agxfjgRM",
    authDomain: "loggsly-com.firebaseapp.com",
    projectId: "loggsly-com",
    storageBucket: "loggsly-com.appspot.com",
    messagingSenderId: "401460546229",
    appId: "1:401460546229:web:461a7a166725121813ccfc",
    measurementId: "G-2N8TZQQ8HW",
    databaseURL: 'https://loggsly-com-default-rtdb.europe-west1.firebasedatabase.app'
};
const messages = {
    noDbAccess: { id: 'app.system.noDbAccess' },
    fetchErr: { id: 'app.system.fetchErr' },
    chooseProfile: { id: 'app.system.chooseProfile' },
    enterMainPass: { id: 'app.system.enterMainPass' },
    noProfiles: { id: 'app.system.noProfiles' },
    loginError: { id: 'app.system.loginError' }
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

const System = () => {
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();

    const [pass, setPass] = useState('');
    const [err, setErr] = useState(false);
    const [logged,setLogged] = useState(false);

    const [cloud,setCloud] = useState(false);
    const [parsedDataDb,setParsedDataDb] = useState(null);
    const [select, setSelect] = React.useState(0);
    
    const [dbLoading,setDbLoading] = React.useState(false);

    useEffect(()=>{
        if(window.sessionStorage.getItem('pass') !== null){
            setLogged(true)
        }
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setDbLoading(true)
                const dbRef = ref(db);
                get(child(dbRef, `users/${user.uid}/data`)).then((snapshot) => {
                    setCloud(true)
                    setDbLoading(false)
                    if(snapshot.exists()){
                        setParsedDataDb(Object.keys(snapshot.val()).map(key => snapshot.val()[key]))
                    }
                }).catch((e) => {
                    setDbLoading(false)
                    if(e.message === 'Permission denied'){
                        enqueueSnackbar(intl.formatMessage(messages.noDbAccess), { 
                            variant: 'error',
                        })
                        window.location='/cloudsave'
                    }else{
                        enqueueSnackbar(intl.formatMessage(messages.fetchErr), { 
                            variant: 'error',
                        })                    
                    }
                    console.log(e.message)
                });
            } else {
                setCloud(false)
            }
        });
    },[])
    const login = ()=> {
        sessionStorage.setItem('updated',new Date().toISOString())
        if(cloud && pass.length>0 && parsedDataDb[select].csv){
            window.localStorage.setItem('csv_url', parsedDataDb[select].csv)
            let URLbytes,URL
            try{
                URLbytes = aes.decrypt(parsedDataDb[select].csv, pass)
                URL = URLbytes.toString(enc);
                if(URL!==''){
                    window.sessionStorage.setItem('pass',window.btoa(pass));
                    if(parsedDataDb[select].api){
                        window.localStorage.setItem('manage_api', parsedDataDb[select].api);
                    }else{
                        window.localStorage.removeItem('manage_api')
                    }
                    setLogged(true);
                }else{
                    setErr(true)
                }
            }catch{
                setErr(true)
            }
        }
        else if(!cloud && pass.length>0 && localStorage.getItem('csv_url')!==null){
            let URLbytes,URL
            try{
                URLbytes = aes.decrypt(window.localStorage.getItem('csv_url'), pass)
                URL = URLbytes.toString(enc);
                if(URL!==''){
                    window.sessionStorage.setItem('pass',window.btoa(pass));
                    setLogged(true);
                }else{
                    setErr(true)
                }
            }catch{
                setErr(true)
            }
        }else{
            setErr(true)
        }
        if(err){
            enqueueSnackbar(intl.formatMessage(messages.loginError), { 
                variant: 'error',
            })
        }
    }
    return(
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', color: '#fff', mt:5}}>
            {logged ? <Connect/>
            :<Paper sx={{marginLeft:'auto',marginRight:'auto',p:[2,5],borderRadius:'10px'}} elevation={8}>
                <FingerprintTwoToneIcon sx={{fontSize:'100px', mb:5}}/>
                <br></br>
                {dbLoading && (
                    <CircularProgress color='error'/>
                )}
                {cloud && parsedDataDb && (
                    <FormControl sx={{textAlign:'left'}} fullWidth>
                        <InputLabel id="profile-select-label">{intl.formatMessage(messages.chooseProfile)}</InputLabel>
                        <Select
                            labelId="profile-select-label"
                            id="profile-select"
                            value={select}
                            label={intl.formatMessage(messages.chooseProfile)}
                            onChange={(e)=>setSelect(e.target.value)}
                        >
                        {parsedDataDb.map((i,index)=>
                            <MenuItem key={index} value={index}>{i.name}</MenuItem>
                        )}
                        </Select>
                    </FormControl>
                )}
                {!cloud || parsedDataDb ? (
                    <form onSubmit={e => login() & e.preventDefault()} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <TextField sx={{minWidth:'320px',mt:2}} fullWidth autoFocus error={err} value={pass} onChange={(e)=>setPass(e.target.value)} type='password' label={intl.formatMessage(messages.enterMainPass)} variant="outlined" InputProps={{startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>),endAdornment: (<InputAdornment position="end"><Button onClick={login} variant='outlined'><ArrowForwardTwoToneIcon /></Button></InputAdornment>)}}/>
                    </form>
                ) : (
                    <Typography>{intl.formatMessage(messages.noProfiles)}</Typography>
                )}

            </Paper>
            }

        </Box>
    )
}
export default System