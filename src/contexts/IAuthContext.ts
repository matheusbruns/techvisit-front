export interface ILogin {
    login: String,
    password: String,
}

export interface Organization {
    id: number;
    externalCode: string;
    name: string;
}

export interface User {
    login: string;
    role: string;
    organization: Organization;
    isActive: boolean;
}