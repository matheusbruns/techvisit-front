import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, TextField } from '@mui/material';

interface State {
    code: string;
    name: string;
}

const states: State[] = [
    { code: 'AC', name: 'Acre' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'AP', name: 'Amapá' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'BA', name: 'Bahia' },
    { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'ES', name: 'Espírito Santo' },
    { code: 'GO', name: 'Goiás' },
    { code: 'MA', name: 'Maranhão' },
    { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'PA', name: 'Pará' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'PR', name: 'Paraná' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'PI', name: 'Piauí' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'RN', name: 'Rio Grande do Norte' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'RO', name: 'Rondônia' },
    { code: 'RR', name: 'Roraima' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'SP', name: 'São Paulo' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'TO', name: 'Tocantins' },
];

interface StateSelectProps {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    margin?: 'none' | 'dense' | 'normal';
    size?: 'small' | 'medium';
}

const StateSelect: React.FC<StateSelectProps> = ({ value, onChange, error, helperText, required, disabled, fullWidth, margin, size }) => {
    const stateSelected: any = states.find((state) => state.code === value) || null;

    return (
        <Autocomplete
            options={states}
            getOptionLabel={(option) => option.name}
            value={stateSelected}
            onChange={(event, newValue) => {
                onChange(newValue ? newValue.code : '');
            }}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Estado"
                    error={error}
                    helperText={helperText}
                    required={required}
                    disabled={disabled}
                    margin={margin}
                    fullWidth={fullWidth}
                />
            )}
            disableClearable
            sx={{
                minWidth: 120,
                '& .MuiInputBase-root': {
                    height: size === 'small' ? 55 : undefined,
                },
            }}
        />
    );
}

StateSelect.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    margin: PropTypes.oneOf(['none', 'dense', 'normal']),
    size: PropTypes.oneOf(['small', 'medium']),
};

StateSelect.defaultProps = {
    error: false,
    helperText: '',
    required: false,
    disabled: false,
    fullWidth: true,
    margin: 'normal',
    size: 'medium',
};

export default StateSelect;
