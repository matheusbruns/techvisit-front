import React, { useState } from 'react';
import { Box, Container, Breadcrumbs, Typography, Link } from '@mui/material';
import Header from '../../util/components/header/Header';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import TopButtons from '../../util/components/topButtons/TopButtons';

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
    { id: 8, externalCode: 'Lannister 7', name: 'empresa', status: false },
];

export default function EmpresaScreen() {
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

    const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
        setSelectedRows(newSelection);
    };

    const handleAddClick = () => {
        console.log('Nova Empresa clicada');
    };

    const handleEditClick = () => {
        if (selectedRows.length === 1) {
            console.log('Editar empresa com ID:', selectedRows[0]);
        }
    };

    const handleDeleteClick = () => {
        if (selectedRows.length > 0) {
            console.log('Excluir empresas com IDs:', selectedRows);
        }
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

                    <Box sx={{ width: '100%' }}>
                        <DataGrid
                            sx={{
                                boxShadow: 1,
                                border: 1,
                                borderColor: '#3A3A3A',
                                '& .MuiDataGrid-cell:hover': {
                                    color: '#3A3A3A',
                                },
                                '& .css-12wnr2w-MuiButtonBase-root-MuiCheckbox-root.Mui-checked': {
                                    color: '#ff6a00',
                                },
                                '& .MuiDataGrid-row:nth-of-type(even)': {
                                    backgroundColor: '#f5f5f5',
                                },
                                '& .MuiDataGrid-row:nth-of-type(odd)': {
                                    backgroundColor: '#ffffff',
                                },
                                '& .Mui-selected': {
                                    backgroundColor: '#ffe0b2 !important',
                                },
                            }}
                            rows={rows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    },
                                },
                            }}
                            pageSizeOptions={[5]}
                            checkboxSelection
                            disableRowSelectionOnClick
                            onRowSelectionModelChange={handleSelectionChange}
                        />
                    </Box>

                </Container>
            </Box>
        </>
    );
}