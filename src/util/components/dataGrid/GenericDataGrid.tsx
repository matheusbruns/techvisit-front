import React from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import CustomToolbar from './customToolbar/CustomToolBar';
import { GenericDataGridProps } from './IGenericDataGrid';

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

const GenericDataGrid: React.FC<GenericDataGridProps> = ({
    rows,
    columns,
    selectedRows,
    onRowSelectionChange,
    pageSizeOptions,
    rowsPerPage,
    onRowsPerPageChange,
}) => {
    return (
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
                            pageSize: rowsPerPage,
                        },
                    },
                }}
                pageSizeOptions={pageSizeOptions}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={onRowSelectionChange}
                slots={{
                    toolbar: CustomToolbar,
                }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                }}
                localeText={customLocaleText}
            />
        </Box>
    );
};

export default GenericDataGrid;
