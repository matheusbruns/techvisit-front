import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-toastify';

export interface ErrorResponse {
    message: string;
}

class ApiService {
    private static instance: ApiService;
    private readonly axiosInstance: AxiosInstance;

    private constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.initializeResponseInterceptor();
    }

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    private initializeResponseInterceptor() {
        this.axiosInstance.interceptors.response.use(
            this.handleResponse,
            this.handleError
        );
    }

    private handleResponse<T>(response: AxiosResponse<T>): AxiosResponse<T> {
        return response;
    }

    private handleError(error: AxiosError<ErrorResponse>) {
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data as any;
            const errorCode = data.errorCode;

            if (errorCode === 'INVALID_CREDENTIALS') {
                toast.error('Usuário ou senha inválidos!');
            } else if (errorCode === 'USER_INACTIVE') {
                toast.error('Seu usuário está inativo. Por favor, contate o administrador.');
            } else if (errorCode === 'TOKEN_EXPIRED') {
                toast.error('Sessão expirada. Você será redirecionado para o login.');
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setTimeout(() => {
                    window.location.reload();
                }, 5000);
            } else if (errorCode === 'ACCESS_DENIED') {
                toast.error('Acesso negado. Você será redirecionado para o login.');
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setTimeout(() => {
                    window.location.reload();
                }, 5000);
            }
        } else if (error.request) {
            toast.error('Sem resposta do servidor.');
        }

        return Promise.reject(new Error(error.message || 'Unknown error'));
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const token = localStorage.getItem("token");
        if (token) {
            this.setAuthorizationHeader(token);
        }
        const response = await this.axiosInstance.get<T>(url, config);
        return response.data;
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const token = localStorage.getItem("token");
        if (token) {
            this.setAuthorizationHeader(token);
        }
        const response = await this.axiosInstance.post<T>(url, data, config);
        return response.data;
    }

    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const token = localStorage.getItem("token");
        if (token) {
            this.setAuthorizationHeader(token);
        }
        const response = await this.axiosInstance.put<T>(url, data, config);
        return response.data;
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const token = localStorage.getItem("token");
        if (token) {
            this.setAuthorizationHeader(token);
        }
        const response = await this.axiosInstance.delete<T>(url, config);
        return response.data;
    }

    public setAuthorizationHeader(token: string | null) {
        if (token) {
            this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.axiosInstance.defaults.headers.common['Authorization'];
        }
    }
}

export default ApiService.getInstance();
