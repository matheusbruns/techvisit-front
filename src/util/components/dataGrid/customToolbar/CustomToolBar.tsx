import React from 'react';
import { Box, Button } from '@mui/material';
import { GridToolbarQuickFilter, GridToolbarExport } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';

const CustomToolbar = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 16px',
                backgroundColor: '#f5f5f5',
                borderBottom: '1px solid #3A3A3A',
                borderRadius: '8px 8px 0 0',
            }}
        >
            <GridToolbarQuickFilter
                sx={{
                    color: '#ffffff',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    '& input': {
                        color: '#3a3a3a',
                    },
                    '& .MuiSvgIcon-root': {
                        color: '#f97316',
                        marginRight: '5px'
                    },
                }}
                placeholder="Pesquisar..."
            />
            {/* <Button
                startIcon={<DownloadIcon />}
                sx={{
                    backgroundColor: '#f97316',
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#e56b0a',
                    },
                }}
                onClick={() => {
                    const toolbar = document.querySelector('.MuiDataGrid-toolbarContainer');
                    toolbar && toolbar.querySelector('button[aria-label="Export"]')?.click();
                }}
            >
                Exportar
            </Button> */}
        </Box>
    );
};

export default CustomToolbar;