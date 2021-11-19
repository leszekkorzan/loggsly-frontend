import React, {useEffect, useState} from 'react';
import { Container, Avatar, Box, Typography, IconButton, Popover, Tooltip, TextField, Button, Modal, Paper} from '@mui/material';

import LockIcon from '@mui/icons-material/Lock';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8'

import copy from 'copy-to-clipboard';

const style = {
    color: '#fff',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 400,
    bgcolor: '#212121',
    border: '2px solid #616161',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
};

const AccountElm = ({index,edit,website,login,pass,category,mainpass}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const [adding,setAdding] = useState(false);
    const [websiteField,setWebsiteField] = useState(website);
    const [loginField,setLoginField] = useState(login);
    const [passField,setPassField] = useState(pass);
    const [categoryField,setCategoryField] = useState(category);

    const openModalFn = () => {
        setWebsiteField(website)
        setLoginField(login)
        setPassField(pass)
        setCategoryField(category)
        setOpenModal(true)
    }

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const remove = () => {
        if(window.confirm('Czy na pewno usunąć to hasło?') && window.localStorage.getItem('manage_api')!==null){
            var URLbytes  = aes.decrypt(window.localStorage.getItem('manage_api'), mainpass);
            var URL = URLbytes.toString(enc);
            window.fetch(URL,{
                redirect:'follow',
                method: 'POST',
                headers: {
                  'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify({type:'remove',id:index})
            }).then(res => res.json())
            .then(res => {
                if(res.success){
                    window.alert('Usunięto! Zmiany będą widoczne w ciągu kilku minut.');
                    sessionStorage.setItem('updated',new Date().toISOString());
                    window.location.reload(true)
                }else{
                    window.alert('API zwróciło błąd.');
                    window.location = '/';
                }
            })
            .catch(() => {
                window.alert('Wystąpił problem z API.');
                window.location = '/';
            });
        }
    }
    const update = () => {
        if(window.confirm('Czy na pewno zaktualizować to hasło?') && window.localStorage.getItem('manage_api')!==null && websiteField.length>0 && loginField.length>0 && passField.length>0){
            var URLbytes  = aes.decrypt(window.localStorage.getItem('manage_api'), mainpass);
            var URL = URLbytes.toString(enc);
            setAdding(true);
            window.fetch(URL,{
                redirect:'follow',
                method: 'POST',
                headers: {
                  'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify({type:'remove',id:index})
            }).then(res => res.json())
            .then(res => {
                if(res.success){
                    window.fetch(URL,{
                        redirect:'follow',
                        method: 'POST',
                        headers: {
                          'Content-Type': 'text/plain;charset=utf-8'
                        },
                        body: JSON.stringify({type:'add',website:websiteField,login:window.btoa(loginField),password:window.btoa(aes.encrypt(passField, mainpass).toString()),category:categoryField})
                    }).then(res => res.json())
                    .then(res => {
                        if(res.success){
                            window.alert('Zaktualizowano! Zmiany będą widoczne w ciągu kilku minut.');
                            sessionStorage.setItem('updated',new Date().toISOString());
                            window.location.reload(true);
                        }else{
                            window.alert('Adding_API zwróciło błąd.');
                            setAdding(false);
                        }
                    })
                    .catch(() => {
                        window.alert('Wystąpił problem z adding_API.')
                        setAdding(false);
                    });
                }else{
                    window.alert('Removing_API zwróciło błąd.');
                    setAdding(false);
                }
            })
            .catch(() => {
                window.alert('Wystąpił problem z removing_API.');
                setAdding(false);
            });
        }

    }

    return(
        <>
        <Paper elevation={8} sx={{p:1, py:2, m:[1,2], textAlign:'left', display:'flex', alignItems:'center', width:['90%','330px']}}>
            <Tooltip title={category}>
            <Avatar sx={{mr:1,height:'45px',width:'45px'}}>
                <LockIcon sx={{color:'#fff'}} />
            </Avatar>
            </Tooltip>
            <Box sx={{display:'flex',flexDirection:'column',overflow:'auto'}}>
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
                        <IconButton onClick={openModalFn} variant='outlined' size="large">
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={remove} variant='outlined' size="large">
                            <DeleteIcon />
                        </IconButton>
                    </>
                )}

            </Box>

        </Paper>
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
            <Typography sx={{ p:2,overflowX:'scroll' }}>{pass}</Typography>
        </Popover>

        <Modal
            open={openModal}
            onClose={()=>setOpenModal(false)}
        >
            <Box sx={style}>
                <TextField disabled={adding} value={websiteField} onChange={(e)=>setWebsiteField(e.target.value)} sx={{my:1}} fullWidth variant='filled' placeholder='strona*'/>
                <TextField disabled={adding} value={loginField} onChange={(e)=>setLoginField(e.target.value)} sx={{my:1}} fullWidth variant='filled' placeholder='login*'/>
                <TextField disabled={adding} value={passField} onChange={(e)=>setPassField(e.target.value)} sx={{my:1}} fullWidth variant='filled' placeholder='hasło*'/>
                <TextField disabled={adding} value={categoryField} onChange={(e)=>setCategoryField(e.target.value)} sx={{my:1}} fullWidth variant='filled' placeholder='kategoria'/>
                <Box sx={{display:'flex'}}>
                    <Button disabled={adding} onClick={update} variant='contained' sx={{marginLeft:'auto'}}>Zapisz</Button>
                </Box>
                {adding &&
                    <Typography sx={{textAlign:'center'}}>Aktualizuję...</Typography>
                }
            </Box>
        </Modal>
        </>
    )
}

