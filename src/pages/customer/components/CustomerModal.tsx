import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import ApiService from '../../../conection/api';
import { Customer, initialCustomerData } from '../ICustomer';
import { useAuth } from '../../../contexts/AuthContext';
import { formatCEP, formatCPF, formatPhoneNumber, isValidCPF } from '../../../util/format/IFunctions';

interface CustomerModalProps {
    open: boolean;
    handleClose: () => void;
    rows: any[];
    customerDataSelected?: any;
    onSuccess?: () => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ open, handleClose, rows, customerDataSelected, onSuccess }) => {
    const [customerData, setCustomerData] = useState<Customer>(initialCustomerData);
    const AuthContext = useAuth();

    console.log(customerDataSelected);

    useEffect(() => {
        if (customerDataSelected) {
            console.log('customerDataSelected', customerDataSelected);
            setCustomerData({
                ...customerDataSelected,
            });
        } else {
            setCustomerData(initialCustomerData);
        }
    }, [customerDataSelected]);

    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        cpf: false,
        phoneNumber: false,
        street: false,
        number: false,
        complement: false,
        cep: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'cpf') {
            setCustomerData({
                ...customerData,
                [name]: formatCPF(value),
            });
        } else if (name === 'phoneNumber') {
            setCustomerData({
                ...customerData,
                [name]: formatPhoneNumber(value),
            });
        } else if (name === 'cep') {
            setCustomerData({
                ...customerData,
                [name]: formatCEP(value),
            });
        } else {
            setCustomerData({
                ...customerData,
                [name]: value,
            });
        }
    };

    const validateForm = () => {

        const cpfExists = rows.some((customer: any) =>
            customer.cpf === customerData.cpf && customer.id !== customerData.id
        );

        const newErrors = {
            firstName: !customerData.firstName,
            lastName: !customerData.lastName,
            cpf: !customerData.cpf || !isValidCPF(customerData.cpf) || cpfExists,
            phoneNumber: !customerData.phoneNumber || !/^\(\d{2}\) \d{5}-\d{4}$/.test(customerData.phoneNumber),
            street: !customerData.street,
            number: !customerData.number,
            complement: false,
            cep: !customerData.cep || !/^\d{5}-\d{3}$/.test(customerData.cep),
        };

        setErrors(newErrors);

        if (cpfExists) {
            toast.error("CPF já cadastrado!");
        }

        return Object.values(newErrors).every(x => !x);
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            console.log('Dados do cliente enviados:', customerData);
            try {
                const organization = AuthContext.user.organization;
                customerData.organization = organization;
                const response: any = await ApiService.post('/customer', customerData);

                toast.success("Cliente salvo com sucesso!");

                if (onSuccess) {
                    onSuccess();
                }

                setCustomerData(initialCustomerData);
                handleClose();
            } catch (error) {
                toast.error('Erro ao salvar novo cliente');
            }
        }
    };

    const handleCancel = () => {
        setCustomerData(initialCustomerData);
        setErrors({
            firstName: false,
            lastName: false,
            cpf: false,
            phoneNumber: false,
            street: false,
            number: false,
            complement: false,
            cep: false,
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
                <Typography variant="h6" component="h2" gutterBottom>
                    {customerDataSelected ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Nome"
                            name="firstName"
                            value={customerData.firstName}
                            onChange={handleChange}
                            required
                            error={errors.firstName}
                            helperText={errors.firstName ? 'Campo obrigatório' : ''}
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Sobrenome"
                            name="lastName"
                            value={customerData.lastName}
                            onChange={handleChange}
                            required
                            error={errors.lastName}
                            helperText={errors.lastName ? 'Campo obrigatório' : ''}
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="CPF"
                            name="cpf"
                            value={customerData.cpf}
                            onChange={handleChange}
                            required
                            error={errors.cpf}
                            helperText={errors.cpf ? 'CPF inválido' : ''}
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Número de Telefone"
                            name="phoneNumber"
                            value={customerData.phoneNumber}
                            onChange={handleChange}
                            required
                            error={errors.phoneNumber}
                            helperText={errors.phoneNumber ? 'Número de telefone inválido' : ''}
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Rua"
                            name="street"
                            value={customerData.street}
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
                            value={customerData.number}
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
                            value={customerData.complement}
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
                            value={customerData.cep}
                            onChange={handleChange}
                            required
                            error={errors.cep}
                            helperText={errors.cep ? 'CEP inválido' : ''}
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
            </Box>
        </Modal>
    );
};

export default CustomerModal;
