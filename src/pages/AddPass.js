import React, {useState} from 'react';
import { Container, Typography, TextField, Button, Divider, Alert, AlertTitle, Paper } from '@mui/material';
import { useIntl } from 'react-intl';
import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8'
import copy from 'copy-to-clipboard';

const messages = {
    apiError: { id: 'app.addPass.apiError' },
    entryDataError: { id: 'app.addPass.entryDataError' },
    addPassFromApp: { id: 'app.addPass.addPassFromApp' },
    website: { id: 'app.addPass.website' },
    login: { id: 'app.addPass.login' },
    pass: { id: 'app.addPass.pass' },
    category: { id: 'app.addPass.category' },
    add: { id: 'app.addPass.add' },
    adding: { id: 'app.addPass.adding' },
    success: { id: 'app.addPass.success' },
    successInfo: { id: 'app.addPass.successInfo' },
    setupFirst: { id: 'app.addPass.setupFirst' },
    setup: { id: 'app.addPass.setup' },
    addPassManually: { id: 'app.addPass.addPassManually' },
    encrypt: { id: 'app.addPass.encrypt' },
    copyInfo: { id: 'app.addPass.copyInfo' },
    copy: { id: 'app.addPass.copy' },
};

const AddPass = () => {
    const intl = useIntl();

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

            window.fetch(URL,{
                redirect:'follow',
                method: 'POST',
                headers: {
                  'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify({type:'add',website:website,login:window.btoa(login),password:window.btoa(aes.encrypt(password, pass).toString()),category:category})
            }).then(res => res.json())
            .then(res => {
                if(res.success){
                    sessionStorage.setItem('updated',new Date().toISOString());
                    setSuccess(true);
                }else{
                    setErr(intl.formatMessage(messages.apiError));
                    setLoading(false)
                }
            })
            .catch(() => {
                setLoading(false)
                setErr(intl.formatMessage(messages.apiError))
            });

        }else{
            setErr(intl.formatMessage(messages.entryDataError));
            setLoading(false);
        }
    }
    return(
        <>
        {window.sessionStorage.getItem('pass')!==null &&
            <Container sx={{mt:5,color:'#000',textAlign:'center'}}>
                <Typography variant='h5'>{intl.formatMessage(messages.addPassFromApp)}</Typography>
                <br></br>
                {window.localStorage.getItem('manage_api')!==null ? (
                    <div>
                        {!success ? (
                            <Paper sx={{maxWidth:'400px',p:2,marginLeft:'auto',marginRight:'auto'}}>
                                <TextField disabled={loading} value={website} onChange={(e)=>setwebsite(e.target.value)} sx={{minWidth:'300px', m:1}} type='text' placeholder={intl.formatMessage(messages.website)} variant='filled'/>
                                <br></br>
                                <TextField disabled={loading} value={login} onChange={(e)=>setLogin(e.target.value)} sx={{minWidth:'300px', m:1}} type='text' placeholder={intl.formatMessage(messages.login)} variant='filled'/>
                                <br></br>
                                <TextField disabled={loading} value={password} onChange={(e)=>setPassword(e.target.value)} sx={{minWidth:'300px', m:1}} type='text' placeholder={intl.formatMessage(messages.pass)} variant='filled'/>
                                <br></br>
                                <TextField disabled={loading} value={category} onChange={(e)=>setCategory(e.target.value)} sx={{minWidth:'300px', m:1}} type='text' placeholder={intl.formatMessage(messages.category)} variant='filled'/>
                                <br></br>
                                <Button color='error' disabled={loading} onClick={addPass} sx={{m:1}} variant='contained'>{intl.formatMessage(messages.add)}</Button>
                                <Typography sx={{fontSize:'14px', color:'#f44336'}}>{err}</Typography>
                                <Typography sx={{fontSize:'15px'}}>{loading && intl.formatMessage(messages.adding)}</Typography>
                            </Paper>    
                        ): (
                            <>
                            <Alert sx={{textAlign: 'left', m:2, maxWidth:'300px',marginLeft:'auto',marginRight:'auto'}} severity="success">
                                <AlertTitle>{intl.formatMessage(messages.success)}</AlertTitle>
                                {intl.formatMessage(messages.successInfo)}
                            </Alert>
                            <Button color='error' onClick={()=>window.location = '/add-password'} variant='contained'>Ok</Button>
                            </>
                        )}
                    </div>
                ):(
                    <>
                    <Typography>{intl.formatMessage(messages.setupFirst)}</Typography>
                    <br></br>
                    <Button color='error' onClick={()=>window.location='/settings'} sx={{mt:1}} variant='outlined'>{intl.formatMessage(messages.setup)}</Button>
                    </>
                )}
                <Divider sx={{my:2}}/>
                <Typography variant='h5'>{intl.formatMessage(messages.addPassManually)}</Typography>
                <Paper sx={{p:[1,2],mt:2,ml:'auto',mr:'auto',maxWidth:'400px'}}>
                    <TextField sx={{minWidth:'300px'}} value={passInpt} onChange={(e)=>setPassInpt(e.target.value)} label={intl.formatMessage(messages.pass)} variant="filled" />
                    <br></br>
                    <Button color='error' onClick={encrypt} sx={{m:1}} variant='contained'>{intl.formatMessage(messages.encrypt)}</Button>
                    <br></br>
                    <Typography sx={{wordBreak:'break-all'}}><i>{encrypted}</i></Typography>
                    <br></br>
                    {encrypted.length>0 &&
                        <>
                            <Typography>{intl.formatMessage(messages.copyInfo)}</Typography>
                            <Button color='error' onClick={()=> copy(encrypted)} sx={{m:1,mb:5}} variant='outlined'>{intl.formatMessage(messages.copy)}</Button>
                        </>
                    }
                </Paper>
            </Container>
        }
        </>
    )
}
export default AddPass