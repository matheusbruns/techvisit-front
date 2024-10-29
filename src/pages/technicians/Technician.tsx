import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import TopButtons from '../../util/components/topButtons/TopButtons';
import GenericDataGrid from '../../util/components/dataGrid/GenericDataGrid';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import ApiService from '../../api/ApiService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import TechnicianModal from './components/TechnicianModal';
import { Technician as TechnicianData } from './ITechnician';

export function Technician() {
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
    const [openModal, setOpenModal] = useState(false);
    const [rows, setRows] = useState<any[]>([]);
    const [technicianDataSelected, setTechnicianDataSelected] = useState<TechnicianData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const AuthContext = useAuth();

    const fetchData = async () => {
        if (!AuthContext.user) return;
        setLoading(true);
        try {
            const organization = AuthContext.user.organization.id;
            const response: TechnicianData[] = await ApiService.get(`/technician/get-all?organization=${organization}`);
            const customers = response.map((technician: TechnicianData) => ({
                id: technician.id,
                name: technician.name,
                login: technician.login,
                cpf: technician.cpf,
                email: technician.email,
                phoneNumber: technician.phoneNumber,
                active: technician.active,
                active_description: technician.active === true ? 'Ativo' : 'Inativo',
            }));
            setRows(customers);
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
            field: 'name',
            headerName: 'Nome',
            width: 250,
            editable: false,
            disableColumnMenu: true
        },
        {
            field: 'login',
            headerName: 'login',
            width: 200,
            editable: false,
            disableColumnMenu: true
        },
        {
            field: 'cpf',
            headerName: 'cpf',
            width: 200,
            editable: false,
            disableColumnMenu: true
        },
        {
            field: 'email',
            headerName: 'email',
            width: 200,
            editable: false,
            disableColumnMenu: true,
        },
        {
            field: 'phoneNumber',
            headerName: 'Telefone',
            width: 250,
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
        setTechnicianDataSelected(null);
        setOpenModal(true);
    };

    const handleEditClick = () => {
        if (selectedRows.length === 1) {
            const technicianToEdit = rows.find((row) => row.id === selectedRows[0]);

            if (technicianToEdit) {
                const technicianEditData = {
                    ...technicianToEdit,
                };
                setTechnicianDataSelected(technicianEditData);
                setOpenModal(true);
            }
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setTechnicianDataSelected(null);
    };

    const handleDeleteClick = async () => {
        if (selectedRows.length > 0) {
            try {
                const rowsToDelete = selectedRows.map((rowId: any) => parseInt(rowId));
                await ApiService.delete('/technician', {
                    data: rowsToDelete
                });

                toast.success("Técnico excluído com sucesso");
                refreshGrid();
                setSelectedRows([]);
            } catch (error) {
                toast.error("Erro ao excluir Técnico");
            }

        }
    };

    return (
        <Box sx={{ width: '100%', marginTop: 5 }}>
            <Container maxWidth={false}>
                <Typography variant="h4" component="h1" gutterBottom style={{ marginTop: 25 }}>
                    Técnicos
                </Typography>

                <TopButtons
                    buttonLabel="Novo Técnico"
                    onAddClick={handleAddClick}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                    isEditDisabled={selectedRows.length !== 1}
                    isDeleteDisabled={true}
                />

                <GenericDataGrid
                    rows={rows}
                    columns={columns}
                    onRowSelectionChange={handleSelectionChange}
                    pageSizeOptions={[10]}
                    loading={loading}
                />

                <TechnicianModal
                    open={openModal}
                    handleClose={handleCloseModal}
                    rows={rows}
                    technicianDataSelected={technicianDataSelected}
                    onSuccess={refreshGrid}
                />

            </Container>
        </Box>
    );
}
