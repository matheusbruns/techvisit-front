import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Logout from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useAuth } from '../../../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { validatePasswordStrength } from '../../../format/IFunctions';
import { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../../../../api/ApiService';

export default function MenuProfile() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const { logout, user } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleCloseMenu();
    };

    const handleOpenModal = () => {
        handleCloseMenu();
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setPassword('');
        setPasswordError(false);
        setIsEditingPassword(false);
    };
    
    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPassword(value);
        setPasswordError(!validatePasswordStrength(value));
    };

    const handleSave = async () => {
        if (!passwordError && password) {

            try {
                await api.put('/user/update-password', {
                    login: user.login,
                    password: password,
                });
                toast.success('Senha alterada com sucesso!');
            } catch (error) {
                toast.error('Erro ao alterar a senha');
            }

            handleCloseModal();
        }
    };

    const handleEditPassword = () => {
        setIsEditingPassword(true);
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                    cursor: 'pointer',
                    padding: '13px',
                    width: 60,
                }}
                onClick={handleClick}
            >
                <Avatar sx={{ width: 32, height: 32 }} />
                {openMenu ? (
                    <ExpandLessIcon sx={{ color: '#bdbdbd' }} />
                ) : (
                    <ExpandMoreIcon sx={{ color: '#bdbdbd' }} />
                )}
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={openMenu}
                onClose={handleCloseMenu}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleOpenModal}>
                    <Avatar /> Minha Conta
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Sair
                </MenuItem>
            </Menu>
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        width: '100%',
                        maxWidth: { xs: '90%', sm: '500px' },
                    },
                }}
            >
                <DialogTitle>Minha Conta</DialogTitle>
                <DialogContent sx={{ paddingX: { xs: 2, sm: 4 } }}>
                    <TextField
                        margin="dense"
                        id="login"
                        label="Login"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={user.login || ''}
                        disabled
                        sx={{ marginBottom: 2 }}
                    />
                    {!isEditingPassword ? (
                        <Button
                            variant="contained"
                            onClick={handleEditPassword}
                            sx={{
                                backgroundColor: '#f97316',
                                color: '#ffffff',
                                height: 40,
                                mt: 2
                            }}
                        >
                            Editar Senha
                        </Button>
                    ) : (
                        <TextField
                            margin="dense"
                            id="password"
                            label="Senha"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            variant="outlined"
                            value={password}
                            onChange={handlePasswordChange}
                            error={passwordError}
                            helperText={
                                passwordError
                                    ? 'A senha deve conter letras maiúsculas, números e caracteres especiais'
                                    : ''
                            }
                            autoComplete="off"
                            sx={{ marginBottom: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            aria-label="toggle password visibility"
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={!password || passwordError || !isEditingPassword}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
