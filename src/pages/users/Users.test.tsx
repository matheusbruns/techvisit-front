import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Users } from './Users';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../api/ApiService';
import '@testing-library/jest-dom';
import UserModal from './components/UserModal';
import { toast } from 'react-toastify';
import { UserRole } from './IUser';

jest.mock('../../contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../api/ApiService', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

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
        organization: { id: 1, name: 'Empresa A' },
        formattedCreationDate: '01/01/2021',
        active: true,
        active_description: 'Ativo',
    },
    {
        id: 2,
        login: 'user2',
        role: 'USER',
        role_description: 'Usuário',
        organization: { id: 2, name: 'Empresa B' },
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

        expect(screen.getByText('Criar Novo Usuário')).toBeInTheDocument();
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

describe('Componente UserModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue(mockAuthContextValue);
    });

    const defaultProps = {
        open: true,
        handleClose: jest.fn(),
        rows: mockUsers,
        organizationList: mockOrganizations,
        onSuccess: jest.fn(),
    };

    test('deve renderizar corretamente ao criar um novo usuário', () => {
        render(<UserModal {...defaultProps} />);

        expect(screen.getByText('Criar Novo Usuário')).toBeInTheDocument();
        expect(screen.getByLabelText(/^Login/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Função/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Empresa/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Senha/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Confirmar Senha/i)).toBeInTheDocument();

        fireEvent.mouseDown(screen.getByLabelText(/^Função/i));
        expect(screen.queryByText('Técnico')).not.toBeInTheDocument();
    });

    test('não deve permitir selecionar a função Técnico ao criar um novo usuário', () => {
        render(<UserModal {...defaultProps} />);

        const roleField = screen.getByLabelText(/^Função/i);
        fireEvent.mouseDown(roleField);

        expect(screen.queryByText('Técnico')).not.toBeInTheDocument();
    });


    test('deve renderizar corretamente ao editar um usuário com função Técnico', () => {
        const technicianUser = {
            ...mockUsers[0],
            role: UserRole.TECHNICIAN,
            role_description: 'Técnico',
        };

        render(<UserModal {...defaultProps} userDataSelected={technicianUser} />);

        expect(screen.getByText('Editar Usuário')).toBeInTheDocument();
        expect(screen.getByLabelText(/^Login/i)).toHaveValue(technicianUser.login);
        expect(screen.getByLabelText(/^Função/i)).toHaveTextContent('Técnico');

        expect(screen.getByLabelText(/^Função/i)).toHaveAttribute('aria-disabled', 'true');
    });

    test('deve desabilitar o campo Função ao editar um usuário com função Técnico', () => {
        const technicianUser = {
            ...mockUsers[0],
            role: UserRole.TECHNICIAN,
            role_description: 'Técnico',
        };

        render(<UserModal {...defaultProps} userDataSelected={technicianUser} />);

        expect(screen.getByLabelText(/^Função/i)).toHaveAttribute('aria-disabled', 'true');
    });

    test('deve permitir salvar um usuário com função ADMIN ao criar novo usuário', async () => {
        render(<UserModal {...defaultProps} />);

        fireEvent.change(screen.getByLabelText(/^Login/i), { target: { value: 'newadmin' } });
        fireEvent.mouseDown(screen.getByLabelText(/^Função/i));
        fireEvent.click(screen.getByText('Administrador'));

        fireEvent.mouseDown(screen.getByLabelText(/^Empresa/i));
        fireEvent.click(screen.getByText('Empresa A'));

        fireEvent.change(screen.getByLabelText(/^Senha/i), { target: { value: 'Password123!' } });
        fireEvent.change(screen.getByLabelText(/^Confirmar Senha/i), { target: { value: 'Password123!' } });

        (ApiService.post as jest.Mock).mockResolvedValueOnce({});

        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(ApiService.post).toHaveBeenCalledWith('/auth/register', expect.any(Object));
            expect(toast.success).toHaveBeenCalledWith('Usuário criado com sucesso');
        });
    });

    test('deve mostrar erro ao tentar salvar com senhas que não coincidem', async () => {
        render(<UserModal {...defaultProps} />);

        fireEvent.change(screen.getByLabelText(/^Login/i), { target: { value: 'newuser' } });
        fireEvent.mouseDown(screen.getByLabelText(/^Função/i));
        fireEvent.click(screen.getByText('Administrador'));

        fireEvent.mouseDown(screen.getByLabelText(/^Empresa/i));
        fireEvent.click(screen.getByText('Empresa A'));

        fireEvent.change(screen.getByLabelText(/^Senha/i), { target: { value: 'Password123!' } });
        fireEvent.change(screen.getByLabelText(/^Confirmar Senha/i), { target: { value: 'DifferentPassword!' } });

        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('As senhas não coincidem.');
        });
    });

    test('deve mostrar erro ao tentar salvar com senha fraca', async () => {
        render(<UserModal {...defaultProps} />);

        fireEvent.change(screen.getByLabelText(/^Login/i), { target: { value: 'newuser' } });
        fireEvent.mouseDown(screen.getByLabelText(/^Função/i));
        fireEvent.click(screen.getByText('Administrador'));

        fireEvent.mouseDown(screen.getByLabelText(/^Empresa/i));
        fireEvent.click(screen.getByText('Empresa A'));

        fireEvent.change(screen.getByLabelText(/^Senha/i), { target: { value: 'weak' } });
        fireEvent.change(screen.getByLabelText(/^Confirmar Senha/i), { target: { value: 'weak' } });

        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(screen.getByText('A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos.')).toBeInTheDocument();
        });
    });

    test('deve fechar o modal ao clicar no botão "Cancelar"', () => {
        render(<UserModal {...defaultProps} />);

        const cancelButton = screen.getByText('Cancelar');
        fireEvent.click(cancelButton);

        expect(defaultProps.handleClose).toHaveBeenCalled();
    });
});
