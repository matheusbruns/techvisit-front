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
    Divider,
    Chip,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import ApiService from '../../conection/api';
import { VisitScheduleData } from '../visitSchedules/IVisitSchedule';

const MtVisits: React.FC = () => {
    const [visits, setVisits] = useState<any[]>([]);
    const [initialValues, setInitialValues] = useState<{ [key: number]: { price: number; comment: string } }>({});
    const AuthContext = useAuth();

    const isToday = (someDate: Date) => {
        const today = new Date();
        return (
            someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear()
        );
    };

    const isTomorrow = (someDate: Date) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return (
            someDate.getDate() === tomorrow.getDate() &&
            someDate.getMonth() === tomorrow.getMonth() &&
            someDate.getFullYear() === tomorrow.getFullYear()
        );
    };

    const fetchData = async () => {
        if (!AuthContext.user) return;
        try {
            const organization = AuthContext.user.organization.id;
            const user = AuthContext.user.id;
            const response: any = await ApiService.get(`/visit-schedule/my-visits?organization=${organization}&user=${user}`);
            const visits = response.map((schedule: VisitScheduleData) => {
                const startDate = new Date(schedule.startDate!);
                return {
                    id: schedule.id,
                    title: `${schedule.description} - ${schedule.customer.firstName} ${schedule.customer.lastName}`,
                    description: schedule.description,
                    customer: `${schedule.customer.firstName} ${schedule.customer.lastName}`,
                    start: startDate,
                    end: new Date(schedule.endDate!),
                    technician: schedule.technician.name,
                    address: `${schedule.street}, ${schedule.number}${schedule.complement ? ', ' + schedule.complement : ''
                        }, ${schedule.neighborhood}, ${schedule.city} - ${schedule.state}`,
                    status: schedule.status,
                    comment: schedule.comment,
                    price: schedule.price,
                    isToday: isToday(startDate),
                    isTomorrow: isTomorrow(startDate),
                };
            });

            visits.sort((a: { start: number; }, b: { start: number; }) => {
                const getSortValue = (visit: any) => {
                    if (visit.isToday) {
                        return 1;
                    } else if (visit.isTomorrow) {
                        return 2;
                    } else if (visit.start > new Date()) {
                        return 3;
                    } else {
                        return 4;
                    }
                };

                const sortValueA = getSortValue(a);
                const sortValueB = getSortValue(b);

                if (sortValueA !== sortValueB) {
                    return sortValueA - sortValueB;
                } else {
                    return a.start - b.start;
                }
            });

            setVisits(visits);
            const initial = visits.reduce((
                acc: { [x: string]: { price: any; comment: any } },
                visit: { id: string | number; price: any; comment: any }
            ) => {
                acc[visit.id] = { price: visit.price, comment: visit.comment };
                return acc;
            },
                {} as { [key: number]: { price: number; comment: string } }
            );
            setInitialValues(initial);
        } catch (error) {
            console.error('Erro ao buscar dados', error);
            toast.error('Erro ao buscar dados');
        }
    };

    useEffect(() => {
        if (AuthContext.user) {
            fetchData();
        }
    }, [AuthContext.user]);

    const handleSave = async (id: number) => {
        const visitToUpdate = visits.find((v) => v.id === id);
        if (!visitToUpdate) {
            toast.error('Visita não encontrada.');
            return;
        }

        try {
            const updatedVisitData = {
                id: visitToUpdate.id,
                price: visitToUpdate.price,
                comment: visitToUpdate.comment,
            };
            await ApiService.put('/visit-schedule/my-visits/update', updatedVisitData);

            setInitialValues((prevValues) => ({
                ...prevValues,
                [id]: {
                    price: visitToUpdate.price,
                    comment: visitToUpdate.comment,
                },
            }));

            toast.success('Salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar', error);
            toast.error('Erro ao salvar');
        }
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
            <Typography variant="h4" gutterBottom
                sx={{
                    marginBottom: 4,
                    fontSize: {
                        xs: '1.8rem',
                        sm: '2rem',
                        md: '2.5rem',
                        lg: '2.5rem',
                    },
                }}
            >
                Meus Chamados
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>

                {visits.length === 0 ? (

                    <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 4 }}>
                        Não há visitas agendadas no momento.
                    </Typography>

                ) : (visits.map((visit) => (

                    <Card key={visit.id} sx={{ display: 'flex', flexDirection: 'column', gap: 1, backgroundColor: '#f3f3f3', marginBottom: 4 }}>
                        <CardContent>
                            <Typography variant="h6">{visit.description}</Typography>

                            {visit.isToday && (
                                <Chip label="Hoje" color="primary" sx={{ mb: 1, color: '#ffffff' }} />
                            )}
                            {visit.isTomorrow && !visit.isToday && (
                                <Chip label="Amanhã" color="secondary" sx={{ mb: 1 }} />
                            )}

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
                                onClick={() => handleSave(visit.id)}
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
                )))}
            </Box>
        </Container>
    );
};

export default MtVisits;
