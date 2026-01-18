import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Download,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const pendingItems = [
  {
    id: "LAN-002",
    unidade: "Casa de Acolhimento",
    categoria: "Material de Limpeza",
    fornecedor: "Limpa Mais Ltda",
    cnpj: "23.456.789/0001-01",
    valor: 890.0,
    data: "2026-01-17",
    descricao: "Compra mensal de materiais de limpeza para a unidade.",
  },
  {
    id: "LAN-005",
    unidade: "Unidade Oeste",
    categoria: "Manutenção",
    fornecedor: "Manutenções Express",
    cnpj: "56.789.012/0001-34",
    valor: 1850.0,
    data: "2026-01-16",
    descricao: "Reparo emergencial no sistema elétrico.",
  },
  {
    id: "LAN-008",
    unidade: "Casa de Acolhimento",
    categoria: "Manutenção",
    fornecedor: "Elétrica e Cia",
    cnpj: "89.012.345/0001-67",
    valor: 2100.0,
    data: "2026-01-14",
    descricao: "Instalação de novo quadro de distribuição.",
  },
];

export default function Auditoria() {
  const { toast } = useToast();
  const [items, setItems] = useState(pendingItems);
  const [selectedItem, setSelectedItem] = useState<typeof pendingItems[0] | null>(
    null
  );
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleApprove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast({
      title: "Lançamento aprovado!",
      description: `O lançamento ${id} foi aprovado com sucesso.`,
    });
  };

  const handleReject = () => {
    if (selectedItem && rejectReason.trim()) {
      setItems(items.filter((item) => item.id !== selectedItem.id));
      toast({
        title: "Lançamento glosado",
        description: `O lançamento ${selectedItem.id} foi glosado.`,
        variant: "destructive",
      });
      setShowRejectDialog(false);
      setSelectedItem(null);
      setRejectReason("");
    }
  };

  const openRejectDialog = (item: typeof pendingItems[0]) => {
    setSelectedItem(item);
    setShowRejectDialog(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Auditoria</h1>
        <p className="page-subtitle">
          Revise e aprove ou glose os lançamentos pendentes
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <AlertCircle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{items.length}</p>
              <p className="text-sm text-muted-foreground">
                Pendentes de revisão
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">Aprovados este mês</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">Glosados este mês</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Items */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="mb-4 h-12 w-12 text-success" />
              <p className="text-lg font-medium text-foreground">
                Nenhum lançamento pendente
              </p>
              <p className="text-sm text-muted-foreground">
                Todos os lançamentos foram revisados.
              </p>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="font-mono text-primary">{item.id}</span>
                      <span className="text-muted-foreground">•</span>
                      <span>{item.unidade}</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {item.categoria} • {formatDate(item.data)}
                    </CardDescription>
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(item.valor)}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fornecedor
                    </p>
                    <p className="font-medium">{item.fornecedor}</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {item.cnpj}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Descrição
                    </p>
                    <p className="text-sm">{item.descricao}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Nota Fiscal
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Ver Comprovante
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => openRejectDialog(item)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Glosar
                    </Button>
                    <Button
                      size="sm"
                      className="bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() => handleApprove(item.id)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Aprovar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Glosar Lançamento</DialogTitle>
            <DialogDescription>
              Informe o motivo da glosa para o lançamento {selectedItem?.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Motivo da Glosa *</label>
              <Textarea
                placeholder="Descreva o motivo da glosa..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Confirmar Glosa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
