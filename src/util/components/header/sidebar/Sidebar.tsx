import React from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Divider, Typography, Box, ListItemIcon } from '@mui/material';
import { Close, Home, Language, ContactMail } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    drawerVisible: boolean;
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const menuItems = [
    { text: 'Início', path: '/techvisit/home', icon: <Home /> },
    { text: 'Clientes', path: '/techvisit/customer', icon: <Language /> },
    { text: 'Contact', path: '/contact', icon: <ContactMail /> },
];

const Sidebar: React.FC<SidebarProps> = ({ drawerVisible, toggleDrawer }) => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
        toggleDrawer(false)({} as React.MouseEvent); // Close drawer on navigation
    };

    const list = () => (
        <Box
            sx={{
                width: 250,
                backgroundColor: '#c55117',
                height: '100%',
                color: 'white',
                padding: 2,
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" noWrap>
                    Menu
                </Typography>
                <IconButton onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
                    <Close />
                </IconButton>
            </Box>
            <Divider sx={{ backgroundColor: 'white', marginBottom: 2 }} />
            <List>
                {menuItems.map((item, index) => (
                    <ListItem button key={index} onClick={() => handleNavigation(item.path)}>
                        <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} primaryTypographyProps={{ style: { color: 'white' } }} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Drawer anchor="left" open={drawerVisible} onClose={toggleDrawer(false)}>
            {list()}
        </Drawer>
    );
};

export default Sidebar;
