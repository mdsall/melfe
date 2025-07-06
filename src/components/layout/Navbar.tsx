// src/components/layout/Navbar.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useHydration } from '@/hooks/useHydration';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Menu,
    X,
    User,
    ShoppingBag,
    LogOut,
    Settings,
    Package,
    Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
    const { user, isAuthenticated, logout, isLoading } = useAuth();
    const { cart } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isHydrated = useHydration();

    const cartItemsCount = cart.itemCount || 0;

    const navigationLinks = [
        { href: '/boutique', label: 'Boutique' },
        { href: '/nouvelles-arrivees', label: 'Nouvelles Arrivées' },
        { href: '/collections', label: 'Collections' },
        { href: '/promotions', label: 'Promotions' },
        { href: '/accessoires', label: 'Accessoires' },
    ];

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-gray-900">
                            MELHFA
                        </Link>
                    </div>

                    {/* Navigation Desktop */}
                    <div className="hidden md:flex space-x-8">
                        {navigationLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Actions Desktop */}
                    <div className="hidden md:flex items-center space-x-4">

                        {/* Panier */}
                        <Link href="/panier" className="relative p-2">
                            <ShoppingBag className="h-6 w-6 text-gray-700 hover:text-gray-900" />
                            {isHydrated && cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>

                        {/* Aide */}
                        <Link href="/aide" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                            Aide
                        </Link>

                        {/* Authentification */}
                        {isHydrated && !isLoading && (
                            <>
                                {isAuthenticated && user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="flex items-center space-x-2">
                                                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                    <User className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="hidden lg:block">
                                                    {user.firstName || user.displayName}
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel>
                                                <div>
                                                    <p className="font-medium">{user.displayName}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/account" className="flex items-center">
                                                    <User className="mr-2 h-4 w-4" />
                                                    Mon compte
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/account?tab=orders" className="flex items-center">
                                                    <Package className="mr-2 h-4 w-4" />
                                                    Mes commandes
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/wishlist" className="flex items-center">
                                                    <Heart className="mr-2 h-4 w-4" />
                                                    Liste de souhaits
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/account?tab=settings" className="flex items-center">
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    Paramètres
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={logout} className="text-red-600">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Déconnexion
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Button variant="ghost" asChild>
                                            <Link href="/auth/login">Connexion</Link>
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Menu Mobile Toggle */}
                    <div className="md:hidden flex items-center space-x-2">
                        <Link href="/panier" className="relative p-2">
                            <ShoppingBag className="h-6 w-6 text-gray-700" />
                            {isHydrated && cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6 text-gray-700" />
                            ) : (
                                <Menu className="h-6 w-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Mobile */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navigationLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="border-t pt-4">
                            <Link
                                href="/aide"
                                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Aide
                            </Link>

                            {isHydrated && !isLoading && (
                                <>
                                    {isAuthenticated && user ? (
                                        <div className="space-y-1">
                                            <Link
                                                href="/account"
                                                className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <User className="mr-3 h-5 w-5" />
                                                Mon compte
                                            </Link>
                                            <Link
                                                href="/account?tab=orders"
                                                className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <Package className="mr-3 h-5 w-5" />
                                                Mes commandes
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                                            >
                                                <LogOut className="mr-3 h-5 w-5" />
                                                Déconnexion
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <Link
                                                href="/auth/login"
                                                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Connexion
                                            </Link>
                                            <Link
                                                href="/auth/register"
                                                className="block px-3 py-2 bg-black text-white hover:bg-gray-800 rounded-md"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Inscription
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}