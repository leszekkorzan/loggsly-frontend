import React,{useState,useEffect} from 'react';
import { Container, Typography, TextField, Button, Paper, CircularProgress, Divider, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useIntl } from 'react-intl';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue, push, remove, update } from "firebase/database";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import SyncIcon from '@mui/icons-material/Sync';

import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import PaymentIcon from '@mui/icons-material/Payment';

import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8'

const messages = {
    savedAndDisabled: { id: 'app.cloudsave.profileElm.savedAndDisabled' },
    savedAndEnabled: { id: 'app.cloudsave.profileElm.savedAndEnabled' },
    updateError: { id: 'app.cloudsave.profileElm.updateError' },
    delete: { id: 'app.cloudsave.profileElm.delete' },
    deleted: { id: 'app.cloudsave.profileElm.deleted' },
    deleteError: { id: 'app.cloudsave.profileElm.deleteError' },
    mainPass: { id: 'app.cloudsave.profileElm.mainPass' },
    edit: { id: 'app.cloudsave.profileElm.edit' },
    apiUrl: { id: 'app.cloudsave.profileElm.apiUrl' },
    save: { id: 'app.cloudsave.profileElm.save' },
    updating: { id: 'app.cloudsave.profileElm.updating' },
    removeText: { id: 'app.cloudsave.profileElm.removeText' },

    profileAdded: { id: 'app.cloudsave.profileAdded' },
    profileAddError: { id: 'app.cloudsave.profileAddError' },
    entryDataError: { id: 'app.cloudsave.entryDataError' },
    signInWithGoogle: { id: 'app.cloudsave.signInWithGoogle' },
    info: { id: 'app.cloudsave.info' },
    hello: { id: 'app.cloudsave.hello' },
    signOut: { id: 'app.cloudsave.signOut' },
    refresh: { id: 'app.cloudsave.refresh' },
    manageSubscription: { id: 'app.cloudsave.manageSubscription' },
    manageProfiles: { id: 'app.cloudsave.manageProfiles' },
    addProfile: { id: 'app.cloudsave.addProfile' },
    profileName: { id: 'app.cloudsave.profileName' },
    csvApiUrl: { id: 'app.cloudsave.csvApiUrl' },
    masterPass: { id: 'app.cloudsave.masterPass' },
    repeatMasterPass: { id: 'app.cloudsave.repeatMasterPass' },
    add: { id: 'app.cloudsave.add' },
    adding: { id: 'app.cloudsave.adding' },
    noProfiles: { id: 'app.cloudsave.noProfiles' },
    subscriptionType: { id: 'app.cloudsave.subscriptionType' },
};

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

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();
const db = getDatabase(app);

