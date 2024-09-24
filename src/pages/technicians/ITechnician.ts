
export interface Technician {
    id?: number;
    name: string;
    cpf: string;
    email: string;
    phoneNumber: string;
    login: string;
    password?: string;
    confirmPassword?: string;
    organization?: any;
}

export interface TechnicianModalProps {
    open: boolean;
    handleClose: () => void;
    rows: any[];
    technicianDataSelected?: any;
    onSuccess?: () => void;
}

export const initialTechnicianData: Technician = {
    name: '',
    cpf: '',
    email: '',
    phoneNumber: '',
    login: '',
    password: '',
    confirmPassword: '',
};
