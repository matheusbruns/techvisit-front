import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-toastify';

export interface ErrorResponse {
    message: string;
}

class ApiService {
    private static instance: ApiService;
    private axiosInstance: AxiosInstance;

    private constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
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
            const message = error.response.data.message || 'Ocorreu um erro no servidor';

            if (status === 403 || 401) {
                toast.error('Sessão expirada. Você será redirecionado para o login.');
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                window.location.reload();
            } else {
                toast.error(message);
            }
        } else if (error.request) {
            toast.error('Sem resposta do servidor. Verifique sua conexão.');
        } else {
            toast.error('Erro na requisição. Tente novamente.');
        }
        return Promise.reject(error);
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
