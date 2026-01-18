import { useState } from "react";
import { Search, Filter, Download, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const lancamentos = [
  {
    id: "LAN-001",
    unidade: "Unidade Central",
    categoria: "Alimentação",
    fornecedor: "Distribuidora ABC",
    cnpj: "12.345.678/0001-90",
    valor: 2450.0,
    data: "2026-01-18",
    status: "approved",
  },
  {
    id: "LAN-002",
    unidade: "Casa de Acolhimento",
    categoria: "Material de Limpeza",
    fornecedor: "Limpa Mais Ltda",
    cnpj: "23.456.789/0001-01",
    valor: 890.0,
    data: "2026-01-17",
    status: "pending",
  },
  {
    id: "LAN-003",
    unidade: "Centro Educacional",
    categoria: "Material Didático",
    fornecedor: "Papelaria Escolar",
    cnpj: "34.567.890/0001-12",
    valor: 1200.0,
    data: "2026-01-17",
    status: "approved",
  },
  {
    id: "LAN-004",
    unidade: "Sede Administrativa",
    categoria: "Serviços",
    fornecedor: "TechService",
    cnpj: "45.678.901/0001-23",
    valor: 3500.0,
    data: "2026-01-16",
    status: "rejected",
  },
  {
    id: "LAN-005",
    unidade: "Unidade Oeste",
    categoria: "Manutenção",
    fornecedor: "Manutenções Express",
    cnpj: "56.789.012/0001-34",
    valor: 1850.0,
    data: "2026-01-16",
    status: "pending",
  },
  {
    id: "LAN-006",
    unidade: "Unidade Norte",
    categoria: "Alimentação",
    fornecedor: "Atacadão do Norte",
    cnpj: "67.890.123/0001-45",
    valor: 4200.0,
    data: "2026-01-15",
    status: "approved",
  },
  {
    id: "LAN-007",
    unidade: "Centro Educacional",
    categoria: "Serviços",
    fornecedor: "Gráfica Rápida",
    cnpj: "78.901.234/0001-56",
    valor: 650.0,
    data: "2026-01-15",
    status: "approved",
  },
  {
    id: "LAN-008",
    unidade: "Casa de Acolhimento",
    categoria: "Manutenção",
    fornecedor: "Elétrica e Cia",
    cnpj: "89.012.345/0001-67",
    valor: 2100.0,
    data: "2026-01-14",
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

export default function Lancamentos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [unidadeFilter, setUnidadeFilter] = useState("all");

  const filteredLancamentos = lancamentos.filter((lancamento) => {
    const matchesSearch =
      lancamento.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lancamento.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lancamento.cnpj.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || lancamento.status === statusFilter;

    const matchesUnidade =
      unidadeFilter === "all" || lancamento.unidade === unidadeFilter;

    return matchesSearch && matchesStatus && matchesUnidade;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Lançamentos</h1>
          <p className="page-subtitle">
            Gerencie e acompanhe todas as prestações de contas
          </p>
        </div>
        <Button asChild>
          <a href="/novo-lancamento">Novo Lançamento</a>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por fornecedor, ID ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="rejected">Glosados</SelectItem>
                </SelectContent>
              </Select>
              <Select value={unidadeFilter} onValueChange={setUnidadeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Unidades</SelectItem>
                  <SelectItem value="Unidade Central">Unidade Central</SelectItem>
                  <SelectItem value="Casa de Acolhimento">
                    Casa de Acolhimento
                  </SelectItem>
                  <SelectItem value="Centro Educacional">
                    Centro Educacional
                  </SelectItem>
                  <SelectItem value="Sede Administrativa">
                    Sede Administrativa
                  </SelectItem>
                  <SelectItem value="Unidade Oeste">Unidade Oeste</SelectItem>
                  <SelectItem value="Unidade Norte">Unidade Norte</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="data-table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLancamentos.map((lancamento) => (
              <TableRow key={lancamento.id}>
                <TableCell className="font-mono text-sm">
                  {lancamento.id}
                </TableCell>
                <TableCell className="font-medium">
                  {lancamento.unidade}
                </TableCell>
                <TableCell>{lancamento.categoria}</TableCell>
                <TableCell>{lancamento.fornecedor}</TableCell>
                <TableCell className="font-mono text-sm">
                  {lancamento.cnpj}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(lancamento.valor)}
                </TableCell>
                <TableCell>{formatDate(lancamento.data)}</TableCell>
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
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Baixar documentos
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredLancamentos.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Nenhum lançamento encontrado com os filtros aplicados.
          </div>
        )}
      </div>

      {/* Pagination Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Mostrando {filteredLancamentos.length} de {lancamentos.length}{" "}
          lançamentos
        </p>
      </div>
    </div>
  );
}
