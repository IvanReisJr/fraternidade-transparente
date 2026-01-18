import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, PlusCircle, ClipboardCheck, Settings, LogOut, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
const navigation = [{
  name: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard
}, {
  name: "Lançamentos",
  href: "/lancamentos",
  icon: FileText
}, {
  name: "Novo Lançamento",
  href: "/novo-lancamento",
  icon: PlusCircle
}, {
  name: "Auditoria",
  href: "/auditoria",
  icon: ClipboardCheck
}, {
  name: "Configurações",
  href: "/configuracoes",
  icon: Settings
}];
export function AppSidebar() {
  const location = useLocation();
  return <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-accent">
            <Building2 className="h-5 w-5 text-sidebar-accent-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sidebar-foreground text-xl">Fraternidade Transparente</span>
            <span className="text-sidebar-foreground/60 text-lg">ALSF</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map(item => {
          const isActive = location.pathname === item.href;
          return <NavLink key={item.name} to={item.href} className={cn("nav-item", isActive && "active")}>
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>;
        })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-accent-foreground">
              AD
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">
                Administrador
              </p>
              <p className="text-xs text-sidebar-foreground/60">
                admin@larsaofrancisco.org
              </p>
            </div>
          </div>
          <NavLink to="/" className="nav-item mt-2 text-sidebar-foreground/60 hover:text-sidebar-foreground">
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </NavLink>
        </div>
      </div>
    </aside>;
}