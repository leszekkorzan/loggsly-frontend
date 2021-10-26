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

import Link from '@mui/material/Link';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

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
                <Toolbar style={{background: '#081a2e'}}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link sx={{textDecoration:'none',color:'#fff'}} href='/'>
                            Pass Manager
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
                        <ListItemText primary="Your Passwords" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component='a' href='/add-password'>
                        <ListItemIcon>
                            <AddCircleOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary="Add Password" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component='a' href='/passwords-health'>
                        <ListItemIcon>
                            <SecurityIcon />
                        </ListItemIcon>
                        <ListItemText primary="Passwords Security" />
                        </ListItemButton>
                    </ListItem>
                </>
                }
                <ListItem disablePadding>
                    <ListItemButton component='a' href='/' target='_blank'>
                    <ListItemIcon>
                        <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Documentation" />
                    </ListItemButton>
                </ListItem>
                <Divider sx={{my:2}}/>
                <ListItem disablePadding>
                    <ListItemButton component='a' href='/settings'>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                    </ListItemButton>
                </ListItem>
                {logged &&
                    <ListItem disablePadding>
                        <ListItemButton onClick={logout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                }
            </List>
        </Drawer>
        </>
    )
}
export default Menu;