const Passes = ({data, pass}) => {
    const [query, setQuery] = useState('');
    const [edit,setEdit] = useState(false);
    const [err,setErr] = useState(false);

    const decrypt = (text,key) =>{
        var bytes  = aes.decrypt(text, key);
        var decrypted = bytes.toString(enc);
        return decrypted;
    }
    data.map((elm,index)=>{
        data[index]['index'] = index.toString()
    })
    const filteredData = data.filter(item => {
        return Object.keys(item).some(key =>
            typeof item[key] === "string" && item[key].toLowerCase().includes(query.toLowerCase())
        );
    });
    useEffect(()=>{
        if(data.length>0){
            if(!['website','login','password','category'].every(elm => Object.keys(data[0]).includes(elm))){
                setErr(true)
            }    
        }
    },[])
    return(
        <>
        <Paper sx={{p:1,ml:'auto',mr:'auto'}}>
            <TextField value={query} onChange={(e)=>setQuery(e.target.value)} sx={{minWidth:['280px','400px'], marginLeft:'auto',marginRight:'auto'}} variant='filled' placeholder='wyszukaj'/>
            <br></br>
            {window.localStorage.getItem('manage_api')!==null && (
            <Box sx={{m:1}}>
                {!edit ? (
                    <Button color='error' onClick={()=>setEdit(true)} sx={{maxWidth:'240px', marginLeft:'auto',marginRight:'auto',mt:1}} startIcon={<SettingsIcon/>} variant='contained'>Zarządzaj hasłami</Button>
                ):(
                    <Button color='error' onClick={()=>setEdit(false)} sx={{maxWidth:'240px', marginLeft:'auto',marginRight:'auto',mt:1}} startIcon={<SettingsIcon/>} variant='outlined'>OK</Button>
                )}
            </Box>
        )}
        </Paper>
        {!err && (
            <Container sx={{textAlign:'center', display:'flex', flexWrap:'wrap', justifyContent:'center', mb:5, mt:1}}>
                {filteredData.map((elm)=>
                    <>
                    {elm.index && elm.website && elm.login && elm.password && (
                        <AccountElm index={elm.index} edit={edit} mainpass={pass} website={elm.website} login={elm.login} pass={decrypt(elm.password, pass)} category={elm.category}/>
                    )}
                    </>
                )}
            </Container>
        )}

        </>
    )
}
export default Passes;