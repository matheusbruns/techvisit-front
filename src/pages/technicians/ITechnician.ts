
export interface Technician {
    id?: number;
    name: string;
    cpf: string;
    email: string;
    phoneNumber: string;
    login: string;
    password?: string;
    confirmPassword?: string;
    active?: boolean;
    organization?: any;
}

export const initialTechnicianData: Technician = {
    name: '',
    cpf: '',
    email: '',
    phoneNumber: '',
    login: '',
    password: '',
    confirmPassword: '',
    active: true,
};

export interface TechnicianModalProps {
    open: boolean;
    handleClose: () => void;
    rows: any[];
    technicianDataSelected?: any;
    onSuccess?: () => void;
}

