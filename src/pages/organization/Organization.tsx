import React, { useState } from 'react'
import Header from '../../util/components/header/Header'
import { Box, Container, Typography } from '@mui/material'
import TopButtons from '../../util/components/topButtons/TopButtons'
import GenericDataGrid from '../../util/components/dataGrid/GenericDataGrid'
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import OrganizationModal from './components/OrganizationModal'

export function Organization() {
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
    const [openModal, setOpenModal] = useState(false);
    const [rows, setRows] = useState<any[]>([]);


    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Nome',
            width: 250,
            editable: false,
            disableColumnMenu: true
        },
        {
            field: 'externalCode',
            headerName: 'Código',
            width: 150,
            editable: false,
            disableColumnMenu: true
        },
        {
            field: 'creationDate',
            headerName: 'Data de criação',
            width: 200,
            editable: false,
            disableColumnMenu: true
        },
        {
            field: 'expirationDate',
            headerName: 'Data de expiração',
            width: 300,
            editable: false,
            disableColumnMenu: true,
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
                        Empresas
                    </Typography>

                    <TopButtons
                        buttonLabel="Nova Empresa"
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
                    <OrganizationModal open={openModal} handleClose={handleCloseModal} rows={rows} />
                </Container>
            </Box>
        </>
    )
}