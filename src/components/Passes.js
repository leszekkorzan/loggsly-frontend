import React, {useEffect, useState} from 'react';
import { Container, Avatar, Box, Typography, IconButton, Popover, Tooltip, TextField, Button, Modal, Paper} from '@mui/material';
import { useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

import LockIcon from '@mui/icons-material/Lock';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8'

import copy from 'copy-to-clipboard';

const messages = {
    deletePassword: { id: 'app.passes.accountElm.deletePassword' },
    deletedChangesSoon: { id: 'app.passes.accountElm.deletedChangesSoon' },
    apiError: { id: 'app.passes.accountElm.apiError' },
    updatePass: { id: 'app.passes.accountElm.updatePass' },
    updatedChangesSoon: { id: 'app.passes.accountElm.updatedChangesSoon' },
    website: { id: 'app.passes.accountElm.website' },
    login: { id: 'app.passes.accountElm.login' },
    pass: { id: 'app.passes.accountElm.pass' },
    category: { id: 'app.passes.accountElm.category' },
    save: { id: 'app.passes.accountElm.save' },
    updating: { id: 'app.passes.accountElm.updating' },
    search: { id: 'app.passes.search' },
    managePasses: { id: 'app.passes.managePasses' },
};

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
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();

    const [anchorEl, setAnchorEl] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const [adding,setAdding] = useState(false);
    const [websiteField,setWebsiteField] = useState(website);
    const [loginField,setLoginField] = useState(login);
    const [passField,setPassField] = useState(pass);
    const [categoryField,setCategoryField] = useState(category);

    const [copyColor, setCopyColor] = useState('primary') 

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
        if(window.confirm(intl.formatMessage(messages.deletePassword)) && window.localStorage.getItem('manage_api')!==null){
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
                    enqueueSnackbar(intl.formatMessage(messages.deletedChangesSoon), { 
                        variant: 'success',
                    })
                    sessionStorage.setItem('updated',new Date().toISOString());
                    window.location.reload(true)
                }else{
                    enqueueSnackbar(intl.formatMessage(messages.apiError), { 
                        variant: 'error',
                    })
                    window.location = '/';
                }
            })
            .catch(() => {
                enqueueSnackbar(intl.formatMessage(messages.apiError), { 
                    variant: 'error',
                })
                window.location = '/';
            });
        }
    }
    const update = () => {
        if(window.confirm(intl.formatMessage(messages.updatePass)) && window.localStorage.getItem('manage_api')!==null && websiteField.length>0 && loginField.length>0 && passField.length>0){
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
                            enqueueSnackbar(intl.formatMessage(messages.updatedChangesSoon), { 
                                variant: 'success',
                            });
                            sessionStorage.setItem('updated',new Date().toISOString());
                            window.location.reload(true);
                        }else{
                            enqueueSnackbar(intl.formatMessage(messages.apiError), { 
                                variant: 'error',
                            })
                            setAdding(false);
                        }
                    })
                    .catch(() => {
                        enqueueSnackbar(intl.formatMessage(messages.apiError), { 
                            variant: 'error',
                        });
                        setAdding(false);
                    });
                }else{
                    enqueueSnackbar(intl.formatMessage(messages.apiError), { 
                        variant: 'error',
                    });
                    setAdding(false);
                }
            })
            .catch(() => {
                enqueueSnackbar(intl.formatMessage(messages.apiError), { 
                    variant: 'error',
                })
                setAdding(false);
            });
        }
    }
    const copyFn = (text) => {
        copy(text)
        setCopyColor('success')
        setTimeout(()=>{
            setCopyColor('primary')
        },1000)
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
                        <IconButton color='primary' onClick={handleClick} variant='outlined' size="large">
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton color={copyColor} variant='outlined' size="large" onClick={() => copyFn(pass)}>
                            <ContentCopyIcon />
                        </IconButton>
                    </>
                ): (
                    <>
                        <IconButton color='primary' onClick={openModalFn} variant='outlined' size="large">
                            <EditIcon />
                        </IconButton>
                        <IconButton color='primary' onClick={remove} variant='outlined' size="large">
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
                <TextField disabled={adding} value={websiteField} onChange={(e)=>setWebsiteField(e.target.value)} sx={{my:1}} fullWidth variant='filled' placeholder={intl.formatMessage(messages.website)}/>
                <TextField disabled={adding} value={loginField} onChange={(e)=>setLoginField(e.target.value)} sx={{my:1}} fullWidth variant='filled' placeholder={intl.formatMessage(messages.login)}/>
                <TextField disabled={adding} value={passField} onChange={(e)=>setPassField(e.target.value)} sx={{my:1}} fullWidth variant='filled' placeholder={intl.formatMessage(messages.pass)}/>
                <TextField disabled={adding} value={categoryField} onChange={(e)=>setCategoryField(e.target.value)} sx={{my:1}} fullWidth variant='filled' placeholder={intl.formatMessage(messages.category)}/>
                <Box sx={{display:'flex'}}>
                    <Button disabled={adding} onClick={update} variant='contained' sx={{marginLeft:'auto'}}>{intl.formatMessage(messages.save)}</Button>
                </Box>
                {adding &&
                    <Typography sx={{textAlign:'center'}}>{intl.formatMessage(messages.updating)}</Typography>
                }
            </Box>
        </Modal>
        </>
    )
}

const Passes = ({data, pass}) => {
    const intl = useIntl();

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
        return true
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
            <TextField value={query} onChange={(e)=>setQuery(e.target.value)} sx={{minWidth:['280px','400px'], marginLeft:'auto',marginRight:'auto'}} variant='filled' placeholder={intl.formatMessage(messages.search)}/>
            <br></br>
            {window.localStorage.getItem('manage_api')!==null && (
            <Box sx={{m:1}}>
                {!edit ? (
                    <Button color='error' onClick={()=>setEdit(true)} sx={{maxWidth:'240px', marginLeft:'auto',marginRight:'auto',mt:1}} startIcon={<SettingsIcon/>} variant='contained'>{intl.formatMessage(messages.managePasses)}</Button>
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