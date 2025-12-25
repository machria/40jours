'use client';

import { useState } from 'react';
// import { signIn } from '@/auth'; // Can't import server action directly in client component like this usually in V5 if not careful.
// Using next-auth/react for client side or server action bridge.
// For V5 beta, recommended path is Server Actions or signIn from next-auth/react.
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Identifiants invalides");
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            setError("Une erreur est survenue");
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold font-kufi">Bienvenue</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Entrez votre email pour vous connecter ou créer un compte
                </p>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-6">
                <div className="grid gap-2">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        className="border p-2 rounded-lg"
                    />
                </div>
                <div className="grid gap-2">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="border p-2 rounded-lg"
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90">
                    Se connecter
                </button>
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium font-kufi text-primary">
                        Coran 40 Jours
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <div className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale bg-primary/10 flex items-center justify-center text-primary/20 p-20 text-center font-kufi text-4xl">
                    Illustration Islamique
                </div>
            </div>
        </div>
    )
}
