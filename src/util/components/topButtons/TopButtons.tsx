import React, { useState } from 'react';
import { Box, Button, IconButton, Popover, Typography } from '@mui/material';
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
}: Readonly<ActionButtonsProps>) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleConfirmDelete = () => {
        onDeleteClick();
        handleClosePopover();
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? 'delete-confirm-popover' : undefined;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: 2 }}>
            <Button
                variant="contained"
                sx={{
                    backgroundColor: '#f97316',
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#e56b0a',
                    },
                }}
                startIcon={<Add />}
                onClick={onAddClick}
            >
                {buttonLabel}
            </Button>
            <Box sx={{ display: 'flex', gap: '5px' }}>
                <IconButton onClick={onEditClick} disabled={isEditDisabled} aria-label="Editar">
                    <Edit />
                </IconButton>
                <IconButton onClick={handleDeleteClick} disabled={isDeleteDisabled} aria-label="Excluir">
                    <Delete />
                </IconButton>

                <Popover
                    sx={{ marginTop: 1 }}
                    id={popoverId}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <Typography>Tem certeza que deseja excluir?</Typography>
                        <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                            <Button
                                variant="outlined"
                                onClick={handleClosePopover}
                            >
                                Cancelar
                            </Button>
                            <Button
                                aria-label="Excluir"
                                variant="contained"
                                color="error"
                                onClick={handleConfirmDelete}
                            >
                                Excluir
                            </Button>
                        </Box>
                    </Box>
                </Popover>
            </Box>
        </Box>
    );
}
