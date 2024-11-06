import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Login } from '../../pages/login/Login';
import { useAuth } from '../../contexts/AuthContext';
import '@testing-library/jest-dom';

jest.mock('../../contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../api/ApiService', () => ({
    post: jest.fn(),
    setAuthorizationHeader: jest.fn(),
}));

describe('Componente Login', () => {
    const mockAuthLogin = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useAuth as jest.Mock).mockReturnValue({
            authlogin: mockAuthLogin,
        });
    });

    test('renderiza o formulário de login corretamente', () => {
        render(<Login />);

        expect(screen.getByLabelText(/Usuário/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    test('permite que o usuário insira nome de usuário e senha', () => {
        render(<Login />);

        const inputUsuario = screen.getByLabelText(/Usuário/i);
        const inputSenha = screen.getByLabelText(/Senha/i);

        fireEvent.change(inputUsuario, { target: { value: 'meuusuario' } });
        fireEvent.change(inputSenha, { target: { value: 'minhasenha' } });

        expect(inputUsuario).toHaveValue('meuusuario');
        expect(inputSenha).toHaveValue('minhasenha');
    });

});
