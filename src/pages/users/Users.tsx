import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import TopButtons from '../../util/components/topButtons/TopButtons';
import GenericDataGrid from '../../util/components/dataGrid/GenericDataGrid';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import UserModal from './components/UserModal';
import ApiService from '../../api/ApiService';
import { useAuth } from '../../contexts/AuthContext';
import moment from 'moment';
import { Organization } from '../organization/IOrganization';
import { getUserRoleDescription, User } from './IUser';
import { toast } from 'react-toastify';

export function Users() {
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
    const [openModal, setOpenModal] = useState(false);
    const [rows, setRows] = useState<any[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [userDataSelected, setUserDataSelected] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const AuthContext = useAuth();

    const fetchData = async () => {
        if (!AuthContext.user) return;
        setLoading(true);
        try {
            const organizationsResponse: any = await ApiService.get(`/organization`);
            const organizations = organizationsResponse.map((organization: Organization) => ({
                id: organization.id,
                name: organization.name,
                externalCode: organization.externalCode,
            }));
            setOrganizations(organizations);
            const response: any = await ApiService.get(`/user/get-all`);
            const users = response.map((user: User) => ({
                id: user.id,
                login: user.login,
                role: user.role,
                role_description: getUserRoleDescription(user.role),
                organization: user.organization.name,
                formattedCreationDate: user.creationDate !== null ? moment(user.creationDate).format('DD/MM/YYYY') : "",
                active: user.active,
                active_description: user.active === true ? 'Ativo' : 'Inativo',
            }));
            setRows(users);
        } catch (error) {
            console.error('Erro ao buscar dados', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshGrid = () => {
        fetchData();
    };

    useEffect(() => {
        if (AuthContext.user) {
            refreshGrid();
        }
    }, [AuthContext.user]);

    const columns: GridColDef[] = [
        {
            field: 'login',
            headerName: 'Login',
            width: 250,
            editable: false,
            disableColumnMenu: true
        },
        {
            field: 'role_description',
            headerName: 'Função',
            width: 200,
            editable: false,
            disableColumnMenu: true,
        },
        {
            field: 'organization',
            headerName: 'Empresa',
            width: 250,
            editable: false,
            disableColumnMenu: true
        },
        {
            field: 'formattedCreationDate',
            headerName: 'Data de Criação',
            width: 200,
            editable: false,
            disableColumnMenu: true
        },
        {
            field: 'active_description',
            headerName: 'Status',
            width: 150,
            editable: false,
            disableColumnMenu: true,
        },
    ];

    const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
        setSelectedRows(newSelection);
    };

    const handleAddClick = () => {
        setUserDataSelected(null);
        setOpenModal(true);
    };

    const handleEditClick = () => {
        if (selectedRows.length === 1) {
            const userToEdit = rows.find((row) => row.id === selectedRows[0]);

            if (userToEdit) {
                const userEditData = {
                    ...userToEdit,
                    organization: organizations.find(org => org.name === userToEdit.organization) || null
                };
                setUserDataSelected(userEditData);
                setOpenModal(true);
            }
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDeleteClick = async () => {
        if (selectedRows.length > 0) {
            try {
                const rowsToDelete = selectedRows.map((rowId: any) => parseInt(rowId));
                await ApiService.delete('/user', {
                    data: rowsToDelete
                });

                toast.success("Usuário excluído com sucesso");
                refreshGrid();
                setSelectedRows([]);
            } catch (error) {
                toast.error("Erro ao excluir usuário");
            }

        }
    };

    return (
        <Box sx={{ width: '100%', marginTop: 5 }}>
            <Container maxWidth={false}>
                <Typography variant="h4" component="h1" gutterBottom style={{ marginTop: 25 }}>
                    Usuários
                </Typography>

                <TopButtons
                    buttonLabel="Novo Usuário"
                    onAddClick={handleAddClick}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                    isEditDisabled={selectedRows.length !== 1}
                    isDeleteDisabled={selectedRows.length === 0}
                />

                <GenericDataGrid
                    rows={rows}
                    columns={columns}
                    onRowSelectionChange={handleSelectionChange}
                    pageSizeOptions={[10]}
                    loading={loading}
                />

                <UserModal
                    open={openModal}
                    handleClose={handleCloseModal}
                    rows={rows}
                    organizationList={organizations}
                    userDataSelected={userDataSelected}
                    onSuccess={refreshGrid}
                />

            </Container>
        </Box>
    );
}
