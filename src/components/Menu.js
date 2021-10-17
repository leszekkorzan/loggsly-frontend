import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from '@mui/material/Link';
const Menu = () => {
    return(
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar style={{background: '#081a2e'}}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link sx={{textDecoration:'none',color:'#fff'}} href='/'>
                            Pass Manager
                        </Link>
                    </Typography>
                    <IconButton href='/settings'>
                        <SettingsIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
export default Menu;