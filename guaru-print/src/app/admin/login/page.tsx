import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { isAdminConfigured } from "@/lib/admin/session";

export default function LoginPage() {
  const configured = isAdminConfigured();
  return (
    <div className="grid min-h-dvh place-items-center p-6">
      <div className="card w-full max-w-sm p-8">
        <Logo className="text-xl" />
        <h1 className="mt-6 font-display text-2xl">Painel administrativo</h1>
        {configured ? (
          <LoginForm />
        ) : (
          <p className="mt-4 text-sm text-white/70">
            O painel está bloqueado. Defina <code className="text-yellow">ADMIN_PASSWORD</code> (12+ caracteres) e <code className="text-yellow">ADMIN_SESSION_SECRET</code> (32+ caracteres) nas variáveis de ambiente.
          </p>
        )}
      </div>
    </div>
  );
}
