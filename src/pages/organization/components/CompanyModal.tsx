import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, FormControlLabel, Checkbox } from '@mui/material';

interface CompanyModalProps {
    open: boolean;
    handleClose: () => void;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ open, handleClose }) => {
    const [companyData, setCompanyData] = useState({
        name: '',
        externalCode: '',
        status: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setCompanyData({
            ...companyData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = () => {
        // Lógica para enviar dados do formulário
        console.log('Dados enviados:', companyData);
        handleClose(); // Fecha a modal após o envio
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Cadastrar Nova Empresa
                </Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Nome"
                    name="name"
                    value={companyData.name}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Código Externo"
                    name="externalCode"
                    value={companyData.externalCode}
                    onChange={handleChange}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            name="status"
                            checked={companyData.status}
                            onChange={handleChange}
                        />
                    }
                    label="Status"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ mt: 2 }}
                >
                    Salvar
                </Button>
            </Box>
        </Modal>
    );
};

export default CompanyModal;
