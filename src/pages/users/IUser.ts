import dayjs from 'dayjs';
import { Organization } from '../../contexts/IAuthContext';
import { initialOrganizationData } from '../organization/IOrganization';

export interface User {
    id: number | null;
    login: string;
    role: UserRole | string;
    organization: Organization;
    creationDate: string | null;
    active: boolean;
}

export const initialUserData: User = {
    id: null,
    login: '',
    role: 'USER',
    organization: initialOrganizationData,
    creationDate: dayjs().format('YYYY-MM-DD'),
    active: true,
};

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

