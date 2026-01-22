import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, FileText, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import api from "../services/api";

interface Unit {
  id: number;
  name: string;
}

interface CostCenter {
  id: number;
  name: string;
}

export default function NovoLancamento() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitsRes, ccRes] = await Promise.all([
          api.get('/units'),
          api.get('/cost-centers')
        ]);
        setUnits(unitsRes.data);
        setCostCenters(ccRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
        toast({ title: "Erro ao carregar opções", variant: "destructive" });
      }
    };
    fetchData();
  }, [toast]);

  const [formData, setFormData] = useState({
    unidade: "",
    categoria: "",
    valor: "",
    data: "",
    cnpj: "",
    fornecedor: "",
    descricao: "",
  });

  const [notaFiscal, setNotaFiscal] = useState<File | null>(null);
  const [comprovante, setComprovante] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData((prev) => ({ ...prev, cnpj: formatted }));
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const amount = parseInt(numbers) / 100;
    if (isNaN(amount)) return "";
    return amount.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setFormData((prev) => ({ ...prev, valor: formatted }));
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "nota" | "comprovante"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é 10MB.",
          variant: "destructive",
        });
        e.target.value = ""; // Limpa o input
        return;
      }

      if (type === "nota") {
        setNotaFiscal(file);
      } else {
        setComprovante(file);
      }
    }
  };

  const removeFile = (type: "nota" | "comprovante") => {
    if (type === "nota") {
      setNotaFiscal(null);
    } else {
      setComprovante(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('unitId', formData.unidade);
      formDataToSend.append('costCenterId', formData.categoria);
      formDataToSend.append('amount', formData.valor.replace(/\./g, '').replace(',', '.'));
      formDataToSend.append('date', new Date(formData.data).toISOString());
      formDataToSend.append('supplierName', formData.fornecedor);
      formDataToSend.append('supplierCnpj', formData.cnpj);
      formDataToSend.append('description', formData.descricao);
      
      if (notaFiscal) formDataToSend.append('invoice', notaFiscal);
      if (comprovante) formDataToSend.append('receipt', comprovante);

      await api.post('/transactions', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast({
        title: "Lançamento enviado com sucesso!",
        description: "O lançamento foi registrado e aguarda aprovação.",
      });

      navigate("/lancamentos");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao enviar lançamento",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Novo Lançamento</h1>
        <p className="page-subtitle">
          Registre uma nova prestação de contas no sistema
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Preencha os dados principais do lançamento
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="unidade">Unidade *</Label>
              <Select
                value={formData.unidade}
                onValueChange={(value) => handleSelectChange("unidade", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={String(unit.id)}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => handleSelectChange("categoria", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {costCenters.map((cc) => (
                    <SelectItem key={cc.id} value={String(cc.id)}>
                      {cc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id="valor"
                  name="valor"
                  value={formData.valor}
                  onChange={handleValorChange}
                  placeholder="0,00"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                name="data"
                type="date"
                value={formData.data}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Supplier Info */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Fornecedor</CardTitle>
            <CardDescription>
              Informações sobre o fornecedor do serviço ou produto
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ do Fornecedor *</Label>
              <Input
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleCNPJChange}
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor">Nome do Fornecedor</Label>
              <Input
                id="fornecedor"
                name="fornecedor"
                value={formData.fornecedor}
                onChange={handleInputChange}
                placeholder="Razão social ou nome fantasia"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Descreva brevemente o motivo da despesa..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* File Uploads */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
            <CardDescription>
              Anexe a nota fiscal e o comprovante de pagamento
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            {/* Nota Fiscal Upload */}
            <div className="space-y-2">
              <Label>Nota Fiscal *</Label>
              {notaFiscal ? (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {notaFiscal.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(notaFiscal.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile("nota")}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 transition-colors hover:border-primary/50 hover:bg-muted/50">
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Clique para enviar
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, JPG ou PNG até 10MB
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, "nota")}
                  />
                </label>
              )}
            </div>

            {/* Comprovante Upload */}
            <div className="space-y-2">
              <Label>Comprovante de Pagamento *</Label>
              {comprovante ? (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {comprovante.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(comprovante.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile("comprovante")}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 transition-colors hover:border-primary/50 hover:bg-muted/50">
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Clique para enviar
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, JPG ou PNG até 10MB
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, "comprovante")}
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/lancamentos")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Lançamento"}
          </Button>
        </div>
      </form>
    </div>
  );
}
