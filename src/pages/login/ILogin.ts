import { UserRole } from "../../util/userRole/UserRole";

export interface LoginPayload {
    userName: string;
    password: string;
}

export interface LoginResponse {
    user: {
        login: String,
        role: UserRole,
        organization: {
            id: BigInteger,
            externalCode: String,
            name: String,
        },
    },
    token: string;
}