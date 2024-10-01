import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Grid, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import { toast } from 'react-toastify';
import ApiService from '../../../conection/api';
import { VisitScheduleData, initialVisitScheduleData } from '../IVisitSchedule';
import { useAuth } from '../../../contexts/AuthContext';
import StateSelect from '../../../util/components/select/StateSelect';
import { formatCEP } from '../../../util/format/IFunctions';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/pt-br';
import dayjs, { Dayjs } from 'dayjs';

interface VisitScheduleModalProps {
    open: boolean;
    handleClose: () => void;
    rows: any[];
    visitDataSelected?: any;
    onSuccess?: () => void;
}

const VisitScheduleModal: React.FC<VisitScheduleModalProps> = ({ open, handleClose, rows, visitDataSelected, onSuccess }) => {
    const [visitData, setVisitData] = useState<VisitScheduleData>(initialVisitScheduleData);
    const [customers, setCustomers] = useState<any[]>([]);
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [priceNumber, setPriceNumber] = useState<number | null>(null);
    const [startDateTime, setStartDateTime] = useState<dayjs.Dayjs | null>(null);
    const [endDateTime, setEndDateTime] = useState<dayjs.Dayjs | null>(null);
    const AuthContext = useAuth();

    useEffect(() => {
        if (open) {
            const fetchCustomersAndTechnicians = async () => {
                try {
                    const organizationId = AuthContext.user.organization.id;

                    const customerResponse: any = await ApiService.get(`/customer?organization=${organizationId}`);
                    const customerData = customerResponse.map((customer: any) => ({
                        id: customer.id,
                        name: `${customer.firstName} ${customer.lastName}`,
                    }));
                    setCustomers(customerData);

                    const technicianResponse: any = await ApiService.get(`/technician/get-all?organization=${organizationId}`);
                    const technicianData = technicianResponse.map((technician: any) => ({
                        id: technician.id,
                        name: technician.name,
                    }));
                    setTechnicians(technicianData);
                } catch (error) {
                    toast.error('Erro ao buscar dados de clientes e técnicos.');
                }
            };

            fetchCustomersAndTechnicians();

            if (visitDataSelected) {
                setVisitData({
                    ...visitDataSelected,
                });
            } else {
                setVisitData(initialVisitScheduleData);
            }
        }
    }, [open]);

    const [errors, setErrors] = useState({
        description: false,
        city: false,
        state: false,
        neighborhood: false,
        street: false,
        number: false,
        cep: false,
        price: false,
        comment: false,
        customer: false,
        technician: false,
        startDateTime: false,
        endDateTime: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'cep') {
            setVisitData({
                ...visitData,
                [name]: formatCEP(value),
            });
        } else {

            setVisitData({
                ...visitData,
                [name]: value,
            });
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');

        if (value) {
            const numericValue = parseFloat(value) / 100;

            setVisitData({
                ...visitData,
                price: numericValue,
            });

            setPriceNumber(numericValue);
        } else {
            setVisitData({
                ...visitData,
                price: null,
            });

            setPriceNumber(null);
        }
    };


    const handleStateChange = (value: string) => {
        setVisitData({
            ...visitData,
            state: value,
        });

        setErrors((prevErrors) => ({
            ...prevErrors,
            state: value === '',
        }));
    };

    const validateForm = () => {
        const newErrors = {
            description: !visitData.description,
            city: !visitData.city,
            state: !visitData.state,
            neighborhood: !visitData.neighborhood,
            street: !visitData.street,
            number: !visitData.number,
            cep: !visitData.cep || !/^\d{5}-\d{3}$/.test(visitData.cep),
            price: false,
            comment: false,
            customer: !visitData.customer?.id,
            technician: !visitData.technician?.id,
            startDateTime: !visitData.startDateTime,
            endDateTime: !visitData.endDateTime,
        };

        setErrors(newErrors);
        return Object.values(newErrors).every(x => !x);
    };

    const handleSubmit = async () => {
        // Verifica se as datas estão selecionadas e as converte para o formato ISO
        const formattedStartDateTime = startDateTime ? startDateTime.toISOString() : null;
        const formattedEndDateTime = endDateTime ? endDateTime.toISOString() : null;
    
        // Atualiza o objeto visitData com os valores corretos das datas
        const updatedVisitData = {
            ...visitData,
            startDateTime: formattedStartDateTime,
            endDateTime: formattedEndDateTime,
        };
    
        if (validateForm()) {
            try {
                const organization = AuthContext.user.organization;
                updatedVisitData.organization = organization;
    
                // Envia os dados atualizados para o backend
                await ApiService.post('/visit-schedule', updatedVisitData);
    
                toast.success("Agendamento salvo com sucesso!");
    
                if (onSuccess) {
                    onSuccess();
                }
    
                setVisitData(initialVisitScheduleData); // Reseta os dados do formulário
                handleClose(); // Fecha o modal
            } catch (error) {
                toast.error('Erro ao salvar agendamento');
            }
        }
    };
    

    const handleCancel = () => {
        setVisitData(initialVisitScheduleData);
        setErrors({
            description: false,
            city: false,
            state: false,
            neighborhood: false,
            street: false,
            number: false,
            cep: false,
            price: false,
            comment: false,
            customer: false,
            technician: false,
            startDateTime: false,
            endDateTime: false,
        });
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                component="form"
                autoComplete="off"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">

                    <Typography variant="h6" component="h2" gutterBottom>
                        {visitDataSelected ? 'Editar Agendamento' : 'Cadastrar Novo Agendamento'}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Descrição"
                                name="description"
                                value={visitData.description}
                                onChange={handleChange}
                                required
                                error={errors.description}
                                helperText={errors.description ? 'Campo obrigatório' : ''}
                                autoComplete="off"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                fullWidth
                                label="Cliente"
                                name="customer"
                                value={visitData.customer?.id || ''}
                                onChange={(e) => setVisitData({ ...visitData, customer: customers.find(c => c.id === e.target.value) })}
                                required
                                error={errors.customer}
                                helperText={errors.customer ? 'Selecione um cliente' : ''}
                            >
                                {customers.length > 0 ? (
                                    customers.map((customer) => (
                                        <MenuItem key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>Nenhum cliente encontrado</MenuItem>
                                )}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                fullWidth
                                label="Técnico"
                                name="technician"
                                value={visitData.technician?.id || ''}
                                onChange={(e) => setVisitData({ ...visitData, technician: technicians.find(t => t.id === e.target.value) })}
                                required
                                error={errors.technician}
                                helperText={errors.technician ? 'Selecione um técnico' : ''}
                            >
                                {technicians.length > 0 ? (
                                    technicians.map((technician) => (
                                        <MenuItem key={technician.id} value={technician.id}>
                                            {technician.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>Nenhum técnico encontrado</MenuItem>
                                )}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <StateSelect
                                value={visitData.state}
                                onChange={handleStateChange}
                                error={errors.state}
                                helperText={errors.state ? 'Campo obrigatório' : ''}
                                required
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Cidade"
                                name="city"
                                value={visitData.city}
                                onChange={handleChange}
                                required
                                error={errors.city}
                                helperText={errors.city ? 'Campo obrigatório' : ''}
                                autoComplete="off"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Bairro"
                                name="neighborhood"
                                value={visitData.neighborhood}
                                onChange={handleChange}
                                required
                                error={errors.neighborhood}
                                helperText={errors.neighborhood ? 'Campo obrigatório' : ''}
                                autoComplete="off"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Rua"
                                name="street"
                                value={visitData.street}
                                onChange={handleChange}
                                required
                                error={errors.street}
                                helperText={errors.street ? 'Campo obrigatório' : ''}
                                autoComplete="off"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Número"
                                name="number"
                                value={visitData.number}
                                onChange={handleChange}
                                required
                                error={errors.number}
                                helperText={errors.number ? 'Campo obrigatório' : ''}
                                autoComplete="off"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Complemento"
                                name="complement"
                                value={visitData.complement}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="CEP"
                                name="cep"
                                value={visitData.cep}
                                onChange={handleChange}
                                required
                                error={errors.cep}
                                helperText={errors.cep ? 'CEP inválido' : ''}
                                autoComplete="off"
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Preço (Opcional)"
                                name="price"
                                value={visitData.price ?? ''}
                                onChange={handlePriceChange}
                                error={errors.price}
                                helperText={errors.price ? 'Preço inválido' : ''}
                                autoComplete="off"
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <DateTimePicker
                                label="Data e Hora de Início"
                                value={startDateTime}
                                onChange={(newValue) => setStartDateTime(newValue)}
                                sx={{ 
                                    width: '100%', 
                                    '& .MuiInputBase-root': {
                                        backgroundColor: '#f5f5f5', 
                                        borderRadius: 2,
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#f97316',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#f97316',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#f97316',
                                    },
                                }}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: errors.startDateTime,
                                        helperText: errors.startDateTime ? 'Selecione a data e hora de início' : '',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <DateTimePicker
                                label="Data e Hora de Fim"
                                value={endDateTime}
                                onChange={(newValue) => setEndDateTime(newValue)}
                                sx={{
                                    width: '100%',
                                    '& .MuiInputBase-root': {
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: 2,
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#f97316',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#f97316',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#f97316',
                                    },
                                }}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: errors.endDateTime,
                                        helperText: errors.endDateTime ? 'Selecione a data e hora de fim' : '',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Comentários (Opcional)"
                                name="comment"
                                multiline
                                rows={4}
                                value={visitData.comment ?? ''}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </Grid>
                    </Grid>
                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button
                            variant="text"
                            color="primary"
                            onClick={handleCancel}
                            sx={{ mr: 2 }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                backgroundColor: '#f97316',
                                color: '#ffffff',
                                '&:hover': {
                                    backgroundColor: '#e56b0a',
                                },
                            }}
                        >
                            Salvar
                        </Button>
                    </Box>
                </LocalizationProvider>
            </Box>
        </Modal>
    );
};

export default VisitScheduleModal;
