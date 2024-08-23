import React, { useState } from 'react';
import { Box, Container, Breadcrumbs, Typography, Link } from '@mui/material';
import Header from '../../util/components/header/Header';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import TopButtons from '../../util/components/topButtons/TopButtons';
import GenericDataGrid from '../../util/components/dataGrid/GenericDataGrid';
import CustomerModal from './components/CustomerModal';

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
        headerName: 'cpf',
        width: 250,
        editable: false,
        disableColumnMenu: true
    },
    {
        field: 'email',
        headerName: 'email',
        width: 250,
        editable: false,
        disableColumnMenu: true
    },
    {
        field: 'phoneNumber',
        headerName: 'Telefone',
        width: 250,
        editable: false,
        disableColumnMenu: true
    },

];

const rows = [
    { id: 1, name: "Jose Antonio", cpf: "123.123.123-12", email: "joseantoniodasilva@gmail.com", phoneNumber: "(47) 99231-1243" },
    { id: 2, name: "Maria Fernanda", cpf: "987.654.321-09", email: "mariafernanda.santos@hotmail.com", phoneNumber: "(11) 98567-4321" },
    { id: 3, name: "Carlos Eduardo", cpf: "456.789.123-00", email: "carloseduardo1995@yahoo.com", phoneNumber: "(21) 98765-6789" },
    { id: 4, name: "Ana Paula", cpf: "321.654.987-77", email: "anapaula@gmail.com", phoneNumber: "(19) 98123-4567" },
    { id: 5, name: "Roberto Silva", cpf: "654.321.987-55", email: "roberto.silva@outlook.com", phoneNumber: "(31) 99876-5432" },
    { id: 6, name: "Luciana Oliveira", cpf: "789.123.456-66", email: "luciana.oliveira@hotmail.com", phoneNumber: "(41) 99321-8765" },
    { id: 7, name: "Felipe Costa", cpf: "123.456.789-33", email: "felipecosta@gmail.com", phoneNumber: "(51) 91234-5678" },
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
                        <Typography color="text.primary">Clientes</Typography>
                    </Breadcrumbs>

                    <Typography variant="h4" component="h1" gutterBottom>
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
                        selectedRows={selectedRows}
                        onRowSelectionChange={handleSelectionChange}
                        pageSizeOptions={[5, 10, 20, 50]}
                        rowsPerPage={rowsPerPage}
                    />

                    <CustomerModal open={openModal} handleClose={handleCloseModal} />

                </Container>
            </Box>
        </>
    );
}