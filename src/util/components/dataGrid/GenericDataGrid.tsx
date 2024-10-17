import React, { useEffect, useState } from 'react';
import { Box, LabelDisplayedRowsArgs, paginationClasses, styled } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomToolbar from './customToolbar/CustomToolBar';
import { GenericDataGridProps } from './IGenericDataGrid';

const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .no-rows-primary': {
        fill: '#3D4751',
        ...theme.applyStyles('light', {
            fill: '#AEB8C2',
        }),
    },
    '& .no-rows-secondary': {
        fill: '#1D2126',
        ...theme.applyStyles('light', {
            fill: '#E8EAED',
        }),
    },
}));

const customLocaleText = {
    noRowsLabel: 'Nenhuma linha disponível',
    columnMenuSortAsc: 'Ordenar crescente',
    columnMenuSortDesc: 'Ordenar decrescente',
    columnMenuFilter: 'Filtrar',
    columnMenuHideColumn: 'Ocultar Coluna',
    columnMenuShowColumns: 'Mostrar Colunas',
    columnMenuUnsort: 'Remover ordenação',
    columnHeaderFiltersTooltipActive: (count: number) => `${count} ${count !== 1 ? 'filtros ativos' : 'filtro ativo'}`,
    footerRowSelected: (count: { toLocaleString: () => any; }) => `${count.toLocaleString()} linha(s) selecionada(s)`,
    footerTotalRows: 'Total de Linhas:',
    footerTotalVisibleRows: (visibleCount: { toLocaleString: () => any; }, totalCount: { toLocaleString: () => any; }) =>
        `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,
};

function CustomNoRowsOverlay() {
    return (
        <StyledGridOverlay>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width={96}
                viewBox="0 0 452 257"
                aria-hidden
                focusable="false"
            >
                <path
                    className="no-rows-primary"
                    d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
                />
                <path
                    className="no-rows-secondary"
                    d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
                />
            </svg>
            <Box sx={{ mt: 2 }}>Nenhuma linha encontrada</Box> { }
        </StyledGridOverlay>
    );
}

const GenericDataGrid: React.FC<GenericDataGridProps> = ({
    rows,
    columns,
    onRowSelectionChange,
    pageSizeOptions,
    loading,
}) => {

    return (
        <Box sx={{ width: '100%', height: 'calc(100vh - 250px)' }}>
            <DataGrid
                style={{
                    height: "100%"
                }}
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
                loading={loading}
                rows={rows}
                columns={columns}
                autoPageSize={true}
                pageSizeOptions={pageSizeOptions}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={onRowSelectionChange}
                slots={{
                    toolbar: CustomToolbar,
                    noRowsOverlay: CustomNoRowsOverlay,
                }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                    pagination: {
                        labelDisplayedRows: ({
                            from,
                            to,
                            count,
                        }: LabelDisplayedRowsArgs) =>
                            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`,
                    },
                }}
                localeText={customLocaleText}
            />
        </Box>
    );
};

export default GenericDataGrid;