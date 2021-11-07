import React,{useState,useEffect} from 'react';
import {Container, Typography, Paper, Slider, FormControlLabel, Checkbox, Box, TextField, Button} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import copy from 'copy-to-clipboard';

var generator = require('generate-password');

const PassGenerator = ()=> {
    const [length,setLength] = useState(12);
    const [isNum,setIsNum] = useState(true);
    const [isSym,setIsSym] = useState(true);
    const [isLowerCase,setIsLowerCase] = useState(true);
    const [isUpperCase,setIsUpperCase] = useState(true);

    const [genPass,setGenPass] = useState('');

    useEffect(()=>{
        try{
            let password = generator.generate({
                length: length,
                numbers: isNum,
                symbols: isSym,
                lowercase: isLowerCase,
                uppercase: isUpperCase
            });
            setGenPass(password)
        }catch{
            setGenPass('')
        }

    },[length,isNum,isSym,isLowerCase,isUpperCase])


    return(
        <Container maxWidth='sm' sx={{marginLeft:'auto',marginRight:'auto', textAlign:'center', color:'#000'}}>
            <Typography sx={{my:3}} variant='h5'>
                Generator Haseł
            </Typography>
            <Paper sx={{p:2,textAlign:'left'}}>
                <Box sx={{display:'flex'}}>
                    <TextField fullWidth variant="outlined" value={genPass} disabled />
                    <Button sx={{ml:1}} variant='outlined' onClick={()=> copy(genPass)}>
                        <ContentCopyIcon />
                    </Button>
                </Box>
                <Box sx={{m:1,mt:3}}>
                    <Typography>Długość hasła</Typography>
                    <Slider defaultValue={12} onChange={(e)=>setLength(e.target.value)} valueLabelDisplay='auto' min={5} max={50} marks={[{value:5,label:'5'},{value:50,label:'50'}]} />
                </Box>
                <Box>
                    <FormControlLabel sx={{mr:[2,5]}} control={<Checkbox checked={isNum} onClick={()=>setIsNum(!isNum)} />} label="cyfry" />
                    <FormControlLabel sx={{mr:[2,5]}} control={<Checkbox checked={isSym} onClick={()=>setIsSym(!isSym)} />} label="symbole" />
                    <FormControlLabel sx={{mr:[2,5]}} control={<Checkbox checked={isLowerCase} onClick={()=>setIsLowerCase(!isLowerCase)} />} label="małe litery" />
                    <FormControlLabel control={<Checkbox checked={isUpperCase} onClick={()=>setIsUpperCase(!isUpperCase)} />} label="duże litery" />
                </Box>
            </Paper>
        </Container>
    )
}
export default PassGenerator;