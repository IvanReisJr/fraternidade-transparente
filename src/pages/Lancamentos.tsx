import { useState, useEffect } from "react";
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
import * as XLSX from "xlsx";
import api from "../services/api";

interface Transaction {
  id: number;
  unit: { name: string };
  costCenter: { name: string };
  supplierName: string;
  supplierCnpj: string;
  amount: string;
  date: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  invoiceUrl: string | null;
  receiptUrl: string | null;
}

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

export default function Lancamentos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [unidadeFilter, setUnidadeFilter] = useState("all");
  const [lancamentos, setLancamentos] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
        try {
            const response = await api.get('/transactions');
            setLancamentos(response.data);
        } catch (error) {
            console.error("Erro ao buscar lançamentos", error);
        }
    };
    fetchTransactions();
  }, []);

  const filteredLancamentos = lancamentos.filter((lancamento) => {
    const matchesSearch =
      lancamento.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(lancamento.id).includes(searchTerm) ||
      (lancamento.supplierCnpj && lancamento.supplierCnpj.includes(searchTerm));

    const matchesStatus =
      statusFilter === "all" || lancamento.status === statusFilter;

    const matchesUnidade =
      unidadeFilter === "all" || (lancamento.unit && lancamento.unit.name === unidadeFilter);

    return matchesSearch && matchesStatus && matchesUnidade;
  });

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleExportExcel = () => {
    const dataToExport = filteredLancamentos.map((item) => ({
      ID: item.id,
      Unidade: item.unit?.name || "N/A",
      Categoria: item.costCenter?.name || "N/A",
      Fornecedor: item.supplierName,
      CNPJ: item.supplierCnpj,
      Valor: typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount,
      Data: formatDate(item.date),
      Status: statusConfig[item.status]?.label || item.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lançamentos");
    XLSX.writeFile(workbook, "lancamentos_fraternidade.xlsx");
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
                  <SelectItem value="APPROVED">Aprovados</SelectItem>
                  <SelectItem value="PENDING">Pendentes</SelectItem>
                  <SelectItem value="REJECTED">Glosados</SelectItem>
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
              <Button variant="outline" size="icon" onClick={handleExportExcel} title="Exportar para Excel">
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
                  {lancamento.unit?.name || 'N/A'}
                </TableCell>
                <TableCell>{lancamento.costCenter?.name || 'N/A'}</TableCell>
                <TableCell>{lancamento.supplierName}</TableCell>
                <TableCell className="font-mono text-sm">
                  {lancamento.supplierCnpj}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(lancamento.amount)}
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
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => lancamento.invoiceUrl && window.open(lancamento.invoiceUrl, '_blank')} disabled={!lancamento.invoiceUrl}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Nota Fiscal
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => lancamento.receiptUrl && window.open(lancamento.receiptUrl, '_blank')} disabled={!lancamento.receiptUrl}>
                        <Download className="mr-2 h-4 w-4" />
                        Ver Comprovante
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
