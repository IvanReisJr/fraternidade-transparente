import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import api from "../services/api";

interface Transaction {
  id: number;
  unit: { name: string };
  costCenter: { name: string };
  supplierName: string;
  supplierCnpj: string;
  amount: string; // Decimal comes as string from JSON usually
  date: string;
  description: string;
}

export default function Auditoria() {
  const { toast } = useToast();
  const [items, setItems] = useState<Transaction[]>([]);
  const [selectedItem, setSelectedItem] = useState<Transaction | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const fetchPending = async () => {
    try {
        const response = await api.get('/transactions?status=PENDING');
        setItems(response.data);
    } catch (error) {
        console.error(error);
        toast({ title: "Erro ao buscar pendências", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleApprove = async (id: number) => {
    try {
        await api.put(`/transactions/${id}/status`, { status: 'APPROVED' });
        setItems(items.filter((item) => item.id !== id));
        toast({
            title: "Lançamento aprovado!",
            description: `O lançamento #${id} foi aprovado com sucesso.`,
        });
    } catch (error) {
        toast({ title: "Erro ao aprovar", variant: "destructive" });
    }
  };

  const handleReject = async () => {
    if (selectedItem && rejectReason.trim()) {
      try {
          await api.put(`/transactions/${selectedItem.id}/status`, { 
              status: 'REJECTED',
              reason: rejectReason
          });
          
          setItems(items.filter((item) => item.id !== selectedItem.id));
          toast({
            title: "Lançamento glosado",
            description: `O lançamento #${selectedItem.id} foi glosado.`,
            variant: "destructive",
          });
          setShowRejectDialog(false);
          setSelectedItem(null);
          setRejectReason("");
      } catch (error) {
          toast({ title: "Erro ao glosar", variant: "destructive" });
      }
    }
  };

  const openRejectDialog = (item: Transaction) => {
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
              <p className="text-2xl font-bold">-</p>
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
              <p className="text-2xl font-bold">-</p>
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
                      <span className="font-mono text-primary">#{item.id}</span>
                      <span className="text-muted-foreground">•</span>
                      <span>{item.unit?.name}</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {item.costCenter?.name} • {formatDate(item.date)}
                    </CardDescription>
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fornecedor
                    </p>
                    <p className="font-medium">{item.supplierName}</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {item.supplierCnpj}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Descrição
                    </p>
                    <p className="text-sm">{item.description}</p>
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
              Informe o motivo da glosa para o lançamento #{selectedItem?.id}.
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
