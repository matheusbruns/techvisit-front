import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

interface ActionButtonsProps {
    buttonLabel: string;
    onAddClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
    isEditDisabled: boolean;
    isDeleteDisabled: boolean;
}

export default function TopButtons({
    buttonLabel,
    onAddClick,
    onEditClick,
    onDeleteClick,
    isEditDisabled,
    isDeleteDisabled
}: ActionButtonsProps) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: 2 }}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                sx={{ backgroundColor: '#f97316' }}
                onClick={onAddClick}
            >
                {buttonLabel}
            </Button>
            <Box sx={{ display: 'flex', gap: '5px' }}>
                <IconButton onClick={onEditClick} disabled={isEditDisabled}>
                    <Edit />
                </IconButton>
                <IconButton onClick={onDeleteClick} disabled={isDeleteDisabled}>
                    <Delete />
                </IconButton>
            </Box>
        </Box>
    );
}
