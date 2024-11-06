import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Users } from './Users';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../api/ApiService';
import '@testing-library/jest-dom';

jest.mock('../../contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../api/ApiService', () => ({
    get: jest.fn(),
    delete: jest.fn(),
}));

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('./components/UserModal', () => (props: any) => {
    return props.open ? (
        <div>
            <h2>{props.userDataSelected ? 'Editar Usuário' : 'Adicionar Usuário'}</h2>
        </div>
    ) : null;
});

jest.mock('../../util/components/dataGrid/GenericDataGrid', () => (props: any) => {
    return (
        <table>
            <tbody>
                {props.rows.map((row: any, index: number) => (
                    <tr key={row.id}>
                        <td>{row.login}</td>
                        <td>
                            <input
                                type="checkbox"
                                aria-label={`Select row ${index}`}
                                onChange={() => {
                                    props.onRowSelectionChange([row.id]);
                                }}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
});

const mockUsers = [
    {
        id: 1,
        login: 'user1',
        role: 'ADMIN',
        role_description: 'Administrador',
        organization: 'Empresa A',
        formattedCreationDate: '01/01/2021',
        active: true,
        active_description: 'Ativo',
    },
    {
        id: 2,
        login: 'user2',
        role: 'USER',
        role_description: 'Usuário',
        organization: 'Empresa B',
        formattedCreationDate: '02/01/2021',
        active: false,
        active_description: 'Inativo',
    },
];

const mockOrganizations = [
    {
        id: 1,
        name: 'Empresa A',
        externalCode: 'EA',
    },
    {
        id: 2,
        name: 'Empresa B',
        externalCode: 'EB',
    },
];

const mockAuthContextValue = {
    user: {
        login: 'currentUser',
        role: 'ADMIN',
        organization: {
            id: 1,
            name: 'Empresa A',
            externalCode: 'EA',
        },
    },
};

describe('Componente Users', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue(mockAuthContextValue);
    });

    test('deve renderizar o componente Users corretamente', async () => {
        (ApiService.get as jest.Mock)
            .mockResolvedValueOnce(mockOrganizations)
            .mockResolvedValueOnce(mockUsers);

        render(<Users />);

        await waitFor(() => {
            expect(ApiService.get).toHaveBeenCalledTimes(2);
        });

        expect(screen.getByText('Usuários')).toBeInTheDocument();
        expect(screen.getByText('Novo Usuário')).toBeInTheDocument();

        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.getByText('user2')).toBeInTheDocument();
    });

    test('deve abrir o modal ao clicar no botão "Novo Usuário"', async () => {
        (ApiService.get as jest.Mock)
            .mockResolvedValueOnce(mockOrganizations)
            .mockResolvedValueOnce(mockUsers);

        render(<Users />);

        await waitFor(() => {
            expect(ApiService.get).toHaveBeenCalledTimes(2);
        });

        const addButton = screen.getByText('Novo Usuário');
        fireEvent.click(addButton);

        expect(screen.getByText('Adicionar Usuário')).toBeInTheDocument();
    });

    test('deve abrir o modal de edição ao clicar no botão "Editar"', async () => {
        (ApiService.get as jest.Mock)
            .mockResolvedValueOnce(mockOrganizations)
            .mockResolvedValueOnce(mockUsers);

        render(<Users />);

        await waitFor(() => {
            expect(ApiService.get).toHaveBeenCalledTimes(2);
        });

        const firstRowCheckbox = screen.getByLabelText('Select row 0');
        fireEvent.click(firstRowCheckbox);

        const editButton = screen.getByLabelText('Editar');
        fireEvent.click(editButton);

        expect(screen.getByText('Editar Usuário')).toBeInTheDocument();
    });

});
