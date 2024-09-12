import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface NotFoundProps {
    statusCode: string;
    primaryMessage: string;
    secondaryMessage: string;
}

const NotFound: React.FC<NotFoundProps> = ({ statusCode, primaryMessage, secondaryMessage }) => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', mt: 10 }}>
            <Typography variant="h1" component="div" sx={{ fontWeight: 'bold', fontSize: '6rem', color: '#ff6a00' }}>
                {statusCode}
            </Typography>
            <Typography variant="h5" component="p" sx={{ mt: 2, color: '#fff' }}>
                {primaryMessage}
            </Typography>
            <Typography variant="body1" component="p" sx={{ mt: 2, color: '#898989', fontWeight: 700 }}>
                {secondaryMessage}
            </Typography>
            <Box sx={{ mt: 4 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#ff6a00',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#e56b0a',
                        },
                    }}
                    onClick={handleGoBack}
                >
                    Voltar para a página inicial
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;