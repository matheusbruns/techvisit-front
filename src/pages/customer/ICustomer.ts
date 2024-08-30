export interface Organization {
    id: number;
    externalCode: string;
    name: string;
    creationDate: string | null;
    expirationDate: string | null;
}

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