import React from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Divider, Typography, Box, ListItemIcon } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import EngineeringIcon from '@mui/icons-material/Engineering';
import GroupsIcon from '@mui/icons-material/Groups';
import { Close, Home, Assignment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';

interface SidebarProps {
    drawerVisible: boolean;
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ drawerVisible, toggleDrawer }) => {
    const navigate = useNavigate();

    const { user } = useAuth();

    const handleNavigation = (path: string | undefined) => {
        if (path) {
            navigate(path);
            toggleDrawer(false)({} as React.MouseEvent); // Close drawer on navigation
        }
    };

    const menuItems = [
        { text: 'Visão Geral', path: '/techvisit/home', icon: <Home /> },
        { text: 'Agendamentos', path: '/techvisit/visit-schedule', icon: <Assignment /> },
        { text: 'Clientes', path: '/techvisit/customer', icon: <GroupsIcon /> },
        { text: 'Técnicos', path: '/techvisit/technician', icon: <EngineeringIcon /> },
        user?.role === "ADMIN" ? { text: 'Empresas', path: '/admin/organization', icon: <ApartmentIcon /> } : null,
        user?.role === "ADMIN" ? { text: 'Usuários', path: '/admin/users', icon: <PeopleIcon /> } : null
    ];

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
                {menuItems.filter(f => f !== null).map((item, index) => (
                    <ListItem button key={index} onClick={() => handleNavigation(item?.path)}>
                        <ListItemIcon sx={{ color: 'white' }}>{item?.icon}</ListItemIcon>
                        <ListItemText primary={item?.text} primaryTypographyProps={{ style: { color: 'white' } }} />
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
