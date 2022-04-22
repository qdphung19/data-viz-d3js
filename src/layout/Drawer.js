import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
// const pages = [
//     'Toulouse',
//     'Bordeaux',
//     'Lyon',
//     'Paris',
//     'Marseille',
//     'Nantes',
//     'Perpignan',
//     'Nice',
//     'Montpellier',
//     'Pau',
//     'St-Etienne',
//     'Grenoble',
//     'Toulon',
//     'Orléans',
// ];
const DrawerComp = () => {
    const [openDrawer, setOpenDrawer] = useState(false);

    return (
        <React.Fragment>
            <Drawer
                PaperProps={{
                    sx: {
                        backgroundColor: '#3a3845',
                    },
                }}
                anchor="left"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
            >
                <List>
                    <Link to={'/'} className="link-react" onClick={() => setOpenDrawer(false)}>
                        <ListItemButton sx={{ color: '#c69b7b' }}> Home</ListItemButton>
                    </Link>
                    <Link to={'/about'} className="link-react" onClick={() => setOpenDrawer(false)}>
                        <ListItemButton sx={{ color: '#c69b7b' }}> About</ListItemButton>
                    </Link>
                </List>
            </Drawer>
            <IconButton sx={{ color: '#fff', marginLeft: 'auto' }} onClick={() => setOpenDrawer(!openDrawer)}>
                <MenuIcon color="white" />
            </IconButton>
        </React.Fragment>
    );
};

export default DrawerComp;
