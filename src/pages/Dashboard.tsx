import { useState, useEffect } from "react";
import {
  TrendingUp,
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
import api from "../services/api";

const statusConfig = {
  APPROVED: {
    label: "Aprovado",
    className: "status-badge status-approved",
  },
  PENDING: {
    label: "Pendente",
    className: "status-badge status-pending",
  },
  REJECTED: {
    label: "Glosado",
    className: "status-badge status-rejected",
  },
};

interface Transaction {
  id: number;
  unit: { name: string };
  costCenter: { name: string };
  supplierName: string;
  amount: string;
  date: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/transactions");
        setTransactions(response.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Cálculos Estatísticos
  const totalGastos = transactions.reduce((acc, curr) => {
    const val = typeof curr.amount === 'string' ? parseFloat(curr.amount) : Number(curr.amount);
    return acc + val;
  }, 0);

  const totalCount = transactions.length;
  const pendingCount = transactions.filter(t => t.status === 'PENDING').length;
  const approvedCount = transactions.filter(t => t.status === 'APPROVED').length;
  const rejectedCount = transactions.filter(t => t.status === 'REJECTED').length;

  // Cálculo por Categoria (Dinâmico)
  const expensesByCategory = transactions.reduce((acc, curr) => {
    const category = curr.costCenter?.name || 'Outros';
    const amount = typeof curr.amount === 'string' ? parseFloat(curr.amount) : Number(curr.amount);
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryStats = Object.entries(expensesByCategory)
    .map(([name, value]) => ({
      name,
      value: totalGastos > 0 ? (value / totalGastos) * 100 : 0,
      amount: value
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5); // Top 5

  // Formatação
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR");

  // Dados para a Tabela (Top 5 Recentes)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Configuração dos Cards
  const stats = [
    {
      name: "Total de Gastos",
      value: formatCurrency(totalGastos),
      icon: TrendingUp,
      colorClass: "bg-primary/10 text-primary",
      // trend: "+2.5%", // Deixar guardado para futuro uso (comparativo mensal)
      // trendUp: true,
    },
    {
      name: "Lançamentos",
      value: totalCount.toString(),
      icon: FileText,
      colorClass: "bg-primary/10 text-primary",
      // trend: "+4", // Deixar guardado para futuro uso
      // trendUp: true,
    },
    {
      name: "Pendentes",
      value: pendingCount.toString(),
      icon: Clock,
      colorClass: "bg-warning/10 text-warning",
      // trend: "-1", // Deixar guardado para futuro uso
      // trendUp: false,
    },
    {
      name: "Aprovados",
      value: approvedCount.toString(),
      icon: CheckCircle,
      colorClass: "bg-success/10 text-success",
      // trend: "+1.2%", // Deixar guardado para futuro uso
      // trendUp: true,
    },
    {
      name: "Glosados",
      value: rejectedCount.toString(),
      icon: XCircle,
      colorClass: "bg-destructive/10 text-destructive",
    },
  ];

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.name} className="stat-card">
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.colorClass}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">
                {loading ? "..." : stat.value}
              </p>
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
                {recentTransactions.map((lancamento) => (
                  <TableRow key={lancamento.id}>
                    <TableCell className="font-medium">
                      {lancamento.unit?.name || "N/A"}
                    </TableCell>
                    <TableCell>{lancamento.costCenter?.name || "N/A"}</TableCell>
                    <TableCell>
                      {formatCurrency(typeof lancamento.amount === 'string' ? parseFloat(lancamento.amount) : lancamento.amount)}
                    </TableCell>
                    <TableCell>{formatDate(lancamento.date)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          statusConfig[lancamento.status]?.className || ""
                        }
                      >
                        {
                          statusConfig[lancamento.status]?.label || lancamento.status
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
            {categoryStats.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {category.name}
                  </span>
                  <span className="text-muted-foreground">
                    {formatCurrency(category.amount)}
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
      {pendingCount > 0 && <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20">
            <Clock className="h-5 w-5 text-warning" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">
              {pendingCount} lançamentos aguardando aprovação
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
      </Card>}
    </div>
  );
}
