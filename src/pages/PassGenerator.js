import React,{useState,useEffect} from 'react';
import {Container, Typography, Paper, Slider, FormControlLabel, Checkbox, Box, TextField, Button} from '@mui/material';
import { useIntl } from 'react-intl';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import copy from 'copy-to-clipboard';

var generator = require('generate-password');

const messages = {
    generator: { id: 'app.passGenerator.generator' },
    length: { id: 'app.passGenerator.length' },
    digits: { id: 'app.passGenerator.digits' },
    symbols: { id: 'app.passGenerator.symbols' },
    lowerC: { id: 'app.passGenerator.lowerC' },
    upperC: { id: 'app.passGenerator.upperC' },
};

const PassGenerator = ()=> {
    const intl = useIntl();

    const [length,setLength] = useState(12);
    const [isNum,setIsNum] = useState(true);
    const [isSym,setIsSym] = useState(true);
    const [isLowerCase,setIsLowerCase] = useState(true);
    const [isUpperCase,setIsUpperCase] = useState(true);

    const [genPass,setGenPass] = useState('');
    const [copyColor,setCopyColor] = useState('primary');

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
    const copyFn = (text) => {
        copy(text)
        setCopyColor('success')
        setTimeout(()=>{
            setCopyColor('primary')
        },1000)
    } 
    return(
        <Container maxWidth='sm' sx={{marginLeft:'auto',marginRight:'auto', textAlign:'center', color:'#000'}}>
            <Typography sx={{my:3}} variant='h5'>
                {intl.formatMessage(messages.generator)}
            </Typography>
            <Paper sx={{p:2,textAlign:'left'}}>
                <Box sx={{display:'flex'}}>
                    <TextField fullWidth variant="outlined" value={genPass} disabled />
                    <Button sx={{ml:1}} color={copyColor} variant='outlined' onClick={()=> copyFn(genPass)}>
                        <ContentCopyIcon />
                    </Button>
                </Box>
                <Box sx={{m:1,mt:3}}>
                    <Typography>{intl.formatMessage(messages.length)}</Typography>
                    <Slider defaultValue={12} onChange={(e)=>setLength(e.target.value)} valueLabelDisplay='auto' min={5} max={50} marks={[{value:5,label:'5'},{value:50,label:'50'}]} />
                </Box>
                <Box>
                    <FormControlLabel sx={{mr:[2,5]}} control={<Checkbox checked={isNum} onClick={()=>setIsNum(!isNum)} />} label={intl.formatMessage(messages.digits)} />
                    <FormControlLabel sx={{mr:[2,5]}} control={<Checkbox checked={isSym} onClick={()=>setIsSym(!isSym)} />} label={intl.formatMessage(messages.symbols)} />
                    <FormControlLabel sx={{mr:[2,5]}} control={<Checkbox checked={isLowerCase} onClick={()=>setIsLowerCase(!isLowerCase)} />} label={intl.formatMessage(messages.lowerC)} />
                    <FormControlLabel control={<Checkbox checked={isUpperCase} onClick={()=>setIsUpperCase(!isUpperCase)} />} label={intl.formatMessage(messages.upperC)} />
                </Box>
            </Paper>
        </Container>
    )
}
export default PassGenerator;