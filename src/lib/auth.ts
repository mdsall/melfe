// src/lib/auth.ts

import { api } from './woocommerce';
import {
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    User,
    ApiError
} from '@/types/auth';

// Configuration pour l'authentification JWT
const JWT_API_URL = process.env.NEXT_PUBLIC_WC_API_URL;

export class AuthService {

    /**
     * Connexion utilisateur avec JWT
     */
    static async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await fetch(`${JWT_API_URL}/wp-json/jwt-auth/v1/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Erreur de connexion',
                };
            }

            // Récupérer les infos complètes de l'utilisateur
            const userInfo = await this.getUserInfo(data.token);

            return {
                success: true,
                data: {
                    token: data.token,
                    user: userInfo,
                    user_email: data.user_email,
                    user_nicename: data.user_nicename,
                    user_display_name: data.user_display_name,
                },
            };
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return {
                success: false,
                message: 'Erreur de connexion au serveur',
            };
        }
    }

    /**
     * Inscription d'un nouvel utilisateur
     */
    static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        try {
            // Créer le compte utilisateur via WooCommerce REST API
            const customerData = {
                username: credentials.username,
                email: credentials.email,
                password: credentials.password,
                first_name: credentials.firstName || '',
                last_name: credentials.lastName || '',
            };

            const response = await api.post('customers', customerData);

            if (response.data) {
                // Connexion automatique après inscription
                return await this.login({
                    username: credentials.username,
                    password: credentials.password,
                });
            }

            return {
                success: false,
                message: 'Erreur lors de la création du compte',
            };
        } catch (error: any) {
            console.error('Erreur lors de l\'inscription:', error);

            // Gestion des erreurs spécifiques WooCommerce
            if (error.response?.data?.message) {
                return {
                    success: false,
                    message: error.response.data.message,
                };
            }

            return {
                success: false,
                message: 'Erreur lors de la création du compte',
            };
        }
    }

    /**
     * Récupérer les informations complètes de l'utilisateur
     */
    static async getUserInfo(token: string): Promise<User> {
        try {
            // Valider le token JWT
            const validateResponse = await fetch(`${JWT_API_URL}/wp-json/jwt-auth/v1/token/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!validateResponse.ok) {
                throw new Error('Token invalide');
            }

            const userData = await validateResponse.json();

            // Récupérer les données client WooCommerce
            const customers = await api.get('customers', {
                email: userData.data.user.user_email
            });

            const customer = customers.data[0];

            return {
                id: userData.data.user.ID,
                username: userData.data.user.user_login,
                email: userData.data.user.user_email,
                firstName: customer?.first_name || '',
                lastName: customer?.last_name || '',
                displayName: userData.data.user.display_name,
                role: userData.data.user.roles[0] || 'customer',
                billing: customer?.billing || undefined,
                shipping: customer?.shipping || undefined,
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des infos utilisateur:', error);
            throw error;
        }
    }

    /**
     * Mettre à jour les informations utilisateur
     */
    static async updateUser(userId: number, userData: Partial<User>, token: string): Promise<boolean> {
        try {
            const updateData: any = {};

            if (userData.firstName) updateData.first_name = userData.firstName;
            if (userData.lastName) updateData.last_name = userData.lastName;
            if (userData.email) updateData.email = userData.email;
            if (userData.billing) updateData.billing = userData.billing;
            if (userData.shipping) updateData.shipping = userData.shipping;

            const response = await api.put(`customers/${userId}`, updateData);

            return response.data ? true : false;
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            return false;
        }
    }

    /**
     * Valider un token JWT
     */
    static async validateToken(token: string): Promise<boolean> {
        try {
            const response = await fetch(`${JWT_API_URL}/wp-json/jwt-auth/v1/token/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Rafraîchir un token JWT
     */
    static async refreshToken(token: string): Promise<string | null> {
        try {
            const response = await fetch(`${JWT_API_URL}/wp-json/jwt-auth/v1/token/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data.token;
            }

            return null;
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token:', error);
            return null;
        }
    }

    /**
     * Récupérer les commandes de l'utilisateur
     */
    static async getUserOrders(userId: number): Promise<any[]> {
        try {
            const response = await api.get('orders', { customer: userId });
            return response.data || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
            return [];
        }
    }
}