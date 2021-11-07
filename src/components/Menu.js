import React, {useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import SecurityIcon from '@mui/icons-material/Security';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DescriptionIcon from '@mui/icons-material/Description';
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

const Menu = () => {
    const [open, setOpen] = useState(false);
    const [logged, setLogged] = useState(false);
    useEffect(()=>{
        setLogged(window.sessionStorage.getItem('pass')!==null)
    },[open])
    const logout = () => {
        window.sessionStorage.clear();
        window.location = '/';
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
        >
            <List sx={{minWidth:'200px'}}>
                {logged &&
                <>
                    <ListItem disablePadding>
                        <ListItemButton component='a' href='/'>
                        <ListItemIcon>
                            <VpnKeyIcon />
                        </ListItemIcon>
                        <ListItemText primary="Twoje hasła" />
                    </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component='a' href='/add-password'>
                        <ListItemIcon>
                            <AddCircleOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dodaj hasło" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component='a' href='/passwords-health'>
                        <ListItemIcon>
                            <SecurityIcon />
                        </ListItemIcon>
                        <ListItemText primary="Bezpieczeństwo haseł" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component='a' href='/password-generator'>
                        <ListItemIcon>
                            <EnhancedEncryptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="Generator haseł" />
                        </ListItemButton>
                    </ListItem>
                </>
                }
                <ListItem disablePadding>
                    <ListItemButton component='a' href='https://docs.loggsly.com/' target='_blank'>
                    <ListItemIcon>
                        <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dokumentacja" />
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
                    <ListItemText primary="Ustawienia" />
                    </ListItemButton>
                </ListItem>
                {logged &&
                    <ListItem disablePadding>
                        <ListItemButton onClick={logout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Wyloguj" />
                        </ListItemButton>
                    </ListItem>
                }
            </List>
        </Drawer>
        </>
    )
}
export default Menu;