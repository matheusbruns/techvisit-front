import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Card,
    CardContent,
    CardActions,
    Typography,
    TextField,
    Button,
    Divider
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import ApiService from '../../conection/api';

const MtVisits: React.FC = () => {
    const [visits, setVisits] = useState<any[]>([]);
    const [initialValues, setInitialValues] = useState<{ [key: number]: { price: number; comment: string } }>({});
    const AuthContext = useAuth();

    useEffect(() => {
        const mockData = [
            {
                id: 1,
                description: 'Instalação de Ar Condicionado',
                customer: 'João Silva',
                start: new Date(2024, 7, 10, 14, 0),
                end: new Date(2024, 7, 10, 16, 0),
                address: 'Rua Eugênio Moreira, 547, Apartamento 303',
                status: 'Agendado',
                price: 250.0,
                comment: 'Cliente prefere instalação no período da tarde.',
                technician: 'Rainer',
            },
            {
                id: 2,
                description: 'Manutenção',
                customer: 'Maria Oliveira',
                start: new Date(2024, 8, 5, 9, 0),
                end: new Date(2024, 8, 5, 11, 0),
                address: 'Rua A, 123',
                status: 'Atendido',
                price: 180.0,
                comment: 'Cliente pediu para verificar vazamento.',
                technician: 'Eduardo',
            },
        ];
        setVisits(mockData);

        const initial = mockData.reduce((acc, visit) => {
            acc[visit.id] = { price: visit.price, comment: visit.comment };
            return acc;
        }, {} as { [key: number]: { price: number; comment: string } });
        setInitialValues(initial);
    }, []);

    const handleSave = (id: number, updatedPrice: number, updatedComment: string) => {
        toast.success('Alterações salvas com sucesso');
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const value = event.target.value.replace(/\D/g, '');
        const formattedValue = (parseFloat(value) / 100).toFixed(2);
        const updatedVisits = visits.map((v) =>
            v.id === id ? { ...v, price: parseFloat(formattedValue) } : v
        );
        setVisits(updatedVisits);
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const updatedVisits = visits.map((v) =>
            v.id === id ? { ...v, comment: event.target.value } : v
        );
        setVisits(updatedVisits);
    };

    const formatPrice = (price: number) => {
        if (isNaN(price) || price === null || price === undefined) {
            return 'R$ 0,00';
        }
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    const hasChanges = (visit: any) => {
        const initial = initialValues[visit.id];
        return (
            initial &&
            (visit.price !== initial.price || visit.comment !== initial.comment)
        );
    };

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Meus Chamados
            </Typography>
            <Box display="flex" flexDirection="column" gap={4}>
                {visits.map((visit) => (
                    <Card key={visit.id} sx={{ display: 'flex', flexDirection: 'column', gap: 1, backgroundColor: '#f3f3f3' }}>
                        <CardContent>
                            <Typography variant="h6">{visit.description}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                <strong>Cliente:</strong> {visit.customer}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                <strong>Data:</strong> {visit.start.toLocaleString()} - {visit.end.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                <strong>Endereço:</strong> {visit.address}
                            </Typography>
                            {visit.address && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(visit.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'none', color: '#0273CF' }}
                                    >
                                        Ver no Google Maps
                                    </a>
                                </Typography>
                            )}
                            <Divider sx={{ my: 2 }} />
                            <TextField
                                label="Preço"
                                type="text"
                                variant="outlined"
                                value={formatPrice(visit.price)}
                                onChange={(e: any) => handlePriceChange(e, visit.id)}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Comentário"
                                multiline
                                minRows={2}
                                maxRows={6}
                                variant="outlined"
                                value={visit.comment}
                                onChange={(e: any) => handleCommentChange(e, visit.id)}
                                fullWidth
                            />
                        </CardContent>
                        <CardActions>
                            <Button
                                onClick={() => handleSave(visit.id, visit.price, visit.comment)}
                                variant="contained"
                                disabled={!hasChanges(visit)}
                                sx={{
                                    backgroundColor: '#f97316',
                                    color: '#ffffff',
                                    '&:disabled': {
                                        backgroundColor: '#cccccc',
                                    },
                                }}
                            >
                                Salvar
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
        </Container>
    );
};

export default MtVisits;
