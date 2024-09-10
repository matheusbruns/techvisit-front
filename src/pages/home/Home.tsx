import React, { useState } from 'react';
import Header from "../../util/components/header/Header";
import { Box, Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Slide, Fade } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Calendar, momentLocalizer, Formats, Messages } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Home.scss';

moment.locale('pt-br');

const localizer = momentLocalizer(moment);

const mockData = [
    { id: 1, title: 'Visita - João Silva', subject: 'Visita',  customer: 'João Silva', start: new Date(2024, 7, 10, 14, 0), end: new Date(2024, 7, 10, 16, 0), technician: 'Rainer', address: 'Rua Eugênio Moreira, 547. Apartamento 303', status: 'Agendada' },
    { id: 2, title: 'Visita - Maria Silva', subject: 'Visita', customer: 'Maria Silva', start: new Date(2024, 8, 5, 9, 0), end: new Date(2024, 8, 5, 11, 0), technician: 'Edson', address: 'Rua B, 456', status: 'Atendida' },
    { id: 3, title: 'Instalação - Edilson cardoso', subject: 'Instalação', customer: 'Edilson cardoso', start: new Date(2024, 8, 12, 9, 0), end: new Date(2024, 8, 12, 11, 0), technician: 'Edson', address: 'Rua B, 456', status: 'Agendada' },
    { id: 4, title: 'Limpeza -Edilson cardoso', subject: 'Limpeza', customer: 'Edilson cardoso', start: new Date(2024, 8, 16, 10, 0), end: new Date(2024, 8, 16, 12, 0), technician: 'Vandi', address: 'Rua C, 789', status: 'Agendada' },
    { id: 5, title: 'Visita - Lucas Costa', subject: 'Visita', customer: 'Lucas Costa', start: new Date(2024, 8, 3, 10, 0), end: new Date(2024, 8, 3, 12, 0), technician: 'José', address: 'Rua D, 999', status: 'Não Atendida' },
    { id: 6, title: 'Visita - Lucas Costa', subject: 'Visita', customer: 'Lucas Costa', start: new Date(2024, 8, 3, 10, 0), end: new Date(2024, 8, 3, 12, 0), technician: 'José', address: 'Rua D, 999', status: 'Não Atendida' },
    { id: 7, title: 'Visita - Lucas Costa', subject: 'Visita', customer: 'Lucas Costa', start: new Date(2024, 8, 2, 10, 0), end: new Date(2024, 8, 2, 12, 0), technician: 'José', address: 'Rua D, 999', status: 'Não Atendida' },
];

const messages: Messages = {
    next: "Próximo",
    previous: "Anterior",
    today: "Hoje",
    month: "Mês",
    week: "Semana",
    day: "Dia",
    agenda: "Agenda",
    date: "Data",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "Não há eventos neste intervalo.",
    showMore: (total: number) => `+ Ver mais (${total})`
};

const formats: Formats = {
    dateFormat: 'DD',
    dayFormat: (date: Date, culture: string | undefined, localizer: any) => localizer.format(date, 'dddd DD/MM', culture),
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }, culture: string | undefined, localizer: any) =>
        localizer.format(start, 'DD MMM', culture) + ' - ' + localizer.format(end, 'DD MMM', culture),
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Fade ref={ref} {...props} />;
});

const Home: React.FC = () => {
    const [events, setEvents] = useState(mockData);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [open, setOpen] = useState(false);

    const filteredEvents = events;

    const handleSelectEvent = (event: any) => {
        setSelectedEvent(event);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => setSelectedEvent(null), 300);
    };

    const eventStyleGetter = (event: any) => {
        let backgroundColor = '';

        if (event.status === 'Atendida') {
            backgroundColor = '#3CBC00';
        } else if (event.status === 'Agendada') {
            backgroundColor = '#0273CF';
        } else if (event.status === 'Não Atendida') {
            backgroundColor = '#CF0205';
        }

        return {
            style: {
                backgroundColor,
                color: 'white',
            },
        };
    };

    return (
        <>
            <Header />
            <Box sx={{ width: '100%', marginTop: 5 }}>
                <Container maxWidth={false}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                        Quadro Geral
                    </Typography>

                    <Box sx={{ height: '80vh', width: '100%', backgroundColor: '#fbfbfb' }}>
                        <Calendar
                            localizer={localizer}
                            events={filteredEvents}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: "100%" }}
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
                        <DialogTitle sx={{ fontSize: '24px', fontWeight: 'bold', paddingBottom: '8px' }}>Detalhes da Visita</DialogTitle>
                        <DialogContent dividers sx={{ paddingTop: 1 }}>
                            {selectedEvent && (
                                <>
                                    <Typography variant="h6" gutterBottom><strong>Assunto:</strong> {selectedEvent.subject}</Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body1" gutterBottom><strong>Cliente:</strong> {selectedEvent.customer}</Typography>
                                    <Typography variant="body1" gutterBottom><strong>Data:</strong> {moment(selectedEvent.start).format('DD/MM/YYYY HH:mm')}</Typography>
                                    <Typography variant="body1" gutterBottom><strong>Endereço:</strong> {selectedEvent.address}</Typography>
                                    <Typography variant="body1" gutterBottom><strong>Técnico:</strong> {selectedEvent.technician}</Typography>
                                    <Typography variant="body1" gutterBottom><strong>Status:</strong> {selectedEvent.status}</Typography>
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
                                }}>
                                Fechar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </>
    );
};

export default Home;
