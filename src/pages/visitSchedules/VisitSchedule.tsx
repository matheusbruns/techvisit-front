import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import TopButtons from '../../util/components/topButtons/TopButtons';
import GenericDataGrid from '../../util/components/dataGrid/GenericDataGrid';
import ApiService from '../../conection/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import VisitScheduleModal from './components/VisitScheduleModal';
import { VisitScheduleData } from './IVisitSchedule';

const VisitSchedule = () => {
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
    const [openModal, setOpenModal] = useState(false);
    const [rows, setRows] = useState<any[]>([]);
    const [visitScheduleDataSelected, setVisitScheduleDataSelected] = useState<VisitScheduleData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const AuthContext = useAuth();

    const fetchData = async () => {
        if (!AuthContext.user) return;
        setLoading(true);
        try {
            const organization = AuthContext.user.organization.id;
            const response: any = await ApiService.get(`/visit-schedule?organization=${organization}`);
            const schedules = response.map((schedule: VisitScheduleData) => ({
                id: schedule.id,
                description: schedule.description,
            }));
            setRows(schedules);
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
            field: 'cpf',
            headerName: 'CPF',
            width: 250,
            editable: false,
            disableColumnMenu: true
        },
        {
            field: 'phoneNumber',
            headerName: 'Telefone',
            width: 200,
            editable: false,
            disableColumnMenu: true
        },
        {
            field: 'endereco',
            headerName: 'Endereço',
            width: 350,
            editable: false,
            disableColumnMenu: true,
        },
        {
            field: 'cep',
            headerName: 'CEP',
            width: 120,
            editable: false,
            disableColumnMenu: true
        },
    ];

    const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
        setSelectedRows(newSelection);
    };

    const handleAddClick = () => {
        setVisitScheduleDataSelected(null);
        setOpenModal(true);
    };

    const handleEditClick = () => {
        if (selectedRows.length === 1) {
            const scheduleToEdit = rows.find((row) => row.id === selectedRows[0]);

            if (scheduleToEdit) {
                setVisitScheduleDataSelected(scheduleToEdit);
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
                await ApiService.delete('/visit-schedule', {
                    data: rowsToDelete
                });

                toast.success("Agendamento excluído com sucesso");
                refreshGrid();
                setSelectedRows([]);
            } catch (error) {
                toast.error("Erro ao excluir agendamento");
            }

        }
    };

    return (
        <>
            <Box sx={{ width: '100%', marginTop: 5 }}>
                <Container maxWidth={false}>
                    <Typography variant="h4" component="h1" gutterBottom style={{ marginTop: 25 }}>
                        Agendamentos
                    </Typography>

                    <TopButtons
                        buttonLabel="Novo Agendamento"
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

                    <VisitScheduleModal
                        open={openModal}
                        handleClose={handleCloseModal}
                        rows={rows}
                        visitDataSelected={visitScheduleDataSelected}
                        onSuccess={refreshGrid}
                    />
                </Container>
            </Box>
        </>
    );
}

export default VisitSchedule;
