import { useState } from "react";
import { Plus, Pencil, Trash2, Building, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const initialUnidades = [
  { id: 1, nome: "Unidade Central", endereco: "Rua Principal, 100", responsavel: "Maria Silva" },
  { id: 2, nome: "Casa de Acolhimento", endereco: "Av. das Flores, 250", responsavel: "João Santos" },
  { id: 3, nome: "Centro Educacional", endereco: "Rua da Educação, 50", responsavel: "Ana Costa" },
  { id: 4, nome: "Sede Administrativa", endereco: "Rua Comercial, 500", responsavel: "Carlos Lima" },
  { id: 5, nome: "Unidade Oeste", endereco: "Av. Oeste, 300", responsavel: "Paula Oliveira" },
  { id: 6, nome: "Unidade Norte", endereco: "Rua Norte, 150", responsavel: "Roberto Alves" },
];

const initialCentrosCusto = [
  { id: 1, codigo: "CC-001", nome: "Alimentação", descricao: "Despesas com alimentação" },
  { id: 2, codigo: "CC-002", nome: "Material de Limpeza", descricao: "Produtos de higiene e limpeza" },
  { id: 3, codigo: "CC-003", nome: "Material Didático", descricao: "Material escolar e educacional" },
  { id: 4, codigo: "CC-004", nome: "Manutenção", descricao: "Reparos e manutenção predial" },
  { id: 5, codigo: "CC-005", nome: "Serviços", descricao: "Serviços terceirizados" },
  { id: 6, codigo: "CC-006", nome: "Equipamentos", descricao: "Aquisição de equipamentos" },
  { id: 7, codigo: "CC-007", nome: "Transporte", descricao: "Despesas com transporte" },
];

export default function Configuracoes() {
  const { toast } = useToast();
  const [unidades, setUnidades] = useState(initialUnidades);
  const [centrosCusto, setCentrosCusto] = useState(initialCentrosCusto);
  
  const [showUnidadeDialog, setShowUnidadeDialog] = useState(false);
  const [showCentroCustoDialog, setShowCentroCustoDialog] = useState(false);
  
  const [editingUnidade, setEditingUnidade] = useState<typeof initialUnidades[0] | null>(null);
  const [editingCentroCusto, setEditingCentroCusto] = useState<typeof initialCentrosCusto[0] | null>(null);
  
  const [unidadeForm, setUnidadeForm] = useState({ nome: "", endereco: "", responsavel: "" });
  const [centroCustoForm, setCentroCustoForm] = useState({ codigo: "", nome: "", descricao: "" });

  // Unidade handlers
  const openUnidadeDialog = (unidade?: typeof initialUnidades[0]) => {
    if (unidade) {
      setEditingUnidade(unidade);
      setUnidadeForm({ nome: unidade.nome, endereco: unidade.endereco, responsavel: unidade.responsavel });
    } else {
      setEditingUnidade(null);
      setUnidadeForm({ nome: "", endereco: "", responsavel: "" });
    }
    setShowUnidadeDialog(true);
  };

  const saveUnidade = () => {
    if (editingUnidade) {
      setUnidades(unidades.map(u => u.id === editingUnidade.id ? { ...u, ...unidadeForm } : u));
      toast({ title: "Unidade atualizada com sucesso!" });
    } else {
      setUnidades([...unidades, { id: Date.now(), ...unidadeForm }]);
      toast({ title: "Unidade cadastrada com sucesso!" });
    }
    setShowUnidadeDialog(false);
  };

  const deleteUnidade = (id: number) => {
    setUnidades(unidades.filter(u => u.id !== id));
    toast({ title: "Unidade removida com sucesso!" });
  };

  // Centro de Custo handlers
  const openCentroCustoDialog = (centro?: typeof initialCentrosCusto[0]) => {
    if (centro) {
      setEditingCentroCusto(centro);
      setCentroCustoForm({ codigo: centro.codigo, nome: centro.nome, descricao: centro.descricao });
    } else {
      setEditingCentroCusto(null);
      setCentroCustoForm({ codigo: "", nome: "", descricao: "" });
    }
    setShowCentroCustoDialog(true);
  };

  const saveCentroCusto = () => {
    if (editingCentroCusto) {
      setCentrosCusto(centrosCusto.map(c => c.id === editingCentroCusto.id ? { ...c, ...centroCustoForm } : c));
      toast({ title: "Centro de Custo atualizado com sucesso!" });
    } else {
      setCentrosCusto([...centrosCusto, { id: Date.now(), ...centroCustoForm }]);
      toast({ title: "Centro de Custo cadastrado com sucesso!" });
    }
    setShowCentroCustoDialog(false);
  };

  const deleteCentroCusto = (id: number) => {
    setCentrosCusto(centrosCusto.filter(c => c.id !== id));
    toast({ title: "Centro de Custo removido com sucesso!" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Configurações</h1>
        <p className="page-subtitle">
          Gerencie as unidades e centros de custo do sistema
        </p>
      </div>

      <Tabs defaultValue="unidades" className="space-y-6">
        <TabsList>
          <TabsTrigger value="unidades" className="gap-2">
            <Building className="h-4 w-4" />
            Unidades
          </TabsTrigger>
          <TabsTrigger value="centros-custo" className="gap-2">
            <Tag className="h-4 w-4" />
            Centros de Custo
          </TabsTrigger>
        </TabsList>

        {/* Unidades Tab */}
        <TabsContent value="unidades">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Unidades</CardTitle>
                <CardDescription>
                  Gerencie as unidades da associação
                </CardDescription>
              </div>
              <Button onClick={() => openUnidadeDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Unidade
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unidades.map((unidade) => (
                    <TableRow key={unidade.id}>
                      <TableCell className="font-medium">{unidade.nome}</TableCell>
                      <TableCell>{unidade.endereco}</TableCell>
                      <TableCell>{unidade.responsavel}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openUnidadeDialog(unidade)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => deleteUnidade(unidade.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Centros de Custo Tab */}
        <TabsContent value="centros-custo">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Centros de Custo</CardTitle>
                <CardDescription>
                  Gerencie as categorias de despesas
                </CardDescription>
              </div>
              <Button onClick={() => openCentroCustoDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Centro de Custo
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {centrosCusto.map((centro) => (
                    <TableRow key={centro.id}>
                      <TableCell className="font-mono text-sm">{centro.codigo}</TableCell>
                      <TableCell className="font-medium">{centro.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{centro.descricao}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openCentroCustoDialog(centro)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => deleteCentroCusto(centro.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Unidade Dialog */}
      <Dialog open={showUnidadeDialog} onOpenChange={setShowUnidadeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUnidade ? "Editar Unidade" : "Nova Unidade"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da unidade
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input
                value={unidadeForm.nome}
                onChange={(e) => setUnidadeForm({ ...unidadeForm, nome: e.target.value })}
                placeholder="Nome da unidade"
              />
            </div>
            <div className="space-y-2">
              <Label>Endereço</Label>
              <Input
                value={unidadeForm.endereco}
                onChange={(e) => setUnidadeForm({ ...unidadeForm, endereco: e.target.value })}
                placeholder="Endereço completo"
              />
            </div>
            <div className="space-y-2">
              <Label>Responsável</Label>
              <Input
                value={unidadeForm.responsavel}
                onChange={(e) => setUnidadeForm({ ...unidadeForm, responsavel: e.target.value })}
                placeholder="Nome do responsável"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnidadeDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={saveUnidade} disabled={!unidadeForm.nome}>
              {editingUnidade ? "Salvar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Centro de Custo Dialog */}
      <Dialog open={showCentroCustoDialog} onOpenChange={setShowCentroCustoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCentroCusto ? "Editar Centro de Custo" : "Novo Centro de Custo"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do centro de custo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Código *</Label>
              <Input
                value={centroCustoForm.codigo}
                onChange={(e) => setCentroCustoForm({ ...centroCustoForm, codigo: e.target.value })}
                placeholder="Ex: CC-008"
              />
            </div>
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input
                value={centroCustoForm.nome}
                onChange={(e) => setCentroCustoForm({ ...centroCustoForm, nome: e.target.value })}
                placeholder="Nome da categoria"
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                value={centroCustoForm.descricao}
                onChange={(e) => setCentroCustoForm({ ...centroCustoForm, descricao: e.target.value })}
                placeholder="Breve descrição"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCentroCustoDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={saveCentroCusto} disabled={!centroCustoForm.codigo || !centroCustoForm.nome}>
              {editingCentroCusto ? "Salvar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
