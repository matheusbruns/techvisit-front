import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import Header from '../../util/components/header/Header';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import TopButtons from '../../util/components/topButtons/TopButtons';
import GenericDataGrid from '../../util/components/dataGrid/GenericDataGrid';
import CustomerModal from './components/CustomerModal';
import ApiService from '../../conection/api';

const Organization = () => {
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
    const [openModal, setOpenModal] = useState(false);
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: any = await ApiService.get('/customer?organization=1');
                const customers = response.map((customer: any) => ({
                    id: customer.id,
                    name: `${customer.firstName} ${customer.lastName}`,
                    cpf: customer.cpf,
                    phoneNumber: customer.phoneNumber,
                    street: customer.street,
                    number: customer.number,
                    complement: customer.complement,
                    cep: customer.cep,
                    organizationName: customer.organization.name,
                    endereco: customer.street + " - " + customer.number + " " + (customer.complement ? ', ' + customer.complement : '')
                }));
                setRows(customers);
            } catch (error) {
                console.error('Erro ao buscar dados', error);
            }
        };

        fetchData();
    }, []);

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
            width: 150,
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
            width: 300,
            editable: false,
            disableColumnMenu: true,
        },
        {
            field: 'cep',
            headerName: 'CEP',
            width: 100,
            editable: false,
            disableColumnMenu: true
        },
    ];

    const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
        setSelectedRows(newSelection);
    };

    const handleAddClick = () => {
        setOpenModal(true);
    };

    const handleEditClick = () => {
        if (selectedRows.length === 1) {
            console.log('Editar cliente com ID:', selectedRows[0]);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDeleteClick = () => {
        if (selectedRows.length > 0) {
            console.log('Excluir clientes com IDs:', selectedRows);
        }
    };

    return (
        <>
            <Header />
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
                    />

                    <CustomerModal open={openModal} handleClose={handleCloseModal} />
                </Container>
            </Box>
        </>
    );
}

export default Organization;