const ProfileElm = ({i,index,dataDb, userUID}) => {
    const intl = useIntl();

    const [pass, setPass] = useState('');
    const [err, setErr] = useState(false);
    const [logged,setLogged] = useState(false);

    const [updating,setUpdating] = useState(false);
    const [apiURL,setApiURL] = useState('');

    const login = ()=> {
        if(pass.length>0){
            let URLbytes,URL
            try{
                URLbytes = aes.decrypt(i.csv, pass)
                URL = URLbytes.toString(enc);
                if(URL!==''){
                    if(i.api){
                        let URLbytes2,URL2
                        URLbytes2 = aes.decrypt(i.api, pass)
                        URL2 = URLbytes2.toString(enc);
                        setApiURL(URL2)
                    }
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
    }
    const editAPI = () => {
        setUpdating(true)
        window.sessionStorage.clear();
        if(apiURL === ""){
            update(ref(db, `users/${userUID}/data/${Object.keys(dataDb)[index]}`), {
                api: null
            }).then(()=>{
                window.alert(intl.formatMessage(messages.savedAndDisabled))
                setUpdating(false);
            }).catch(()=>{
                window.alert(intl.formatMessage(messages.updateError))
                setUpdating(false);
            });
        }else{
            const text = aes.encrypt(apiURL, pass).toString();
            console.log(text)
            update(ref(db, `users/${userUID}/data/${Object.keys(dataDb)[index]}`), {
                api: text
            }).then(()=>{
                window.alert(intl.formatMessage(messages.savedAndEnabled))
                setUpdating(false);
            }).catch(()=>{
                window.alert(intl.formatMessage(messages.updateError))
                setUpdating(false);
            });
        }
    }
    const removeProfile = () => {
        if(window.confirm(intl.formatMessage(messages.delete))){
            window.sessionStorage.clear();
            remove(ref(db, `users/${userUID}/data/${Object.keys(dataDb)[index]}`)
            ).then(()=>{
                window.alert(intl.formatMessage(messages.deleted))
            }).catch(()=>{
                window.alert(intl.formatMessage(messages.deleteError))
            });
        }
    }

    return(
        <Paper key={index} sx={{m:2,p:[1,2]}}>
            <Typography variant='h6' sx={{textAlign:'left'}}>
                {i.api && <SyncIcon sx={{position:'relative',top:'5px',mr:1}}/>}
                {i.name}
            </Typography>
            <Divider sx={{m:1}}/>
            {!logged ? (
                <Box sx={{display:'flex'}}>
                    <TextField error={err} value={pass} onChange={(e)=>setPass(e.target.value)} type='password' fullWidth label={intl.formatMessage(messages.mainPass)}/>
                    <Button onClick={login} sx={{ml:1}} variant='contained'>{intl.formatMessage(messages.edit)}</Button>
                </Box> 
            ) : (
                <Box>
                    <TextField variant='filled' disabled={updating} value={apiURL} onChange={(e)=>setApiURL(e.target.value)} fullWidth label={intl.formatMessage(messages.apiUrl)}/>
                    <Button onClick={editAPI} disabled={updating} size='large' sx={{my:2,ml:'auto',textAlign:'right'}} variant='contained'>{intl.formatMessage(messages.save)}</Button>
                    {updating && <Typography sx={{fontSize:'14px'}}>{intl.formatMessage(messages.updating)}</Typography>}
                </Box>
            )}
            <Divider sx={{m:1,my:2}}/>
            <Button onClick={removeProfile} startIcon={<DeleteIcon/>} variant='outlined'>{intl.formatMessage(messages.removeText)}</Button>
        </Paper>
    )
}

const CloudSave = () => {
    const intl = useIntl();

    const params = new URLSearchParams(window.location.search)
    const success = params.get('success')

    const [data,setData] = useState(null);
    const [loading,setLoading] = useState(false);
    const [err,setErr] = useState('');
    const [activated,setActivated] = useState(false);
    const [token,setToken] = useState('');

    let url = 'https://loggsly.herokuapp.com';
    // url='http://localhost:4000'

    const fetchUser = () => {
        setLoading(true)
        onAuthStateChanged(auth, (user) => {
            if (user) {
                if(success==='true'){
                    user.getIdToken(true);
                }
                setLoading(false)
                setErr('')
                setData(user)
                setToken(user.accessToken);
                user.getIdTokenResult()
                .then((idTokenResult) => {
                    if (!!idTokenResult.claims.activated) {
                        setActivated(true);
                    }else {
                        setActivated(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

            } else {
                setLoading(false)
                setErr('')
            }
        });
    }
    const login = () =>{
        window.localStorage.clear();
        window.sessionStorage.clear();
        signInWithPopup(auth, provider)
        .then(() => {
            fetchUser();
        }).catch((error) => {
            setErr(error.message);
        });
    }
    const logout = () =>{
        signOut(auth).then(()=>{
            window.localStorage.clear();
            window.sessionStorage.clear();
            setData(null);
            window.location = '/cloudsave'
        }).catch(()=>{
            console.log('SIGN_OUT ERR')
        });
    }

    const [edit,setEdit] = useState(false);
    const [dataLoading,setDataLoading] = useState(false);
    const [dataDb,setDataDb] = useState(null);
    const [parsedDataDb,setParsedDataDb] = useState(null);
    const [addingErr,setAddingErr] = useState('');
    const [addingLoading,setAddingLoading] = useState(false);

    const [addingName,setAddingName] = useState('');
    const [addingCSV,setAddingCSV] = useState('');
    const [addingPass,setAddingPass] = useState('');
    const [addingPass2,setAddingPass2] = useState('');

    const getData = () => {
        setDataLoading(true);
        const dbRef = ref(db, 'users/' + data.uid + '/data');
        onValue(dbRef, (snapshot) => {
            setEdit(true);
            setDataDb(snapshot.val())
            if(snapshot.val()){
                setParsedDataDb(Object.keys(snapshot.val()).map(key => snapshot.val()[key]))
            }
        });
    }
    const addProfile = () => {
        if(addingCSV.length > 5 && addingPass.length > 1 && addingPass === addingPass2 && addingName.length>1 && addingName.length<30){
            setAddingLoading(true);
            setAddingErr('')

            let refData;
            if(addingCSV.toLowerCase().startsWith('https://script.google.com/')){
                refData = {
                    name: addingName,
                    csv: aes.encrypt(addingCSV, addingPass).toString(),
                    api: aes.encrypt(addingCSV, addingPass).toString()
                }
            }else{
                refData = {
                    name: addingName,
                    csv: aes.encrypt(addingCSV, addingPass).toString()
                }
            }

            push(ref(db, 'users/' + data.uid + '/data'), refData).then(()=>{
                setAddingLoading(false);
                window.alert(intl.formatMessage(messages.profileAdded))
                setAddingName('');
                setAddingCSV('');
                setAddingPass('');
                setAddingPass2('');
            }).catch(()=>{
                setAddingLoading(false);
                setAddingErr(intl.formatMessage(messages.profileAddError));
            });
            
        }else{
            setAddingErr(intl.formatMessage(messages.entryDataError));
        }
    }

    useEffect(()=>{
        fetchUser()
    },[])
    return(
        <Container maxWidth='sm' sx={{marginLeft:'auto',marginRight:'auto', textAlign:'center', color:'#000',mt:5}}>
            {!data && !loading && (
                <Paper sx={{p:2}}>
                    <Typography variant='h5'>Loggsly Cloud Save</Typography>
                    <Button color='error' onClick={login} variant='contained' sx={{my:2}}>{intl.formatMessage(messages.signInWithGoogle)}</Button>
                    <Typography sx={{fontSize:'14px', color:'#f44336'}}>{err}</Typography>
                    <Divider/>
                    <Typography sx={{mt:1,fontSize:'14px'}}>{intl.formatMessage(messages.info)}</Typography>
                </Paper>
            )}
            {loading && (
                <CircularProgress color='error'/>
            )}
            {data && !loading && (
                <div>
                    <Typography variant='h5'>{intl.formatMessage(messages.hello)} {data.email}!</Typography>
                    <Box>
                        <Button startIcon={<LogoutIcon/>} color='error' sx={{m:0.5,width:['90%','auto']}} variant='outlined' onClick={logout}>{intl.formatMessage(messages.signOut)}</Button>
                        <Button startIcon={<RefreshIcon/>} color='error' sx={{m:0.5,width:['90%','auto']}} variant='outlined' onClick={()=>window.location='/cloudsave?success=true'}>{intl.formatMessage(messages.refresh)}</Button>
                        {activated &&
                            <form action={`${url}/manage`} method="POST">
                                <input type='hidden' name="token" value={token} />
                                <Button startIcon={<PaymentIcon/>} sx={{m:0.5,width:['90%','auto']}} color='error' variant='outlined' type='submit'>{intl.formatMessage(messages.manageSubscription)}</Button>
                            </form>
                        } 
                    </Box>

                    <div>
                        {activated ? (
                            <Container>
                                <Divider sx={{my:2}}/>
                                {!edit ? (
                                    <Button color='error' onClick={getData} disabled={dataLoading} variant='contained'>{intl.formatMessage(messages.manageProfiles)}</Button>
                                ) : (
                                    <Box>
                                        <Accordion sx={{mb:2}}>
                                            <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            >
                                            <Typography>{intl.formatMessage(messages.addProfile)}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Box sx={{display:'flex',flexWrap:'wrap',justifyContent:'center',flexDirection:['column','row']}}>
                                                    <TextField value={addingName} onChange={(e)=>setAddingName(e.target.value)} disabled={addingLoading} label={intl.formatMessage(messages.profileName)} sx={{m:1}}/>
                                                    <TextField value={addingCSV} onChange={(e)=>setAddingCSV(e.target.value)} disabled={addingLoading} label={intl.formatMessage(messages.csvApiUrl)} sx={{m:1}}/>
                                                    <TextField value={addingPass} onChange={(e)=>setAddingPass(e.target.value)} disabled={addingLoading} type='password' label={intl.formatMessage(messages.masterPass)} sx={{m:1}}/>
                                                    <TextField value={addingPass2} onChange={(e)=>setAddingPass2(e.target.value)} disabled={addingLoading} type='password' label={intl.formatMessage(messages.repeatMasterPass)} sx={{m:1}}/>

                                                    <Button onClick={addProfile} disabled={addingLoading} sx={{my:1}} variant='contained'>{intl.formatMessage(messages.add)}</Button>
                                                </Box>
                                                <br></br>
                                                <Typography sx={{fontSize:'14px', color:'#f44336'}}>{addingErr}</Typography>
                                                <Typography sx={{fontSize:'15px'}}>{addingLoading && intl.formatMessage(messages.adding)}</Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        {!dataDb ? (
                                            <Typography sx={{my:1}}>{intl.formatMessage(messages.noProfiles)}</Typography>
                                        ) : (
                                            <Box>
                                                {parsedDataDb !== null &&
                                                    <>
                                                        {parsedDataDb.map((i,index)=>
                                                            <ProfileElm key={index} i={i} index={index} dataDb={dataDb} userUID={data.uid} />
                                                        )}
                                                    </>
                                                }
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </Container>
                        ) : (
                            <Paper sx={{mt:3,p:2}}>
                                <Typography variant='h5'>{intl.formatMessage(messages.subscriptionType)}</Typography>
                                <Box sx={{display:'flex',flexWrap:'wrap',justifyContent:'center'}}>
                                    <Box sx={{m:2}}>
                                        <form action={`${url}/checkout`} method="POST">
                                            <input type='hidden' name="token" value={token} />
                                            <input type='hidden' name="period" value='monthly' />
                                            <Button startIcon={<PaymentIcon/>} color='error' variant='contained' type='submit'>11.99 zł/m-c</Button>
                                        </form> 
                                    </Box>
                                    <Box sx={{m:2}}>
                                        <form action={`${url}/checkout`} method="POST">
                                            <input type='hidden' name="token" value={token} />
                                            <input type='hidden' name="period" value='yearly' />
                                            <Button startIcon={<PaymentIcon/>} color='error' variant='contained' type='submit'>119.99 zł/rok</Button>
                                        </form>
                                    </Box>

                                </Box>   
                            </Paper>

                        )}
                    </div>
                </div>
            )}

        </Container>
    )
}
export default CloudSave