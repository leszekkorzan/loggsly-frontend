import React, {useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

import {setGlobalState, useGlobalState} from '../components/state';

import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import SecurityIcon from '@mui/icons-material/Security';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import HelpIcon from '@mui/icons-material/Help';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';

// import Link from '@mui/material/Link';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import {Link} from 'react-router-dom';

import logo from '../assets/logo-white.svg';

const messages = {
    yourPasswords: { id: 'app.menu.yourPasswords' },
    addPassword: { id: 'app.menu.addPassword' },
    passwordsHealth: { id: 'app.menu.passwordsHealth' },
    passwordGenerator: { id: 'app.menu.passwordGenerator' },
    help: { id: 'app.menu.help' },
    settings: { id: 'app.menu.settings' },
    logout: { id: 'app.menu.logout' },
    signedOut: { id: 'app.menu.signedOut' },
};

const Menu = () => {
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = useState(false);
    const [logged, setLogged] = useState(false);

    const [lang] = useGlobalState('lang');

    useEffect(()=>{
        setLogged(window.sessionStorage.getItem('pass')!==null)
    },[open])
    const logout = () => {
        window.sessionStorage.clear();
        enqueueSnackbar(intl.formatMessage(messages.signedOut), { 
            variant: 'success',
        }) 
        window.location = '/';
    }
    const handleLang = (langID) => {
        setGlobalState('lang', langID);
        window.localStorage.setItem('lang', langID);
    }
    return(
        <>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar style={{background: '#ed1c25'}}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1,mt:1 }}>
                        <Link to='/'>
                            <img style={{maxWidth:'160px'}} src={logo} alt='Loggsly logo'/>
                        </Link>
                    </Typography>
                    <IconButton onClick={()=>setOpen(true)}>
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
        <Drawer
            anchor="right"
            open={open}
            onClose={()=>setOpen(false)}
            sx={{minHeight:'100%'}}
        >
            <List sx={{minWidth:'200px'}}>
                {logged &&
                <>
                    <ListItem disablePadding>
                        <ListItemButton component='a' href='/'>
                        <ListItemIcon>
                            <VpnKeyIcon />
                        </ListItemIcon>
                        <ListItemText primary={intl.formatMessage(messages.yourPasswords)} />
                    </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component='a' href='/add-password'>
                        <ListItemIcon>
                            <AddCircleOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary={intl.formatMessage(messages.addPassword)} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component='a' href='/passwords-health'>
                        <ListItemIcon>
                            <SecurityIcon />
                        </ListItemIcon>
                        <ListItemText primary={intl.formatMessage(messages.passwordsHealth)} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component='a' href='/password-generator'>
                        <ListItemIcon>
                            <EnhancedEncryptionIcon />
                        </ListItemIcon>
                        <ListItemText primary={intl.formatMessage(messages.passwordGenerator)} />
                        </ListItemButton>
                    </ListItem>
                </>
                }
                <ListItem disablePadding>
                    <ListItemButton component='a' href='https://docs.loggsly.com/' target='_blank'>
                    <ListItemIcon>
                        <HelpIcon/>
                    </ListItemIcon>
                    <ListItemText primary={intl.formatMessage(messages.help)} />
                    </ListItemButton>
                </ListItem>
                <Divider sx={{my:2}}/>
                <ListItem disablePadding>
                    <ListItemButton component='a' href='/cloudsave'>
                    <ListItemIcon>
                        <CloudCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Cloud Save" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component='a' href='/settings'>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary={intl.formatMessage(messages.settings)} />
                    </ListItemButton>
                </ListItem>
                {logged &&
                    <ListItem disablePadding>
                        <ListItemButton onClick={logout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary={intl.formatMessage(messages.logout)} />
                        </ListItemButton>
                    </ListItem>
                }
            </List>
            <Box sx={{ml:'auto', mr:'auto', mt: 'auto', mb: 2}}>
                <ButtonGroup>
                    <Button onClick={()=> handleLang('pl')} variant={lang==='pl' ? 'contained' : 'outlined'}>PL</Button>
                    <Button onClick={()=> handleLang('en')} variant={lang==='en' ? 'contained' : 'outlined'}>EN</Button>
                </ButtonGroup>
            </Box>
        </Drawer>
        </>
    )
}
export default Menu;