export interface ILogin {
    login: string,
    password: string,
}

export interface Organization {
    id: number;
    externalCode: string;
    name: string;
}

export interface User {
    id: number;
    login: string;
    role: string;
    organization: Organization;
    isActive: boolean;
}