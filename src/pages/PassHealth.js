import React, {useState,useEffect} from 'react';
import { Container, Avatar, Box, Typography, Button, Paper} from '@mui/material';
import aes from 'crypto-js/aes';
import sha1 from 'crypto-js/sha1';
import enc from 'crypto-js/enc-utf8';
import PasswordStrengthBar from 'react-password-strength-bar';

import LockIcon from '@mui/icons-material/Lock';
import ErrorIcon from '@mui/icons-material/Error';
const HealthElm = ({website,login,pass}) => {
    const hash = sha1(pass).toString();
    const range = hash.slice(0,5);
    const suffix = hash.slice(5);
    const [leaked, setLeaked] = useState('');
    useEffect(()=>{
        window.fetch(`https://api.pwnedpasswords.com/range/${range}`)
        .then(response => response.text())
        .then(data => {
            if(data){
                const arr = data.split('\n');
                for (const i in arr){
                    if(arr[i].includes(suffix.toUpperCase())){
                        return setLeaked(true)
                    }
                }
                setLeaked(false)
            }
        });
    },[])

    return(
        <>
        <Paper elevation={8} style={{border: leaked&&'2px solid #f44336'}} sx={{p:1, py:2, m:[1,2], textAlign:'left', display:'flex', alignItems:'center', width:['95%','310px']}}>
            <Avatar sx={{mr:2,height:'45px',width:'45px'}}>
                {leaked && <ErrorIcon sx={{fontSize:'35px', color:'#fff'}}/>}
                {!leaked && <LockIcon sx={{fontSize:'35px', color:'#fff'}}/>}
            </Avatar>
            <Box sx={{display:'flex',flexDirection:'column',overflow:'auto'}}>
                <Typography variant='h6' sx={{fontWeight:'bold'}}>{website}</Typography>
                <Typography fontSize='15px'>{login}</Typography>
            </Box>
            <Box sx={{marginLeft:'auto',width:'70px',paddingLeft:'5px'}}>
                <PasswordStrengthBar password={pass} />
                {leaked && <Typography sx={{fontSize:'14px', color:'#f44336', fontWeight:'bold', textAlign:'center'}}>WYCIEK!</Typography>}
            </Box>

        </Paper>
        </>
    )
}



const PassHealth = () => {
    const [show,setShow] = useState(false);
    const decrypt = (text,key) =>{
        var bytes  = aes.decrypt(text, key);
        var decrypted = bytes.toString(enc);
        return decrypted;
    }
    const data = JSON.parse(window.sessionStorage.getItem('csv_data'))    
    if(!data){
        return <Typography sx={{color:'#000',textAlign:'center',mt:5}}>Brak danych! <a style={{color:'#90caf9'}} href='/'>załaduj ponownie aplikację</a></Typography>
    }
    return(
        <Container sx={{color:'#000',textAlign:'center', pt:5}}>
            <Typography variant='h5'>Bezpieczeństwo Haseł</Typography>
            {show ? (
                <Container sx={{textAlign:'center', display:'flex', flexWrap:'wrap', justifyContent:'center', mb:5, mt:1}}>
                    {data.map(elm=>
                        <HealthElm website={elm.website} login={elm.login} pass={decrypt(elm.password, window.atob(window.sessionStorage.getItem('pass')))} />
                    )}

                </Container>
            ) : (
                <Box >
                    <Typography>Rozumiem, że fragmenty hashy zapisanych haseł zostaną przesłane do usługi haveibeenpwned.com.</Typography>
                    <Button color='error' sx={{mt:1}} onClick={()=>setShow(true)} variant='contained'>Sprawdź</Button>
                </Box>
            )}

        </Container>
    )
}
export default PassHealth;