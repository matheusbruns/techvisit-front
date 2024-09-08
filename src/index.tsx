import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const theme = createTheme(
    {
        palette: {
            primary: { main: '#ff6a00' },
        },
    },
    ptBR
)

root.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
);

reportWebVitals();
