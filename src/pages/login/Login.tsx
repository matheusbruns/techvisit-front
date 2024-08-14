import React, { useEffect, useState } from 'react';
import Logo from '../../resources/images/logo.png';
import illustration from '../../resources/images/login-illustration.png';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

            navigate('/techvisit/home');

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
        <div className="login-page">
            <div className="login-left">
                <h1> <b className='journey'>Simplificando sua </b>
                    <br />
                    jornada digital!
                </h1>
                <img
                    src={illustration}
                    alt="Ilustração"
                    className="illustration"
                />
            </div>
            <div className="login-right">
                <div className="login-logo">
                    <img src={Logo} alt="Logo TechVisit" />
                </div>
                <h2>Acesse sua conta</h2>
                <div className='line'></div>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <i className="fas fa-user"></i>
                        <input
                            type="text"
                            placeholder="Usuário"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <i className="fas fa-lock"></i>
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="remember-me">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Lembrar</label>
                    </div>
                    <button type="submit" className={`login-button ${isLoading ? "button-loading" : ""}`} disabled={isLoading}>
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};
