import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    MenuItem,
    InputAdornment,
} from '@mui/material';
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

const VisitScheduleModal: React.FC<VisitScheduleModalProps> = ({
    open,
    handleClose,
    rows,
    visitDataSelected,
    onSuccess,
}) => {
    const [visitData, setVisitData] = useState<VisitScheduleData>(
        initialVisitScheduleData
    );
    const [customers, setCustomers] = useState<any[]>([]);
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [startDateTime, setStartDateTime] = useState<dayjs.Dayjs | null>(null);
    const [endDateTime, setEndDateTime] = useState<dayjs.Dayjs | null>(null);
    const [displayedPrice, setDisplayedPrice] = useState<string>('');
    const AuthContext = useAuth();

    useEffect(() => {
        if (open) {
            const fetchCustomersAndTechnicians = async () => {
                try {
                    const organizationId = AuthContext.user.organization.id;

                    const customerResponse: any = await ApiService.get(
                        `/customer?organization=${organizationId}`
                    );
                    const customerData = customerResponse.map((customer: any) => ({
                        id: customer.id,
                        name: `${customer.firstName} ${customer.lastName}`,
                        state: customer.state,
                        city: customer.city,
                        neighborhood: customer.neighborhood,
                        street: customer.street,
                        number: customer.number,
                        complement: customer.complement,
                        cep: customer.cep,
                    }));
                    setCustomers(customerData);

                    const technicianResponse: any = await ApiService.get(
                        `/technician/get-all?organization=${organizationId}`
                    );
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
                    price: visitDataSelected.price || null,
                    id: visitDataSelected.id,
                });

                setDisplayedPrice(
                    visitDataSelected.price
                        ? Number(visitDataSelected.price).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })
                        : ''
                );

                setStartDateTime(
                    visitDataSelected.startDateTime
                        ? dayjs(visitDataSelected.startDateTime)
                        : null
                );
                setEndDateTime(
                    visitDataSelected.endDateTime
                        ? dayjs(visitDataSelected.endDateTime)
                        : null
                );
            } else {
                setVisitData(initialVisitScheduleData);
                setDisplayedPrice('');
                setStartDateTime(null);
                setEndDateTime(null);
            }
        }
    }, [open, visitDataSelected]);


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

    const handleStartDateChange = (newValue: Dayjs | null) => {
        setStartDateTime(newValue);
        setVisitData((prevVisitData) => ({
            ...prevVisitData,
            startDateTime: newValue ? newValue.toDate() : null,
        }));
    };

    const handleEndDateChange = (newValue: Dayjs | null) => {
        setEndDateTime(newValue);
        setVisitData((prevVisitData) => ({
            ...prevVisitData,
            endDateTime: newValue ? newValue.toDate() : null,
        }));
    };

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
        const inputValue = e.target.value;
        const numericValue = parseFloat(
            inputValue.replace(/[^\d.,-]/g, '').replace(',', '.')
        );
        setVisitData({
            ...visitData,
            price: isNaN(numericValue) ? null : numericValue,
        });
        setDisplayedPrice(inputValue);
    };

    const handlePriceBlur = () => {
        if (visitData.price !== null && !isNaN(visitData.price)) {
            const formattedValue = visitData.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });
            setDisplayedPrice(formattedValue);
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
            price: visitData.price !== null && isNaN(visitData.price),
            comment: false,
            customer: !visitData.customer?.id,
            technician: !visitData.technician?.id,
            startDateTime: !startDateTime,
            endDateTime: !endDateTime,
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((x) => !x);
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const organization = AuthContext.user.organization;
                const startDate = startDateTime
                    ? startDateTime.valueOf()
                    : null;
                const endDate = endDateTime
                    ? endDateTime.valueOf()
                    : null;

                const updatedVisitData = {
                    ...visitData,
                    organization,
                    price: visitData.price,
                    startDate,
                    endDate,
                };

                if (visitData.id) {
                    await ApiService.post('/visit-schedule', updatedVisitData);
                    toast.success('Agendamento atualizado com sucesso!');
                } else {
                    await ApiService.post('/visit-schedule', updatedVisitData);
                    toast.success('Agendamento salvo com sucesso!');
                }

                if (onSuccess) {
                    onSuccess();
                }

                setVisitData(initialVisitScheduleData);
                setStartDateTime(null);
                setEndDateTime(null);
                setDisplayedPrice('');
                handleClose();
            } catch (error) {
                console.error('Erro ao salvar agendamento:', error);
                toast.error('Erro ao salvar agendamento');
            }
        }
    };

    const handleCancel = () => {
        setVisitData(initialVisitScheduleData);
        setStartDateTime(null);
        setEndDateTime(null);
        setDisplayedPrice('');
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
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="pt-br"
                >
                    <Typography variant="h6" component="h2" gutterBottom>
                        {visitDataSelected
                            ? 'Editar Agendamento'
                            : 'Cadastrar Novo Agendamento'}
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
                                helperText={
                                    errors.description ? 'Campo obrigatório' : ''
                                }
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
                                onChange={(e) => {
                                    const selectedCustomer = customers.find(
                                        (c) => c.id === e.target.value
                                    );

                                    setVisitData({
                                        ...visitData,
                                        customer: selectedCustomer,
                                        state: selectedCustomer?.state || '',
                                        city: selectedCustomer?.city || '',
                                        neighborhood: selectedCustomer?.neighborhood || '',
                                        street: selectedCustomer?.street || '',
                                        number: selectedCustomer?.number || '',
                                        complement: selectedCustomer?.complement || '',
                                        cep: selectedCustomer?.cep || '',
                                    });
                                }}
                                required
                                error={errors.customer}
                                helperText={
                                    errors.customer
                                        ? 'Selecione um cliente'
                                        : ''
                                }
                            >
                                {customers.length > 0 ? (
                                    customers.map((customer) => (
                                        <MenuItem
                                            key={customer.id}
                                            value={customer.id}
                                        >
                                            {customer.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>
                                        Nenhum cliente encontrado
                                    </MenuItem>
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
                                onChange={(e) =>
                                    setVisitData({
                                        ...visitData,
                                        technician: technicians.find(
                                            (t) => t.id === e.target.value
                                        ),
                                    })
                                }
                                required
                                error={errors.technician}
                                helperText={
                                    errors.technician
                                        ? 'Selecione um técnico'
                                        : ''
                                }
                            >
                                {technicians.length > 0 ? (
                                    technicians.map((technician) => (
                                        <MenuItem
                                            key={technician.id}
                                            value={technician.id}
                                        >
                                            {technician.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>
                                        Nenhum técnico encontrado
                                    </MenuItem>
                                )}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <StateSelect
                                value={visitData.state}
                                onChange={handleStateChange}
                                error={errors.state}
                                helperText={
                                    errors.state ? 'Campo obrigatório' : ''
                                }
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
                                helperText={
                                    errors.city ? 'Campo obrigatório' : ''
                                }
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
                                helperText={
                                    errors.neighborhood
                                        ? 'Campo obrigatório'
                                        : ''
                                }
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
                                helperText={
                                    errors.street ? 'Campo obrigatório' : ''
                                }
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
                                helperText={
                                    errors.number ? 'Campo obrigatório' : ''
                                }
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
                                helperText={
                                    errors.cep ? 'CEP inválido' : ''
                                }
                                autoComplete="off"
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Preço (Opcional)"
                                name="price"
                                value={displayedPrice}
                                onChange={handlePriceChange}
                                onBlur={handlePriceBlur}
                                onFocus={() => {
                                    if (displayedPrice) {
                                        const unformattedValue = displayedPrice.replace(/[^\d.,-]/g, '');
                                        setDisplayedPrice(unformattedValue);
                                    }
                                }}
                                error={errors.price}
                                helperText={errors.price ? 'Preço inválido' : ''}
                                autoComplete="off"
                                InputProps={{
                                    inputMode: 'decimal',
                                    startAdornment: (
                                        <InputAdornment position="start"></InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <DateTimePicker
                                label="Data e Hora de Início"
                                value={startDateTime}
                                onChange={handleStartDateChange}
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
                                        helperText: errors.startDateTime
                                            ? 'Selecione a data e hora de início'
                                            : '',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <DateTimePicker
                                label="Data e Hora de Fim"
                                value={endDateTime}
                                onChange={handleEndDateChange}
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
                                        helperText: errors.endDateTime
                                            ? 'Selecione a data e hora de fim'
                                            : '',
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
                                rows={2}
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
