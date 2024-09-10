import { Organization } from "../organization/IOrganization";

export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    cpf: string;
    phoneNumber: string;
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