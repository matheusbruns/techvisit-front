import React, { useState } from 'react';
import Logo from '../../resources/images/logo.png';
import illustration from '../../resources/images/login-illustration.png';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Checkbox, FormControlLabel, CircularProgress, Typography, Box, Container, Grid, createTheme, ThemeProvider } from '@mui/material';
import { deepOrange } from '@mui/material/colors';

const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#f97316', // Define a cor da borda ao focar
                        },
                    },
                    '& .MuiInputLabel-root': {
                        '&.Mui-focused': {
                            color: '#f97316', // Define a cor do label ao focar
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
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('/login', { username, password });

            localStorage.setItem('user', JSON.stringify(response.data.user));

            navigate('/techvisit/home');
        } catch (error) {

            localStorage.setItem('user', JSON.stringify("aaaaaaaaaaaaaa"));

            window.location.reload()

            // if (axios.isAxiosError(error) && error.response) {
            //     alert(error.response.data.message || 'Erro ao tentar fazer login. Tente novamente.');
            // } else {
            //     alert('Erro ao tentar fazer login. Tente novamente.');
            // }
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


// import React, { useEffect, useState } from 'react';
// import Logo from '../../resources/images/logo.png';
// import illustration from '../../resources/images/login-illustration.png';
// import './Login.scss';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// export function Login() {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleLogin = async (event: React.FormEvent) => {
//         event.preventDefault();
//         setIsLoading(true);

//         try {
//             const response = await axios.post('/login', { username, password });

//             localStorage.setItem('user', JSON.stringify(response.data.user));

//             navigate('/techvisit/home');
//         } catch (error) {
            
//             localStorage.setItem('user', JSON.stringify("aaaaaaaaaaaaaa"));

//             navigate('/techvisit/home');

//             // if (axios.isAxiosError(error) && error.response) {
//             //     alert(error.response.data.message || 'Erro ao tentar fazer login. Tente novamente.');
//             // } else {
//             //     alert('Erro ao tentar fazer login. Tente novamente.');
//             // }
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="login-page">
//             <div className="login-left">
//                 <h1> <b className='journey'>Simplificando sua </b>
//                     <br />
//                     jornada digital!
//                 </h1>
//                 <img
//                     src={illustration}
//                     alt="Ilustração"
//                     className="illustration"
//                 />
//             </div>
//             <div className="login-right">
//                 <div className="login-logo">
//                     <img src={Logo} alt="Logo TechVisit" />
//                 </div>
//                 <h2>Acesse sua conta</h2>
//                 <div className='line'></div>
//                 <form onSubmit={handleLogin} className="login-form">
//                     <div className="input-group">
//                         <i className="fas fa-user"></i>
//                         <input
//                             type="text"
//                             placeholder="Usuário"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="input-group">
//                         <i className="fas fa-lock"></i>
//                         <input
//                             type="password"
//                             placeholder="Senha"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="remember-me">
//                         <input type="checkbox" id="remember" />
//                         <label htmlFor="remember">Lembrar</label>
//                     </div>
//                     <button type="submit" className={`login-button ${isLoading ? "button-loading" : ""}`} disabled={isLoading}>
//                         Entrar
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };
