export interface Organization {
    id: number;
    externalCode: string;
    name: string;
    creationDate: string | null;
    expirationDate: string | null;
}

export const initialOrganizationData: Organization = {
    id: 0,
    externalCode: '',
    name: '',
    creationDate: null,
    expirationDate: null,
};