import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Customer from './Customer';
import CustomerModal from './components/CustomerModal';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../api/ApiService';
import '@testing-library/jest-dom';
import { ToastContainer } from 'react-toastify';

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
    ToastContainer: jest.fn(() => null),
}));

jest.mock('../../util/components/dataGrid/GenericDataGrid', () => (props: any) => {
    return (
        <table>
            <tbody>
                {props.rows.map((row: any, index: number) => (
                    <tr key={row.id}>
                        <td>{row.name}</td>
                        <td>
                            <input
                                type="checkbox"
                                aria-label={`Select row ${row.id}`}
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

jest.mock('../../util/components/select/StateSelect', () => (props: any) => (
    <select
        data-testid="state-select"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
    >
        <option value="">Selecione um estado</option>
        <option value="SP">SP</option>
        <option value="RJ">RJ</option>
        <option value="MG">MG</option>
    </select>
));

const mockCustomers = [
    {
        id: 1,
        firstName: 'João',
        lastName: 'Silva',
        cpf: '123.456.789-00',
        phoneNumber: '(11) 91234-5678',
        street: 'Rua Principal',
        number: '123',
        complement: '',
        cep: '12345-678',
        organization: { id: 1, name: 'Empresa A' },
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Centro',
        name: 'João Silva',
        endereco: 'Rua Principal - 123 ',
    },
    {
        id: 2,
        firstName: 'Maria',
        lastName: 'Souza',
        cpf: '987.654.321-00',
        phoneNumber: '(21) 91234-5678',
        street: 'Avenida Secundária',
        number: '456',
        complement: 'Apto 101',
        cep: '87654-321',
        organization: { id: 1, name: 'Empresa A' },
        state: 'RJ',
        city: 'Rio de Janeiro',
        neighborhood: 'Zona Sul',
        name: 'Maria Souza',
        endereco: 'Avenida Secundária - 456, Apto 101',
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

describe('Componente Customer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue(mockAuthContextValue);
    });

    test('deve renderizar o componente Customer corretamente', async () => {
        (ApiService.get as jest.Mock).mockResolvedValueOnce(mockCustomers);

        render(<Customer />);

        await waitFor(() => {
            expect(ApiService.get).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText('Clientes')).toBeInTheDocument();
        expect(screen.getByText('Novo Cliente')).toBeInTheDocument();
    });

    test('deve abrir o modal ao clicar no botão "Novo Cliente"', async () => {
        (ApiService.get as jest.Mock).mockResolvedValueOnce(mockCustomers);

        render(<Customer />);

        await waitFor(() => {
            expect(ApiService.get).toHaveBeenCalledTimes(1);
        });

        const addButton = screen.getByText('Novo Cliente');
        fireEvent.click(addButton);

        expect(screen.getByText('Cadastrar Novo Cliente')).toBeInTheDocument();
    });

    test('deve abrir o modal de edição ao clicar no botão "Editar"', async () => {
        (ApiService.get as jest.Mock).mockResolvedValueOnce(mockCustomers);

        render(<Customer />);

        await waitFor(() => {
            expect(ApiService.get).toHaveBeenCalledTimes(1);
        });

        const firstRowCheckbox = screen.getByLabelText('Select row 1');
        fireEvent.click(firstRowCheckbox);

        const editButton = screen.getByLabelText('Editar');
        fireEvent.click(editButton);

        expect(screen.getByText('Editar Cliente')).toBeInTheDocument();
    });
});

describe('Componente CustomerModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue(mockAuthContextValue);
    });

    const defaultProps = {
        open: true,
        handleClose: jest.fn(),
        rows: mockCustomers,
        onSuccess: jest.fn(),
    };

    test('deve renderizar corretamente ao criar um novo cliente', () => {
        render(
            <>
                <CustomerModal {...defaultProps} />
                <ToastContainer />
            </>
        );

        expect(screen.getByText('Cadastrar Novo Cliente')).toBeInTheDocument();
        expect(screen.getByLabelText(/^Nome/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Sobrenome/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^CPF/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Número de Telefone/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Cidade/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Bairro/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Rua/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Complemento/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^CEP/i)).toBeInTheDocument();
    });

    test('deve fechar o modal ao clicar no botão "Cancelar"', () => {
        render(<CustomerModal {...defaultProps} />);

        const cancelButton = screen.getByText('Cancelar');
        fireEvent.click(cancelButton);

        expect(defaultProps.handleClose).toHaveBeenCalled();
    });
});
