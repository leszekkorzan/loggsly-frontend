import React, {useState} from 'react';
import { Container, Card, Avatar, Box, Typography, IconButton, Popover, Tooltip, TextField} from '@mui/material';

import LockIcon from '@mui/icons-material/Lock';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';

import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8'

const AccountElm = ({website,login,pass,category}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return(
        <>
        <Card sx={{p:1, m:2, textAlign:'left', display:'flex', alignItems:'center', minWidth:'320px', maxWidth:'400px'}}>
            <Tooltip title={category}>
            <Avatar sx={{mr:1,height:'50px',width:'50px'}}>
                <LockIcon sx={{color:'#fff'}} />
            </Avatar>
            </Tooltip>
            <Box sx={{display:'flex',flexDirection:'column'}}>
                <Typography variant='h6' sx={{fontWeight:'bold'}}>{website}</Typography>
                <Typography fontSize='15px'>{login}</Typography>
            </Box>
            <Box sx={{display:'flex', marginLeft:'auto'}}>
                <IconButton onClick={handleClick} variant='outlined' size="large">
                    <VisibilityIcon />
                </IconButton>
                <IconButton variant='outlined' size="large" onClick={() => {navigator.clipboard.writeText(pass)}}>
                    <ContentCopyIcon />
                </IconButton>  
            </Box>

        </Card>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
            }}
        >
            <Typography sx={{ p: 2 }}>{pass}</Typography>
            </Popover>
        </>
    )
}

const Passes = ({data, pass}) => {
    const decrypt = (text,key) =>{
        var bytes  = aes.decrypt(text, key);
        var decrypted = bytes.toString(enc);
        return decrypted;
    }
    const [query, setQuery] = useState('');
    const filteredData = data.filter(item => {
        return Object.keys(item).some(key =>
            item[key].toLowerCase().includes(query.toLowerCase())
        );
    });
    return(
        <>
        <TextField value={query} onChange={(e)=>setQuery(e.target.value)} sx={{minWidth:'280px', marginLeft:'auto',marginRight:'auto'}} variant='outlined' placeholder='search'/>
        <Container sx={{textAlign:'center', display:'flex', flexWrap:'wrap', justifyContent:'center'}}>
            {filteredData.map(elm=>
                <AccountElm website='apple.com' login='demo@demo.com' pass={decrypt(elm.password, pass)} category={elm.category}/>
            )}
        </Container>
        </>
    )
}
export default Passes;