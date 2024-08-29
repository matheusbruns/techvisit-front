import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Grid } from '@mui/material';
import { toast } from 'react-toastify';

interface CustomerModalProps {
  open: boolean;
  handleClose: () => void;
}

// Função para validar o CPF
const isValidCPF = (cpf: string) => {
  if (!cpf) return false;

  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');

  // Verifica se o CPF tem 11 dígitos ou se é uma sequência de números repetidos
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  // Valida o primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let firstCheckDigit = (sum * 10) % 11;
  if (firstCheckDigit === 10) firstCheckDigit = 0;
  if (firstCheckDigit !== parseInt(cpf.charAt(9))) {
    return false;
  }

  // Valida o segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }

  let secondCheckDigit = (sum * 10) % 11;
  if (secondCheckDigit === 10) secondCheckDigit = 0;
  if (secondCheckDigit !== parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
};

const formatCPF = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})?(\d{3})?(\d{2})?$/);
  if (match) {
    return `${match[1]}${match[2] ? '.' + match[2] : ''}${match[3] ? '.' + match[3] : ''}${match[4] ? '-' + match[4] : ''}`;
  }
  return value;
};

const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})?(\d{4})?$/);
  if (match) {
    return `(${match[1]}) ${match[2] ? match[2] : ''}${match[3] ? '-' + match[3] : ''}`;
  }
  return value;
};

const formatCEP = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{5})(\d{3})?$/);
  if (match) {
    return `${match[1]}-${match[2] ? match[2] : ''}`;
  }
  return value;
};

const CustomerModal: React.FC<CustomerModalProps> = ({ open, handleClose }) => {
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    cpf: '',
    phoneNumber: '',
    street: '',
    number: '',
    complement: '',
    cep: '',
  });

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
    const newErrors = {
      firstName: !customerData.firstName,
      lastName: !customerData.lastName,
      cpf: !customerData.cpf || !isValidCPF(customerData.cpf), // Validação de CPF usando isValidCPF
      phoneNumber: !customerData.phoneNumber || !/^\(\d{2}\) \d{5}-\d{4}$/.test(customerData.phoneNumber),
      street: !customerData.street,
      number: !customerData.number,
      complement: false,
      cep: !customerData.cep || !/^\d{5}-\d{3}$/.test(customerData.cep),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every(x => !x);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Dados do cliente enviados:', customerData);
      setCustomerData({
        firstName: '',
        lastName: '',
        cpf: '',
        phoneNumber: '',
        street: '',
        number: '',
        complement: '',
        cep: '',
      });
      handleClose();
      toast.success("Cliente salvo com sucesso!");
    }
  };

  const handleCancel = () => {
    setCustomerData({
      firstName: '',
      lastName: '',
      cpf: '',
      phoneNumber: '',
      street: '',
      number: '',
      complement: '',
      cep: '',
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
          Cadastrar Novo Cliente
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
