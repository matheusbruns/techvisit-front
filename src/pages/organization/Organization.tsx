import React, { useState } from 'react';
import { Box, Container, Breadcrumbs, Typography, Link } from '@mui/material';
import Header from '../../util/components/header/Header';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import TopButtons from '../../util/components/topButtons/TopButtons';
import GenericDataGrid from '../../util/components/dataGrid/GenericDataGrid';
import CompanyModal from './components/CompanyModal';

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 90,
        disableColumnMenu: true
    },
    {
        field: 'externalCode',
        headerName: 'Código Externo',
        width: 250,
        editable: false,
        disableColumnMenu: true
    },
    {
        field: 'name',
        headerName: 'Nome',
        width: 250,
        editable: false,
        disableColumnMenu: true
    },
    {
        field: 'status',
        headerName: 'Status',
        type: 'boolean',
        width: 210,
        editable: false,
        disableColumnMenu: true
    },
];

const rows = [
    { id: 1, externalCode: 'Snow', name: 'empresa', status: false },
    { id: 2, externalCode: 'Lannister 1', name: 'empresa', status: false },
    { id: 3, externalCode: 'Lannister 2', name: 'empresa', status: false },
    { id: 4, externalCode: 'Lannister 3', name: 'empresa', status: false },
    { id: 5, externalCode: 'Lannister 4', name: 'empresa', status: false },
    { id: 6, externalCode: 'Lannister 5', name: 'empresa', status: false },
    { id: 7, externalCode: 'Lannister 6', name: 'empresa', status: false },
];

export default function Organization() {
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [openModal, setOpenModal] = useState(false);

    const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
        setSelectedRows(newSelection);
    };

    const handleAddClick = () => {
        setOpenModal(true);
    };

    const handleEditClick = () => {
        if (selectedRows.length === 1) {
            console.log('Editar empresa com ID:', selectedRows[0]);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDeleteClick = () => {
        if (selectedRows.length > 0) {
            console.log('Excluir empresas com IDs:', selectedRows);
        }
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <Header />
            <Box>
                <Container >
                    <Breadcrumbs aria-label="breadcrumb" sx={{ marginY: 5 }}>
                        <Link underline="hover" color="inherit" href="/">
                            Início
                        </Link>
                        <Link underline="hover" color="inherit" href="/">
                            Administrador
                        </Link>
                        <Typography color="text.primary">Empresa</Typography>
                    </Breadcrumbs>

                    <Typography variant="h4" component="h1" gutterBottom>
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
                        selectedRows={selectedRows}
                        onRowSelectionChange={handleSelectionChange}
                        pageSizeOptions={[5, 10, 20, 50]}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                    <CompanyModal open={openModal} handleClose={handleCloseModal} />

                </Container>
            </Box>
        </>
    );
}