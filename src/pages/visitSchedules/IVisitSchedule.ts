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
    endDateTime: string | undefined;
    startDateTime: string | undefined;
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
    endDateTime: '',
    startDateTime: '',
    customer: initialCustomerData,
    technician: initialTechnicianData,
    organization: initialOrganizationData,
};