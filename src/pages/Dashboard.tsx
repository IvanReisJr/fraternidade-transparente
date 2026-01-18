import {
  TrendingUp,
  TrendingDown,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const stats = [
  {
    name: "Total de Gastos",
    value: "R$ 128.450,00",
    change: "+12.5%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    name: "Lançamentos",
    value: "248",
    change: "+8",
    trend: "up",
    icon: FileText,
  },
  {
    name: "Pendentes",
    value: "15",
    change: "-3",
    trend: "down",
    icon: Clock,
  },
  {
    name: "Taxa de Aprovação",
    value: "94%",
    change: "+2%",
    trend: "up",
    icon: CheckCircle,
  },
];

const recentLancamentos = [
  {
    id: "001",
    unidade: "Unidade Central",
    categoria: "Alimentação",
    valor: "R$ 2.450,00",
    data: "18/01/2026",
    status: "approved",
  },
  {
    id: "002",
    unidade: "Casa de Acolhimento",
    categoria: "Material de Limpeza",
    valor: "R$ 890,00",
    data: "17/01/2026",
    status: "pending",
  },
  {
    id: "003",
    unidade: "Centro Educacional",
    categoria: "Material Didático",
    valor: "R$ 1.200,00",
    data: "17/01/2026",
    status: "approved",
  },
  {
    id: "004",
    unidade: "Sede Administrativa",
    categoria: "Serviços",
    valor: "R$ 3.500,00",
    data: "16/01/2026",
    status: "rejected",
  },
  {
    id: "005",
    unidade: "Unidade Oeste",
    categoria: "Manutenção",
    valor: "R$ 1.850,00",
    data: "16/01/2026",
    status: "pending",
  },
];

const statusConfig = {
  approved: {
    label: "Aprovado",
    className: "status-badge status-approved",
  },
  pending: {
    label: "Pendente",
    className: "status-badge status-pending",
  },
  rejected: {
    label: "Glosado",
    className: "status-badge status-rejected",
  },
};

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Visão geral das finanças da Associação Lar São Francisco de Assis
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="stat-card">
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  stat.trend === "up"
                    ? "bg-success/10 text-success"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-success" : "text-primary"
                }`}
              >
                {stat.change}
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Lançamentos Recentes</CardTitle>
              <CardDescription>
                Últimos 5 lançamentos registrados no sistema
              </CardDescription>
            </div>
            <a
              href="/lancamentos"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Ver todos
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLancamentos.map((lancamento) => (
                  <TableRow key={lancamento.id}>
                    <TableCell className="font-medium">
                      {lancamento.unidade}
                    </TableCell>
                    <TableCell>{lancamento.categoria}</TableCell>
                    <TableCell>{lancamento.valor}</TableCell>
                    <TableCell>{lancamento.data}</TableCell>
                    <TableCell>
                      <span
                        className={
                          statusConfig[lancamento.status as keyof typeof statusConfig]
                            .className
                        }
                      >
                        {
                          statusConfig[lancamento.status as keyof typeof statusConfig]
                            .label
                        }
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Por Categoria</CardTitle>
            <CardDescription>Distribuição de gastos este mês</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Alimentação", value: 35, amount: "R$ 44.957,50" },
              { name: "Manutenção", value: 25, amount: "R$ 32.112,50" },
              { name: "Material", value: 20, amount: "R$ 25.690,00" },
              { name: "Serviços", value: 12, amount: "R$ 15.414,00" },
              { name: "Outros", value: 8, amount: "R$ 10.276,00" },
            ].map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {category.name}
                  </span>
                  <span className="text-muted-foreground">
                    {category.amount}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${category.value}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20">
            <Clock className="h-5 w-5 text-warning" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">
              15 lançamentos aguardando aprovação
            </p>
            <p className="text-sm text-muted-foreground">
              Verifique a seção de Auditoria para revisar os lançamentos
              pendentes.
            </p>
          </div>
          <a
            href="/auditoria"
            className="rounded-lg bg-warning px-4 py-2 text-sm font-medium text-warning-foreground hover:bg-warning/90 transition-colors"
          >
            Revisar
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
