import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import MtVisits from './MyVisits';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../api/ApiService';
import '@testing-library/jest-dom';
import { toast } from 'react-toastify';

jest.mock('../../contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../api/ApiService', () => ({
    get: jest.fn(),
    put: jest.fn(),
}));

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockVisits = [
    {
        id: 1,
        description: 'Visita Técnica',
        customer: { firstName: 'Maria', lastName: 'Silva' },
        startDate: '2023-10-12T10:00:00Z',
        endDate: '2023-10-12T12:00:00Z',
        technician: { name: 'José' },
        street: 'Rua A',
        number: '123',
        complement: '',
        neighborhood: 'Centro',
        city: 'Cidade X',
        state: 'SP',
        status: 'Agendado',
        comment: '',
        price: 150.0,
    },
];

const mockAuthContextValue = {
    user: {
        organization: { id: 1 },
        id: 123,
    },
};

describe('Componente MtVisits', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue(mockAuthContextValue);
    });

    test('deve renderizar o componente e buscar visitas corretamente', async () => {
        (ApiService.get as jest.Mock).mockResolvedValueOnce(mockVisits);

        await act(async () => {
            render(<MtVisits />);
        });

        await waitFor(() => {
            expect(ApiService.get).toHaveBeenCalledWith('/visit-schedule/my-visits?organization=1&user=123');
        });

        expect(screen.getByText('Meus Chamados')).toBeInTheDocument();
        expect(screen.getByText('Visita Técnica')).toBeInTheDocument();
        expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    test('deve exibir "Hoje" para visitas com data atual e "Amanhã" para visitas do dia seguinte', async () => {
        const todayVisit = { ...mockVisits[0], startDate: new Date().toISOString() };
        (ApiService.get as jest.Mock).mockResolvedValueOnce([todayVisit]);

        await act(async () => {
            render(<MtVisits />);
        });

        await waitFor(() => {
            expect(screen.getByText('Hoje')).toBeInTheDocument();
        });
    });

    test('deve salvar alterações de preço e comentário', async () => {
        (ApiService.get as jest.Mock).mockResolvedValueOnce(mockVisits);

        await act(async () => {
            render(<MtVisits />);
        });

        await waitFor(() => {
            expect(screen.getByText('Visita Técnica')).toBeInTheDocument();
        });

        const priceField = screen.getByLabelText('Preço');
        fireEvent.change(priceField, { target: { value: '200,00' } });
        const commentField = screen.getByLabelText('Comentário');
        fireEvent.change(commentField, { target: { value: 'Comentário de teste' } });

        const saveButton = screen.getByText('Salvar');
        await act(async () => {
            fireEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(ApiService.put).toHaveBeenCalledWith('/visit-schedule/my-visits/update', {
                id: 1,
                price: 200.0,
                comment: 'Comentário de teste',
            });
            expect(toast.success).toHaveBeenCalledWith('Salvo com sucesso!');
        });
    });

    test('deve limitar comentário a 1000 caracteres', async () => {
        (ApiService.get as jest.Mock).mockResolvedValueOnce(mockVisits);

        await act(async () => {
            render(<MtVisits />);
        });

        const commentField = screen.getByLabelText('Comentário');
        const longText = 'a'.repeat(1001);
        fireEvent.change(commentField, { target: { value: longText } });

        expect(toast.error).toHaveBeenCalledWith('Comentário muito grande. Limite de 1000 caracteres');
    });
});
