import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logoAssociacao from "@/assets/logo-associacao-transparent.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        if (!email || !password) {
             toast({
                title: "Erro no login",
                description: "Por favor, preencha todos os campos.",
                variant: "destructive"
             });
             setIsLoading(false);
             return;
        }

        const response = await api.post('/login', { email, password });
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo ao Sistema Fraternidade Transparente."
        });
        navigate("/dashboard");
    } catch (error) {
        toast({
            title: "Erro no login",
            description: "Credenciais inválidas ou erro no servidor.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  };

  return <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <img src={logoAssociacao} alt="Logo Associação Lar São Francisco de Assis" className="h-32 w-32 object-contain" />
          </div>
          <h1 className="font-bold text-primary-foreground mb-4 text-6xl">Sistema Fraternidade Transparente</h1>
          <p className="text-primary-foreground/80 text-center text-3xl">



Gestão de Prestação de Contas - Associação Lar São Francisco de Assis







        </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-primary-foreground/60">
            <div>
              <p className="font-bold text-primary-foreground text-4xl">12</p>
              <p className="text-xl">Unidades</p>
            </div>
            <div>
              <p className="font-bold text-primary-foreground text-4xl">248</p>
              <p className="text-xl">Lançamentos</p>
            </div>
            <div>
              <p className="font-bold text-primary-foreground text-4xl">99%</p>
              <p className="text-xl">Aprovações</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <img src={logoAssociacao} alt="Logo Associação Lar São Francisco de Assis" className="h-20 w-20 object-contain" />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              Fraternidade Transparente
            </h1>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-bold tracking-tight text-foreground text-3xl">Seja bem-vindo!</h2>
              <p className="text-muted-foreground text-xl">Entre com suas credenciais para acesso</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} className="h-11" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="h-11 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground text-base">Lembrar-me</span>
                </label>
                <a href="#" className="text-primary hover:underline text-base">
                  Esqueceu a senha?
                </a>
              </div>

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <p className="text-center text-muted-foreground text-lg">
              Precisa de ajuda?{" "}
              <a href="#" className="text-primary hover:underline">
                Contate o suporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>;
}
