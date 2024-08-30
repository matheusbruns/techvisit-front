import React, { useState } from 'react';
import Logo from '../../resources/images/logo.png';
import illustration from '../../resources/images/login-illustration.png';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Checkbox, FormControlLabel, CircularProgress, Typography, Box, Container, Grid, createTheme, ThemeProvider } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../conection/api';
import { LoginResponse } from './ILogin';
import { toast } from 'react-toastify';

const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#f97316',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        '&.Mui-focused': {
                            color: '#f97316',
                        },
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#f97316',
                    '&:hover': {
                        backgroundColor: '#d86012',
                    },
                    padding: '10px 20px',
                    borderRadius: '5px',
                },
            },
        },
    },
});

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { authlogin } = useAuth();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const login = username;
            const response: LoginResponse = await ApiService.post('/auth/login', { login, password });
            const token: any = response.token;
            ApiService.setAuthorizationHeader(token);
            authlogin(response.user, token);
        } catch (error) {
            toast.error("Usuário ou senha invalidos!")
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Grid container className="login-page">
            <ThemeProvider theme={theme}>

                <Grid item xs={12} md={6} className="login-left">
                    <Typography variant="h3" component="h1" gutterBottom>
                        <b className='journey'>Simplificando sua </b><br /> jornada digital!
                    </Typography>
                    <Box component="img" src={illustration} alt="Ilustração" className="illustration" />
                </Grid>

                <Grid item xs={12} md={6} className="login-right">
                    <Container maxWidth="xs">
                        <Box className="login-logo" textAlign="center" mb={2}>
                            <Box component="img" src={Logo} alt="Logo TechVisit" />
                        </Box>
                        <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
                            Acesse sua conta
                        </Typography>
                        <form onSubmit={handleLogin} className="login-form">
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Usuário"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required

                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Senha"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                margin="normal"
                            />
                            <FormControlLabel
                                control={<Checkbox id="remember" />}
                                label="Lembrar"
                                className="remember-me"
                            />
                            <Box textAlign="center" mt={2}>
                                <Button
                                    className=''
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={isLoading}
                                    startIcon={isLoading && <CircularProgress size={20} />}
                                >
                                    Entrar
                                </Button>
                            </Box>
                        </form>
                    </Container>
                </Grid>
            </ThemeProvider>
        </Grid>
    );
};
