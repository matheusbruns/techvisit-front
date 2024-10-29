import { UserRole } from "../../util/userRole/UserRole";

export interface LoginPayload {
    userName: string;
    password: string;
}

export interface LoginResponse {
    user: {
        login: string,
        role: UserRole,
        organization: {
            id: BigInteger,
            externalCode: string,
            name: string,
        },
    },
    token: string;
}