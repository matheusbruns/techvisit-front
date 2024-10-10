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
                customerName: `${schedule.customer.firstName} ${schedule.customer.lastName}`,
                phoneNumber: schedule.customer.phoneNumber,
                technicianName: schedule.technician.name,
                address: `${schedule.street}, ${schedule.number}${schedule.complement ? ', ' + schedule.complement : ''}, ${schedule.neighborhood}, ${schedule.city} - ${schedule.state}`,
                cep: schedule.cep,
                startDateTime: schedule.startDate,
                endDateTime: schedule.endDate,
                price: schedule.price,
                state: schedule.state,
                city: schedule.city,
                neighborhood: schedule.neighborhood,
                street: schedule.street,
                number: schedule.number,
                complement: schedule.complement,
                technician: schedule.technician,
                customer: schedule.customer,
                comment: schedule.comment,
                startDate: schedule.startDate,
                startTime: schedule.startDate,
            }));
            setRows(schedules);
        } catch (error) {
            console.error('Erro ao buscar dados', error);
            toast.error('Erro ao buscar dados');
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
            field: 'description',
            headerName: 'Descrição',
            width: 250,
            editable: false,
            disableColumnMenu: true,
        },
        {
            field: 'customerName',
            headerName: 'Cliente',
            width: 200,
            editable: false,
            disableColumnMenu: true,
        },
        {
            field: 'phoneNumber',
            headerName: 'Telefone',
            width: 150,
            editable: false,
            disableColumnMenu: true,
        },
        {
            field: 'technicianName',
            headerName: 'Técnico',
            width: 200,
            editable: false,
            disableColumnMenu: true,
        },
        {
            field: 'address',
            headerName: 'Endereço',
            width: 350,
            editable: false,
            disableColumnMenu: true,
        },
        {
            field: 'cep',
            headerName: 'CEP',
            width: 130,
            editable: false,
            disableColumnMenu: true,
        },
        {
            field: 'startDate',
            headerName: 'Data',
            width: 150,
            editable: false,
            disableColumnMenu: true,
            valueFormatter: (params) => {
                if (params) {
                    const date = new Date(params);
                    return date.toLocaleDateString('pt-BR');
                }
                return '';
            },
        },
        {
            field: 'startTime',
            headerName: 'Hora',
            width: 130,
            editable: false,
            disableColumnMenu: true,
            valueFormatter: (params) => {
                if (params) {
                    const date = new Date(params);
                    return date.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
                return '';
            },
        },
        {
            field: 'price',
            headerName: 'Preço',
            width: 120,
            editable: false,
            disableColumnMenu: true,
            valueFormatter: (params) => {
                if (params) {
                    return new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(params);
                }
                return 'Não definido';
            },
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
                    data: rowsToDelete,
                });

                toast.success('Agendamento excluído com sucesso');
                refreshGrid();
                setSelectedRows([]);
            } catch (error) {
                toast.error('Erro ao excluir agendamento');
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
};

export default VisitSchedule;
