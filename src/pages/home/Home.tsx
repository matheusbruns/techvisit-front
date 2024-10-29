import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Fade,
    Select,
    MenuItem,
    SelectChangeEvent,
    Paper
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Calendar, momentLocalizer, Formats, Messages } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Home.scss';
import { VisitScheduleData, VisitScheduleStatus } from '../visitSchedules/IVisitSchedule';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import ApiService from '../../api/ApiService';

moment.locale('pt-br');

const localizer = momentLocalizer(moment);

const messages: Messages = {
    next: 'Próximo',
    previous: 'Anterior',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há eventos neste intervalo.',
    showMore: (total: number) => `+ Ver mais (${total})`,
};

const formats: Formats = {
    dateFormat: 'DD',
    dayFormat: (date: Date, culture: string | undefined, localizer: any) =>
        localizer.format(date, 'dddd DD/MM', culture),
    dayRangeHeaderFormat: (
        { start, end }: { start: Date; end: Date },
        culture: string | undefined,
        localizer: any
    ) => localizer.format(start, 'DD MMM', culture) + ' - ' + localizer.format(end, 'DD MMM', culture),
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Fade ref={ref} {...props} />;
});

const Home: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [statusInput, setStatusInput] = useState<VisitScheduleStatus | ''>('');
    const [open, setOpen] = useState(false);
    const AuthContext = useAuth();

    const fetchData = async () => {
        if (!AuthContext.user) return;
        try {
            const organization = AuthContext.user.organization.id;
            const response: any = await ApiService.get(`/visit-schedule?organization=${organization}`);
            const events = response.map((schedule: VisitScheduleData) => ({
                id: schedule.id,
                title: `${schedule.description} - ${schedule.customer.firstName} ${schedule.customer.lastName}`,
                subject: schedule.description,
                customer: `${schedule.customer.firstName} ${schedule.customer.lastName}`,
                start: new Date(schedule.startDate!),
                end: new Date(schedule.endDate!),
                technician: schedule.technician.name,
                comment: schedule.comment,
                address: `${schedule.street}, ${schedule.number}${schedule.complement ? ', ' + schedule.complement : ''
                    }, ${schedule.neighborhood}, ${schedule.city} - ${schedule.state}`,
                status: schedule.status,
            }));
            setEvents(events);
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

    const handleSelectEvent = (event: any) => {
        setSelectedEvent(event);
        setStatusInput(event.status);
        setOpen(true);
    };

    const handleStatusChange = (event: SelectChangeEvent<VisitScheduleStatus>) => {
        setStatusInput(event.target.value as VisitScheduleStatus);
    };

    const handleSaveStatus = async () => {
        if (!selectedEvent) return;
        try {
            await ApiService.put('/visit-schedule/status', {
                visitScheduleId: selectedEvent.id,
                status: statusInput,
            });

            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === selectedEvent.id ? { ...event, status: statusInput } : event
                )
            );
            setSelectedEvent((prev: any) => ({ ...prev, status: statusInput }));
            toast.success('Status atualizado com sucesso', {
                className: 'toast-custom',
            });
        } catch (error) {
            console.error('Erro ao atualizar status', error);
            toast.error('Erro ao atualizar status');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => setSelectedEvent(null), 300);
    };

    const eventStyleGetter = (event: any) => {
        let backgroundColor = '';

        switch (event.status) {
            case VisitScheduleStatus.ATTENDED:
                backgroundColor = '#3CBC00';
                break;
            case VisitScheduleStatus.NOT_ATTENDED:
                backgroundColor = '#CF0205';
                break;
            case VisitScheduleStatus.CANCELLED:
                backgroundColor = '#A9A9A9';
                break;
            default:
                backgroundColor = '#007bff';
        }

        return {
            style: {
                backgroundColor,
                color: 'white',
            },
        };
    };

    return (
        <Box sx={{ width: '100%', marginTop: 5 }}>
            <Container maxWidth={false}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                    Quadro Geral
                </Typography>

                <Box sx={{ height: '80vh', width: '100%', backgroundColor: '#fbfbfb' }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        eventPropGetter={eventStyleGetter}
                        onSelectEvent={handleSelectEvent}
                        messages={messages}
                        formats={formats}
                    />
                </Box>

                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    onClose={handleClose}
                    fullWidth={true}
                    maxWidth="md"
                >
                    <DialogTitle sx={{ fontSize: '24px', fontWeight: 'bold', paddingBottom: '8px' }}>
                        Detalhes da Visita
                    </DialogTitle>
                    <DialogContent dividers sx={{ paddingTop: 1 }}>
                        {selectedEvent && (
                            <>
                                <Typography variant="h6" gutterBottom sx={{ fontSize: '18px', mb: 2 }}>
                                    <strong>Assunto:</strong> {selectedEvent.subject}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body1" gutterBottom sx={{ fontSize: '16px', mb: 2 }}>
                                    <strong>Cliente:</strong> {selectedEvent.customer}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ fontSize: '16px', mb: 2 }}>
                                    <strong>Data:</strong>{' '}
                                    {moment(selectedEvent.start).format('DD/MM/YYYY HH:mm')}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ fontSize: '16px', mb: 2 }}>
                                    <strong>Endereço:</strong> {selectedEvent.address}
                                </Typography>
                                {selectedEvent.address && (
                                    <Typography variant="body1" gutterBottom sx={{ fontSize: '16px', mb: 2 }}>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.address)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ textDecoration: 'none', color: '#0273CF' }}
                                        >
                                            Ver no Google Maps
                                        </a>
                                    </Typography>
                                )}
                                <Typography variant="body1" gutterBottom sx={{ fontSize: '16px', mb: 2 }}>
                                    <strong>Técnico:</strong> {selectedEvent.technician}
                                </Typography>
                                <Box display="flex" alignItems="center" justifyContent="flex-start" gap={2}>
                                    <Typography variant="body1" sx={{ fontSize: '16px' }}>
                                        <strong>Status:</strong>
                                    </Typography>
                                    <Select
                                        value={statusInput}
                                        onChange={handleStatusChange}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Status' }}
                                        sx={{ width: 150, height: 40 }}
                                    >
                                        <MenuItem value={VisitScheduleStatus.SCHEDULED}>Agendado</MenuItem>
                                        <MenuItem value={VisitScheduleStatus.ATTENDED}>Atendido</MenuItem>
                                        <MenuItem value={VisitScheduleStatus.NOT_ATTENDED}>Não Atendido</MenuItem>
                                        <MenuItem value={VisitScheduleStatus.CANCELLED}>Cancelado</MenuItem>
                                    </Select>
                                    {statusInput !== selectedEvent.status && (
                                        <Button
                                            onClick={handleSaveStatus}
                                            size="small"
                                            variant="contained"
                                            sx={{
                                                marginLeft: 1,
                                                backgroundColor: '#f97316',
                                                color: '#ffffff',
                                                height: 40,
                                            }}
                                        >
                                            Salvar
                                        </Button>
                                    )}
                                </Box>
                                <Typography variant="body1" gutterBottom sx={{ fontSize: '16px', mb: 2, mt: 2 }}>
                                    <strong>Comentários:</strong>
                                </Typography>
                                <Paper elevation={1} sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                                    <Typography variant="body1"
                                        sx={{
                                            fontSize: '16px',
                                            wordBreak: 'break-word',
                                            overflowWrap: 'break-word',
                                        }}>
                                        {selectedEvent.comment || 'Nenhum comentário disponível.'}
                                    </Typography>
                                </Paper>

                            </>
                        )}
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={handleClose}
                            sx={{
                                backgroundColor: '#f97316',
                                color: '#ffffff',
                                '&:hover': {
                                    backgroundColor: '#e56b0a',
                                },
                            }}
                        >
                            Fechar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default Home;
