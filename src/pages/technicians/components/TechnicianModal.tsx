import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { toast } from 'react-toastify';
import ApiService from '../../../conection/api';
import { useAuth } from '../../../contexts/AuthContext';
import {
  initialTechnicianData,
  Technician,
  TechnicianModalProps,
} from '../ITechnician';
import {
  formatCPF,
  formatPhoneNumber,
  isValidCPF,
} from '../../../util/format/IFunctions';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const TechnicianModal: React.FC<TechnicianModalProps> = ({
  open,
  handleClose,
  rows,
  technicianDataSelected,
  onSuccess,
}) => {
  const [technicianData, setTechnicianData] =
    useState<Technician>(initialTechnicianData);
  const AuthContext = useAuth();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);

  useEffect(() => {
    if (technicianDataSelected) {
      setTechnicianData({
        ...technicianDataSelected,
        password: '',
        confirmPassword: '',
      });
      setIsEditingPassword(false);
    } else {
      setTechnicianData(initialTechnicianData);
    }
  }, [technicianDataSelected]);

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    phoneNumber: false,
    cpf: false,
    login: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'cpf') {
      setTechnicianData({
        ...technicianData,
        [name]: formatCPF(value),
      });
    } else if (name === 'phoneNumber') {
      setTechnicianData({
        ...technicianData,
        [name]: formatPhoneNumber(value),
      });
    } else {
      setTechnicianData({
        ...technicianData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const cpfExists = rows.some(
      (technician: any) =>
        technician.cpf === technicianData.cpf && technician.id !== technicianData.id
    );

    const emailExists = rows.some(
      (technician: any) =>
        technician.email === technicianData.email && technician.id !== technicianData.id
    );

    const loginExists = rows.some(
      (technician: any) =>
        technician.login === technicianData.login && technician.id !== technicianData.id
    );

    const newErrors = {
      name: !technicianData.name,
      email:
        !technicianData.email ||
        !/\S+@\S+\.\S+/.test(technicianData.email) ||
        emailExists,
      password:
        (!technicianDataSelected || isEditingPassword) && !technicianData.password,
      confirmPassword:
        (!technicianDataSelected || isEditingPassword) &&
        technicianData.password !== technicianData.confirmPassword,
      phoneNumber:
        !technicianData.phoneNumber ||
        !/^\(\d{2}\) \d{5}-\d{4}$/.test(technicianData.phoneNumber),
      login: !technicianData.login || loginExists,
      cpf:
        !technicianData.cpf ||
        !isValidCPF(technicianData.cpf) ||
        cpfExists,
    };

    setErrors(newErrors);

    if (cpfExists) {
      toast.error('CPF já cadastrado!');
    }

    if (emailExists) {
      toast.error('Email já cadastrado!');
    }

    if (loginExists) {
      toast.error('Login já cadastrado!');
    }

    if (newErrors.confirmPassword) {
      toast.error('As senhas não coincidem!');
    }

    return Object.values(newErrors).every((x) => !x);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const organization = AuthContext.user.organization;
        technicianData.organization = organization;

        const dataToSend = { ...technicianData };
        if (!isEditingPassword && technicianDataSelected) {
          delete dataToSend.password;
          delete dataToSend.confirmPassword;
        }

        if (technicianDataSelected) {
          await ApiService.put(
            `/technician/${technicianData.id}`,
            dataToSend
          );
          toast.success('Técnico atualizado com sucesso!');
        } else {
          await ApiService.post('/technician', dataToSend);
          toast.success('Técnico criado com sucesso!');
        }

        if (onSuccess) {
          onSuccess();
        }

        setTechnicianData(initialTechnicianData);
        setIsEditingPassword(false);
        handleClose();
      } catch (error) {
        toast.error('Erro ao salvar técnico');
      }
    }
  };

  const handleCancel = () => {
    setTechnicianData(initialTechnicianData);
    setErrors({
      name: false,
      email: false,
      password: false,
      confirmPassword: false,
      phoneNumber: false,
      cpf: false,
      login: false,
    });
    setIsEditingPassword(false);
    handleClose();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
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
          {technicianDataSelected ? 'Editar Técnico' : 'Cadastrar Novo Técnico'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="Nome"
              name="name"
              value={technicianData.name}
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
              label="CPF"
              name="cpf"
              value={technicianData.cpf}
              onChange={handleChange}
              required
              error={errors.cpf}
              helperText={errors.cpf ? 'CPF inválido ou já cadastrado' : ''}
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Telefone"
              name="phoneNumber"
              value={technicianData.phoneNumber}
              onChange={handleChange}
              required
              error={errors.phoneNumber}
              helperText={
                errors.phoneNumber ? 'Número de telefone inválido' : ''
              }
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={technicianData.email}
              onChange={handleChange}
              required
              error={errors.email}
              helperText={
                errors.email ? 'Email inválido ou já cadastrado' : ''
              }
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="Login"
              name="login"
              value={technicianData.login}
              onChange={handleChange}
              required
              error={errors.login}
              helperText={
                errors.login ? 'Login já cadastrado ou inválido' : ''
              }
              autoComplete="off"
            />
          </Grid>
          {/* Botão para editar a senha ao editar um técnico */}
          {technicianDataSelected && !isEditingPassword && (
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={() => setIsEditingPassword(true)}
                sx={{ mt: 2 }}
              >
                Editar Senha
              </Button>
            </Grid>
          )}
          {/* Campos de senha ao criar ou editar senha */}
          {(!technicianDataSelected || isEditingPassword) && (
            <>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Senha"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={technicianData.password}
                  onChange={handleChange}
                  required
                  error={errors.password}
                  helperText={errors.password ? 'Campo obrigatório' : ''}
                  autoComplete="off"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Confirmar Senha"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={technicianData.confirmPassword}
                  onChange={handleChange}
                  required
                  error={errors.confirmPassword}
                  helperText={
                    errors.confirmPassword ? 'As senhas não coincidem' : ''
                  }
                  autoComplete="off"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          aria-label="toggle confirm password visibility"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </>
          )}
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

export default TechnicianModal;
