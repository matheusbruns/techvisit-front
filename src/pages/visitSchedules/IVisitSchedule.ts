import { Customer, initialCustomerData } from "../customer/ICustomer";
import { initialOrganizationData, Organization } from "../organization/IOrganization";
import { initialTechnicianData, Technician } from "../technicians/ITechnician";

export interface VisitScheduleData {
    id: number;
    description: string;
    customer: Customer;
    city: string;
    state: string;
    neighborhood: string;
    street: string;
    number: string;
    complement: string | null;
    cep: string;
    price: number | null;
    comment: string;
    organization: Organization;
    technician: Technician;
    startDateTime: Date | null;
    endDateTime: Date | null;
    startDate: string | null;
    endDate: string | null;
    status: VisitScheduleStatus;
}

export enum VisitScheduleStatus {
    SCHEDULED = 'SCHEDULED',
    ATTENDED = 'ATTENDED',
    NOT_ATTENDED = 'NOT_ATTENDED',
    CANCELLED = 'CANCELLED',
}

export const initialVisitScheduleData: VisitScheduleData = {
    id: 0,
    description: '',
    city: '',
    state: '',
    neighborhood: '',
    street: '',
    number: '',
    complement: '',
    cep: '',
    price: null,
    comment: '',
    endDateTime: null,
    startDateTime: null,
    startDate: null,
    endDate: null,
    customer: initialCustomerData,
    technician: initialTechnicianData,
    organization: initialOrganizationData,
    status: VisitScheduleStatus.SCHEDULED,
};

