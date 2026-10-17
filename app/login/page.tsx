'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Mode = 'login' | 'register';

const ERROR_MESSAGES: Record<string, string> = {
    no_account: "Aucun compte n'existe avec cet email. Vérifiez l'adresse ou créez un compte.",
    email_taken: 'Un compte existe déjà avec cet email. Connectez-vous.',
    weak_password: 'Le mot de passe doit contenir au moins 6 caractères.',
};

// N'accepte que des chemins internes pour éviter les redirections ouvertes
function safeCallbackUrl(raw: string | null) {
    if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/dashboard';
    return raw;
}

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = safeCallbackUrl(searchParams.get('callbackUrl'));
    const [mode, setMode] = useState<Mode>(searchParams.get('mode') === 'register' ? 'register' : 'login');
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const switchMode = (next: Mode) => {
        setMode(next);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (mode === 'register' && password !== formData.get('confirm')) {
            setError('Les deux mots de passe ne correspondent pas.');
            return;
        }

        setPending(true);
        setError(null);
        try {
            const res = await signIn('credentials', {
                email,
                password,
                mode,
                redirect: false,
            });

            if (res?.error) {
                setError(ERROR_MESSAGES[res.code ?? ''] ?? 'Email ou mot de passe incorrect.');
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            setError('Une erreur est survenue. Réessayez.');
        } finally {
            setPending(false);
        }
    };

    const isRegister = mode === 'register';

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold font-kufi">{isRegister ? 'Créer un compte' : 'Bon retour'}</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    {isRegister
                        ? 'Enregistrez votre progression et rejoignez des groupes de lecture.'
                        : 'Connectez-vous pour retrouver votre progression.'}
                </p>
            </div>

            <div role="tablist" aria-label="Type de connexion" className="grid grid-cols-2 bg-muted p-1 rounded-lg">
                {(['login', 'register'] as const).map((m) => (
                    <button
                        key={m}
                        type="button"
                        role="tab"
                        aria-selected={mode === m}
                        onClick={() => switchMode(m)}
                        className={cn(
                            'min-h-10 rounded-md text-sm font-medium transition-colors',
                            mode === m ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        {m === 'login' ? 'Connexion' : 'Inscription'}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5">
                <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="m@example.com"
                        required
                        className="border bg-background p-3 rounded-lg"
                    />
                </div>
                <div className="grid gap-2">
                    <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                        minLength={isRegister ? 6 : undefined}
                        required
                        className="border bg-background p-3 rounded-lg"
                    />
                </div>
                {isRegister && (
                    <div className="grid gap-2">
                        <label htmlFor="confirm" className="text-sm font-medium">Confirmer le mot de passe</label>
                        <input
                            id="confirm"
                            name="confirm"
                            type="password"
                            autoComplete="new-password"
                            minLength={6}
                            required
                            className="border bg-background p-3 rounded-lg"
                        />
                    </div>
                )}

                {error && <p role="alert" className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={pending}
                    className="w-full min-h-11 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-60"
                >
                    {pending ? 'Patientez…' : isRegister ? 'Créer mon compte' : 'Se connecter'}
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
                        <Suspense fallback={null}>
                            <LoginForm />
                        </Suspense>
                    </div>
                </div>
            </div>
            <div className="relative hidden lg:flex flex-col items-center justify-center gap-6 bg-primary/10 p-16 text-center">
                <p className="font-kufi text-7xl text-primary" dir="rtl" lang="ar">اقْرَأْ</p>
                <p className="max-w-sm text-muted-foreground leading-relaxed">
                    Lisez le Coran en 40 jours, avec le tafsir d&apos;Ibn Kathir, l&apos;audio verset par verset et la phonétique.
                </p>
            </div>
        </div>
    )
}
