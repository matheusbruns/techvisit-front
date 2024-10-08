import { Organization } from "../organization/IOrganization";

export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    cpf: string;
    phoneNumber: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    number: string;
    complement: string | null;
    cep: string;
    organization: Organization;
}

export interface ApiResponse {
    data: Customer[];
}

export const initialCustomerData: Customer = {
    id: 0,
    firstName: '',
    lastName: '',
    cpf: '',
    phoneNumber: '',
    state: '',
    city: '',
    neighborhood: '',
    street: '',
    number: '',
    complement: '',
    cep: '',
    organization: {
        id: 1,
        externalCode: 'Default Organization',
        name: 'default',
        creationDate: '2024-01-01',
        expirationDate: '2024-01-01'
    },
};

export interface CustomerSelect {
    id: number;
    name: string;
}