import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logoAssociacao from "@/assets/logo-associacao-transparent.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email && password) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Sistema Fraternidade Transparente.",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Erro no login",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <img 
              src={logoAssociacao} 
              alt="Logo Associação Lar São Francisco de Assis" 
              className="h-32 w-32 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-4">
            Sistema Fraternidade Transparente
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            Gestão financeira com clareza e lisura para a Associação Lar São
            Francisco de Assis
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-primary-foreground/60">
            <div>
              <p className="text-3xl font-bold text-primary-foreground">12</p>
              <p className="text-sm">Unidades</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">248</p>
              <p className="text-sm">Lançamentos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">99%</p>
              <p className="text-sm">Aprovações</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <img 
                src={logoAssociacao} 
                alt="Logo Associação Lar São Francisco de Assis" 
                className="h-20 w-20 object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              Fraternidade Transparente
            </h1>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Bem-vindo de volta
              </h2>
              <p className="text-muted-foreground">
                Entre com suas credenciais para acessar o sistema
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="rounded border-border"
                  />
                  <span className="text-muted-foreground">Lembrar-me</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-primary hover:underline"
                >
                  Esqueceu a senha?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Precisa de ajuda?{" "}
              <a href="#" className="text-primary hover:underline">
                Contate o suporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
