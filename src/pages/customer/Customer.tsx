import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import TopButtons from '../../util/components/topButtons/TopButtons';
import GenericDataGrid from '../../util/components/dataGrid/GenericDataGrid';
import CustomerModal from './components/CustomerModal';
import ApiService from '../../api/ApiService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Customer as CustomerData } from './ICustomer';

const Customer = () => {
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
    const [openModal, setOpenModal] = useState(false);
    const [rows, setRows] = useState<any[]>([]);
    const [customerDataSelected, setCustomerDataSelected] = useState<CustomerData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const AuthContext = useAuth();

    const fetchData = async () => {
        if (!AuthContext.user) return;
        setLoading(true);
        try {
            const organization = AuthContext.user.organization.id;
            const response: CustomerData[] = await ApiService.get(`/customer?organization=${organization}`);
            const customers = response.map((customer: CustomerData) => ({
                id: customer.id,
                name: `${customer.firstName} ${customer.lastName}`,
                firstName: customer.firstName,
                lastName: customer.lastName,
                cpf: customer.cpf,
                phoneNumber: customer.phoneNumber,
                street: customer.street,
                number: customer.number,
                complement: customer.complement,
                cep: customer.cep,
                organizationName: customer.organization.name,
                endereco: customer.street + " - " + customer.number + " " + (customer.complement ? ', ' + customer.complement : ''),
                state: customer.state,
                city: customer.city,
                neighborhood: customer.neighborhood,
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
        setCustomerDataSelected(null);
        setOpenModal(true);
    };

    const handleEditClick = () => {
        if (selectedRows.length === 1) {
            const customerToEdit = rows.find((row) => row.id === selectedRows[0]);

            if (customerToEdit) {
                setCustomerDataSelected(customerToEdit);
                setOpenModal(true);
            }
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setCustomerDataSelected(null);
    };

    const handleDeleteClick = async () => {
        if (selectedRows.length > 0) {
            try {
                const rowsToDelete = selectedRows.map((rowId: any) => parseInt(rowId));
                await ApiService.delete('/customer', {
                    data: rowsToDelete
                });

                toast.success("Cliente excluído com sucesso");
                refreshGrid();
                setSelectedRows([]);
            } catch (error) {
                toast.error("Este cliente possui agendamentos e não pode ser excluído");
            }

        }
    };

    return (
        <Box sx={{ width: '100%', marginTop: 5 }}>
            <Container maxWidth={false}>
                <Typography variant="h4" component="h1" gutterBottom style={{ marginTop: 25 }}>
                    Clientes
                </Typography>

                <TopButtons
                    buttonLabel="Novo Cliente"
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

                <CustomerModal
                    open={openModal}
                    handleClose={handleCloseModal}
                    rows={rows}
                    customerDataSelected={customerDataSelected}
                    onSuccess={refreshGrid}
                />
            </Container>
        </Box>
    );
}

export default Customer;
