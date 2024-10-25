import React, { useEffect, useState } from 'react'
import { Box, Container, Typography } from '@mui/material'
import TopButtons from '../../util/components/topButtons/TopButtons'
import GenericDataGrid from '../../util/components/dataGrid/GenericDataGrid'
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import OrganizationModal from './components/OrganizationModal'
import ApiService from '../../conection/api';
import { useAuth } from '../../contexts/AuthContext';
import { Organization as OrganizationData } from './IOrganization'
import moment from 'moment'

export function Organization() {
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
    const [openModal, setOpenModal] = useState(false);
    const [rows, setRows] = useState<any[]>([]);
    const [organizationDataSelected, setOrganizationDataSelected] = useState<OrganizationData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const AuthContext = useAuth();

    const fetchData = async () => {
        if (!AuthContext.user) return;
        setLoading(true);
        try {
            const response: OrganizationData[] = await ApiService.get(`/organization`);
            const organizations = response.map((organization: OrganizationData) => ({
                id: organization.id,
                name: organization.name,
                externalCode: organization.externalCode,
                creationDate: organization.creationDate,
                formattedCreationDate: organization.creationDate !== null ? moment(organization.creationDate).format('DD/MM/YYYY') : "",
                expirationDate: organization.expirationDate,
                formattedExpirationDate: organization.expirationDate !== null ? moment(organization.expirationDate).format('DD/MM/YYYY') : "",
            }));
            setRows(organizations);
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
            width: 350,
            editable: false,
            disableColumnMenu: true
        },
        {
            field: 'externalCode',
            headerName: 'Código',
            width: 250,
            editable: false,
            disableColumnMenu: true
        },
        {
            field: 'formattedCreationDate',
            headerName: 'Data de criação',
            width: 250,
            editable: false,
            disableColumnMenu: true
        },
        {
            field: 'formattedExpirationDate',
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
        setOrganizationDataSelected(null);
        setOpenModal(true);
    };

    const handleEditClick = () => {
        if (selectedRows.length === 1) {
            const organizationToEdit = rows.find((row) => row.id === selectedRows[0]);

            if (organizationToEdit) {
                setOrganizationDataSelected(organizationToEdit);
                setOpenModal(true);
            }
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setOrganizationDataSelected(null);
    };

    const handleDeleteClick = () => {
        if (selectedRows.length > 0) {
        }
    };

    return (
        <>
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
                        // isDeleteDisabled={selectedRows.length === 0}
                        isDeleteDisabled={true}
                    />

                    <GenericDataGrid
                        rows={rows}
                        columns={columns}
                        onRowSelectionChange={handleSelectionChange}
                        pageSizeOptions={[10]}
                        loading={loading}
                    />

                    <OrganizationModal
                        open={openModal}
                        handleClose={handleCloseModal}
                        rows={rows}
                        organizationDataSelected={organizationDataSelected}
                        onSuccess={refreshGrid}
                    />

                </Container>
            </Box>
        </>
    )
}