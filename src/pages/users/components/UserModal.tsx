import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Grid, MenuItem, FormControlLabel, InputAdornment, IconButton, Switch } from '@mui/material';
import { toast } from 'react-toastify';
import { initialUserData, User, UserRole } from '../IUser';
import { Organization } from '../../../contexts/IAuthContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ApiService from '../../../api/ApiService';
import { validatePasswordStrength } from '../../../util/format/IFunctions';

interface UserModalProps {
    open: boolean;
    handleClose: () => void;
    rows: any[];
    organizationList: Organization[];
    userDataSelected?: any;
    onSuccess?: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ open, handleClose, rows, organizationList, userDataSelected, onSuccess }) => {
    const [userData, setUserData] = useState<User>(initialUserData);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [errors, setErrors] = useState({
        login: false,
        role: false,
        organization: false,
    });

    useEffect(() => {
        if (userDataSelected) {
            setUserData({
                ...userDataSelected,
                organization: userDataSelected.organization || initialUserData.organization,
                isActive: !!userDataSelected.isActive,
            });
        } else {
            setUserData(initialUserData);
        }
    }, [userDataSelected]);

    const isLoginDuplicate = (login: string) => {
        return rows.some(row => row.login === login && row.id !== userData.id);
    };

    const validateForm = () => {
        const newErrors = {
            login: !userData.login || isLoginDuplicate(userData.login),
            role: !userData.role,
            organization: !userData.organization?.id,
        };

        if (!userDataSelected && userData.role === UserRole.TECHNICIAN) {
            newErrors.role = true;
        }

        setErrors(newErrors);

        return Object.values(newErrors).every((x) => !x);
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            if (!userDataSelected && userData.role === UserRole.TECHNICIAN) {
                toast.error('Não é permitido cadastrar um novo usuário com a função de Técnico.');
            } else {
                toast.error('Por favor, preencha todos os campos obrigatórios e verifique se o login já existe.');
            }
            return;
        }

        if (!userDataSelected) {
            if (!validatePasswordStrength(password)) {
                setPasswordError('A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos.');
                return;
            }

            if (password !== confirmPassword) {
                toast.error('As senhas não coincidem.');
                return;
            }
        }

        try {
            const userPayload = userDataSelected ? { ...userData } : { ...userData, password };
            if (userDataSelected) {
                await ApiService.put('/user', userPayload);
                toast.success('Usuário atualizado com sucesso');
            } else {
                await ApiService.post('/auth/register', userPayload);
                toast.success('Usuário criado com sucesso');
            }
            if (onSuccess) onSuccess();
            clearFields();
            handleClose();
        } catch (error) {
            toast.error('Erro ao salvar usuário');
        }
    };

    const handleCancel = () => {
        clearFields();
        handleClose();
    };

    const clearFields = () => {
        setUserData(initialUserData);
        setErrors({
            login: false,
            role: false,
            organization: false,
        });
        setPasswordError(null);
        setConfirmPassword('');
        setPassword('');
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedOrganization = organizationList.find(org => org.id === Number(e.target.value));
        if (selectedOrganization) {
            setUserData({
                ...userData,
                organization: selectedOrganization,
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedRole = e.target.value;
        if (Object.values(UserRole).includes(selectedRole as UserRole)) {
            setUserData({ ...userData, role: selectedRole as UserRole });
        } else {
            console.error('Função inválida selecionada');
        }
    };

    const availableRoles = userDataSelected
        ? [UserRole.ADMIN, UserRole.USER, UserRole.TECHNICIAN]
        : [UserRole.ADMIN, UserRole.USER];

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
                    {userDataSelected ? 'Editar Usuário' : 'Criar Novo Usuário'}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Login"
                            name="login"
                            value={userData.login}
                            onChange={handleChange}
                            required
                            error={errors.login}
                            helperText={errors.login ? 'Campo obrigatório ou login já existe' : ''}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Função"
                            name="role"
                            value={userData.role}
                            onChange={handleRoleChange}
                            required
                            error={errors.role}
                            helperText={errors.role ? 'Campo obrigatório' : ''}
                            disabled={userData.role === UserRole.TECHNICIAN}
                        >
                            {availableRoles.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role === UserRole.ADMIN ? 'Administrador' : 'Gestor'}
                                </MenuItem>
                            ))}
                            {/* Se estiver editando um usuário e a função for Técnico, mostrar a opção */}
                            {userDataSelected && userData.role === UserRole.TECHNICIAN && (
                                <MenuItem value={UserRole.TECHNICIAN}>Técnico</MenuItem>
                            )}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Empresa"
                            name="organization"
                            value={userData.organization?.id || ''}
                            onChange={handleOrganizationChange}
                            required
                            error={errors.organization}
                            helperText={errors.organization ? 'Campo obrigatório' : ''}
                        >
                            {organizationList.map((org) => (
                                <MenuItem key={org.id} value={org.id}>
                                    {org.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={userData.active}
                                    onChange={(e) => setUserData({ ...userData, active: e.target.checked })}
                                    color="primary"
                                />
                            }
                            label="Ativo"
                        />
                    </Grid>

                    {!userDataSelected && (
                        <>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Senha"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordError(null);
                                    }}
                                    required
                                    error={!!passwordError}
                                    helperText={passwordError}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={togglePasswordVisibility}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Confirmar Senha"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={toggleConfirmPasswordVisibility}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
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

export default UserModal;
