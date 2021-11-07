import React,{useState,useEffect} from 'react';
import { Container, Typography, TextField, Button, Paper, CircularProgress, Divider, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue, push, remove, update } from "firebase/database";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import SyncIcon from '@mui/icons-material/Sync';

import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8'

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
                window.alert('Zapisano i wyłączono!')
                setUpdating(false);
            }).catch(()=>{
                window.alert("Błąd aktualizacji!")
                setUpdating(false);
            });
        }else{
            const text = aes.encrypt(apiURL, pass).toString();
            console.log(text)
            update(ref(db, `users/${userUID}/data/${Object.keys(dataDb)[index]}`), {
                api: text
            }).then(()=>{
                window.alert('Zapisano i włączono!')
                setUpdating(false);
            }).catch(()=>{
                window.alert("Błąd aktualizacji!")
                setUpdating(false);
            });
        }
    }
    const removeProfile = () => {
        if(window.confirm('Czy na pewno usunąć ten profil?')){
            window.sessionStorage.clear();
            remove(ref(db, `users/${userUID}/data/${Object.keys(dataDb)[index]}`)
            ).then(()=>{
                window.alert('Usunięto!')
            }).catch(()=>{
                window.alert("Błąd usuwania!")
            });
        }
    }

    return(
        <Paper sx={{m:2,p:[1,2]}}>
            <Typography variant='h6' sx={{textAlign:'left'}}>
                {i.api && <SyncIcon sx={{position:'relative',top:'5px',mr:1}}/>}
                {i.name}
            </Typography>
            <Divider sx={{m:1}}/>
            {!logged ? (
                <Box sx={{display:'flex'}}>
                    <TextField error={err} value={pass} onChange={(e)=>setPass(e.target.value)} type='password' fullWidth label='hasło główne tego profilu'/>
                    <Button onClick={login} sx={{ml:1}} variant='contained'>Edytuj</Button>
                </Box> 
            ) : (
                <Box>
                    <TextField variant='filled' disabled={updating} value={apiURL} onChange={(e)=>setApiURL(e.target.value)} fullWidth label='wpisz appscript API endpoint'/>
                    <Button onClick={editAPI} disabled={updating} size='large' sx={{my:2,ml:'auto',textAlign:'right'}} variant='contained'>Zapisz</Button>
                    {updating && <Typography sx={{fontSize:'14px'}}>Aktualizuję...</Typography>}
                </Box>
            )}
            <Divider sx={{m:1,my:2}}/>
            <Button onClick={removeProfile} startIcon={<DeleteIcon/>} variant='outlined'>Usuń</Button>
        </Paper>
    )
}

const CloudSave = () => {
    const params = new URLSearchParams(window.location.search)
    const success = params.get('success')

    const [data,setData] = useState(null);
    const [loading,setLoading] = useState(false);
    const [err,setErr] = useState('');
    const [activated,setActivated] = useState(false);
    const [token,setToken] = useState('');

    let url;
    if(window.location.hostname==='localhost'){
        // url='http://localhost:4000'
        url='https://loggsly.herokuapp.com'
    }else{
        url='https://loggsly.herokuapp.com'
    }

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
        .then((result) => {
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

            push(ref(db, 'users/' + data.uid + '/data'), {
                name: addingName,
                csv: aes.encrypt(addingCSV, addingPass).toString()
            }).then(()=>{
                setAddingLoading(false);
                window.alert('Profil dodano pomyślnie!')
                setAddingName('');
                setAddingCSV('');
                setAddingPass('');
                setAddingPass2('');
            }).catch(()=>{
                setAddingLoading(false);
                setAddingErr('błąd podczas dodawania');
            });
            
        }else{
            setAddingErr('Dane wejściowe są nieprawidłowe.');
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
                    <Button color='error' onClick={login} variant='contained' sx={{my:2}}>Zaloguj się z Google</Button>
                    <Typography sx={{fontSize:'14px', color:'#f44336'}}>{err}</Typography>
                    <Divider/>
                    <Typography sx={{mt:1,fontSize:'14px'}}>Uwaga! Po zalogowaniu profil zapisany lokalnie zostanie usunięty z tego urządzenia.</Typography>
                </Paper>
            )}
            {loading && (
                <CircularProgress color='error'/>
            )}
            {data && !loading && (
                <div>
                    <Typography variant='h5'>Witaj {data.email}!</Typography>
                    <Button color='error' sx={{my:1}} variant='outlined' onClick={logout}>Wyloguj z konta</Button>
                    <Button color='error' sx={{my:1, ml:1}} variant='outlined' onClick={()=>window.location='/cloudsave?success=true'}>Odśwież Dane</Button>
                    <div>
                        {activated ? (
                            <Container>
                                <form action={`${url}/manage`} method="POST">
                                    <input type='hidden' name="token" value={token} />
                                    <Button color='error' variant='outlined' type='submit'>Zarządzaj subskrypcją</Button>
                                </form>
                                <Divider sx={{my:2}}/>
                                {!edit ? (
                                    <Button color='error' onClick={getData} disabled={dataLoading} variant='contained'>Zarządzaj profilami</Button>
                                ) : (
                                    <Box>
                                        <Accordion sx={{mb:2}}>
                                            <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            >
                                            <Typography>Dodaj profil</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Box sx={{display:'flex',flexWrap:'wrap',justifyContent:'center',flexDirection:['column','row']}}>
                                                    <TextField value={addingName} onChange={(e)=>setAddingName(e.target.value)} disabled={addingLoading} label='Nazwa profilu' sx={{m:1}}/>
                                                    <TextField value={addingCSV} onChange={(e)=>setAddingCSV(e.target.value)} disabled={addingLoading} label='CSV Link' sx={{m:1}}/>
                                                    <TextField value={addingPass} onChange={(e)=>setAddingPass(e.target.value)} disabled={addingLoading} type='password' label='hasło główne profilu' sx={{m:1}}/>
                                                    <TextField value={addingPass2} onChange={(e)=>setAddingPass2(e.target.value)} disabled={addingLoading} type='password' label='powtórz hasło główne' sx={{m:1}}/>

                                                    <Button onClick={addProfile} disabled={addingLoading} sx={{my:1}} variant='contained'>Dodaj</Button>

                                                    <Typography sx={{fontSize:'14px', color:'#f44336'}}>{addingErr}</Typography>
                                                    <Typography sx={{fontSize:'15px'}}>{addingLoading && 'Dodawanie...'}</Typography>
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
                                        {!dataDb ? (
                                            <Typography sx={{my:1}}>Brak profilów</Typography>
                                        ) : (
                                            <Box>
                                                {parsedDataDb !== null &&
                                                    <>
                                                        {parsedDataDb.map((i,index)=>
                                                            <ProfileElm i={i} index={index} dataDb={dataDb} userUID={data.uid} />
                                                        )}
                                                    </>
                                                }
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </Container>
                        ) : (
                            <Container>
                                <form action={`${url}/checkout`} method="POST">
                                    <input type='hidden' name="token" value={token} />
                                    <Button color='error' variant='contained' type='submit'>Płatność</Button>
                                </form>
                            </Container>
                        )}
                    </div>
                </div>
            )}

        </Container>
    )
}
export default CloudSave