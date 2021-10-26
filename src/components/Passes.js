import React, {useState} from 'react';
import { Container, Card, Avatar, Box, Typography, IconButton, Popover, Tooltip, TextField, Button} from '@mui/material';

import LockIcon from '@mui/icons-material/Lock';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8'

import copy from 'copy-to-clipboard';

const AccountElm = ({index,edit,website,login,pass,category,mainpass}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const remove = () => {
        if(window.confirm('delete?') && window.localStorage.getItem('manage_api')!==null){
            var URLbytes  = aes.decrypt(window.localStorage.getItem('manage_api'), mainpass);
            var URL = URLbytes.toString(enc);
            window.fetch(`${URL}?type=remove&id=${index}`).then(res => res.json())
            .then(res => {
                if(res.success){
                    window.alert('Removed! Changes can be seen in a few minutes.');
                    window.location = '/';
                }else{
                    window.alert('API returned an error');
                    window.location = '/';
                }
            })
            .catch(err => {
                window.alert('An error has occurred with API.');
                window.location = '/';
            });
        }
    }

    return(
        <>
        <Card sx={{p:1, py:2, m:[1,2], textAlign:'left', display:'flex', alignItems:'center', minWidth:'320px', maxWidth:'400px'}}>
            <Tooltip title={category}>
            <Avatar sx={{mr:1,height:'45px',width:'45px'}}>
                <LockIcon sx={{color:'#fff'}} />
            </Avatar>
            </Tooltip>
            <Box sx={{display:'flex',flexDirection:'column'}}>
                <Typography variant='h6' sx={{fontWeight:'bold'}}>{website}</Typography>
                <Typography fontSize='15px'>{login}</Typography>
            </Box>
            <Box sx={{display:'flex', marginLeft:'auto'}}>
                {!edit ? (
                    <>   
                        <IconButton onClick={handleClick} variant='outlined' size="large">
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton variant='outlined' size="large" onClick={() => copy(pass)}>
                            <ContentCopyIcon />
                        </IconButton>
                    </>
                ): (
                    <>
                        <IconButton variant='outlined' size="large">
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={remove} variant='outlined' size="large">
                            <DeleteIcon />
                        </IconButton>
                    </>
                )}

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
    data.map((elm,index)=>{
        data[index]['index'] = index.toString()
    })
    const [query, setQuery] = useState('');
    const filteredData = data.filter(item => {
        return Object.keys(item).some(key =>
            item[key].toLowerCase().includes(query.toLowerCase())
        );
    });
    const [edit,setEdit] = useState(false);
    return(
        <>
        <TextField value={query} onChange={(e)=>setQuery(e.target.value)} sx={{minWidth:'280px', marginLeft:'auto',marginRight:'auto'}} variant='outlined' placeholder='search'/>
        {window.localStorage.getItem('manage_api')!==null && (
            <>
                {!edit ? (
                    <Button onClick={()=>setEdit(true)} sx={{maxWidth:'240px', marginLeft:'auto',marginRight:'auto',mt:1}} startIcon={<SettingsIcon/>} variant='outlined'>Manage Passwords</Button>
                ):(
                    <Button onClick={()=>window.location = '/'} sx={{maxWidth:'240px', marginLeft:'auto',marginRight:'auto',mt:1}} startIcon={<SettingsIcon/>} variant='outlined'>OK</Button>
                )}
            </>
        )}
        <Container sx={{textAlign:'center', display:'flex', flexWrap:'wrap', justifyContent:'center', mb:5, mt:1}}>
            {filteredData.map((elm)=>
                <AccountElm index={elm.index} edit={edit} mainpass={pass} website={elm.website} login={elm.login} pass={decrypt(elm.password, pass)} category={elm.category}/>
            )}
        </Container>
        </>
    )
}
export default Passes;