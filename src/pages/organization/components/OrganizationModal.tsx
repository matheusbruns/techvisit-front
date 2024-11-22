import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ApiService from '../../../api/ApiService';
import dayjs from 'dayjs';
import { initialOrganizationData, Organization } from '../IOrganization';

interface OrganizationModalProps {
    open: boolean;
    handleClose: () => void;
    rows: any[];
    organizationDataSelected?: Organization | null;
    onSuccess?: () => void;
}

const OrganizationModal: React.FC<OrganizationModalProps> = ({ open, handleClose, rows, organizationDataSelected, onSuccess }) => {
    const [organizationData, setOrganizationData] = useState<Organization>(initialOrganizationData);

    const [errors, setErrors] = useState({
        name: false,
        externalCode: false,
    });

    useEffect(() => {
        if (organizationDataSelected) {
            setOrganizationData(organizationDataSelected);
        } else {
            setOrganizationData(initialOrganizationData);
        }
    }, [organizationDataSelected]);

    const validateForm = () => {
        const externalCodeExists = rows.some(
            (organization: Organization) =>
                organization.externalCode === organizationData.externalCode && organization.id !== organizationData.id
        );

        const newErrors = {
            name: !organizationData.name,
            externalCode: !organizationData.externalCode || externalCodeExists,
        };

        setErrors(newErrors);

        if (externalCodeExists) {
            toast.error("Código já cadastrado!");
        }

        return Object.values(newErrors).every((x) => !x);
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                if (organizationData.id) {
                    await ApiService.put('/organization', organizationData);
                    toast.success('Empresa atualizada com sucesso!');
                } else {
                    await ApiService.post('/organization', organizationData);
                    toast.success('Empresa cadastrada com sucesso!');
                }

                if (onSuccess) {
                    onSuccess();
                }

                setOrganizationData(initialOrganizationData);
                handleClose();
            } catch (error) {
                toast.error('Erro ao salvar!');
            }
        }
    };

    const handleCancel = () => {
        setOrganizationData(initialOrganizationData);
        setErrors({ name: false, externalCode: false });
        handleClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrganizationData({
            ...organizationData,
            [e.target.name]: e.target.value,
        });
    };

    const handleDateChange = (newDate: any) => {
        setOrganizationData({
            ...organizationData,
            expirationDate: newDate ? newDate.format('YYYY-MM-DD') : dayjs().add(2, 'year').format('YYYY-MM-DD'),
        });
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
                    width: { xs: '90%', sm: 500, md: 600 },
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" component="h2" gutterBottom>
                    {organizationData.id ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Nome"
                            name="name"
                            value={organizationData.name}
                            onChange={handleChange}
                            required
                            error={errors.name}
                            helperText={errors.name ? 'Campo obrigatório' : ''}
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Código Externo"
                            name="externalCode"
                            value={organizationData.externalCode}
                            onChange={handleChange}
                            required
                            error={errors.externalCode}
                            helperText={errors.externalCode ? 'Campo obrigatório' : ''}
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Data de Expiração"
                                value={dayjs(organizationData.expirationDate)}
                                onChange={handleDateChange}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        margin: 'normal',
                                    },
                                }}
                            />
                        </LocalizationProvider>
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

export default OrganizationModal;
