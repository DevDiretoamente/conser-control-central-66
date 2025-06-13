
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Building, 
  PlusCircle, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Obra, ObrasFilter, ObrasDashboardData } from '@/types/obras';
import { obrasService } from '@/services/obrasService';
import ObrasDashboard from '@/components/obras/ObrasDashboard';

const Obras: React.FC = () => {
  const [obras, setObras] = useState<Obra[]>([]);
  const [filteredObras, setFilteredObras] = useState<Obra[]>([]);
  const [dashboardData, setDashboardData] = useState<ObrasDashboardData | null>(null);
  const [filter, setFilter] = useState<ObrasFilter>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [obras, filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [obrasData, dashboard] = await Promise.all([
        obrasService.getAll(),
        obrasService.getDashboardData()
      ]);
      setObras(obrasData);
      setDashboardData(dashboard);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados das obras');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const filtered = await obrasService.search(filter);
      setFilteredObras(filtered);
    } catch (error) {
      console.error('Erro ao filtrar obras:', error);
    }
  };

  const getStatusBadge = (status: Obra['status']) => {
    const statusMap = {
      planejamento: { label: 'Planejamento', className: 'bg-blue-500' },
      aprovacao: { label: 'Aprovação', className: 'bg-yellow-500' },
      execucao: { label: 'Execução', className: 'bg-green-500' },
      pausada: { label: 'Pausada', className: 'bg-orange-500' },
      concluida: { label: 'Concluída', className: 'bg-gray-500' },
      cancelada: { label: 'Cancelada', className: 'bg-red-500' }
    };
    const config = statusMap[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPrioridadeBadge = (prioridade: Obra['prioridade']) => {
    const prioridadeMap = {
      baixa: { label: 'Baixa', className: 'bg-gray-400' },
      media: { label: 'Média', className: 'bg-blue-400' },
      alta: { label: 'Alta', className: 'bg-orange-400' },
      urgente: { label: 'Urgente', className: 'bg-red-500' }
    };
    const config = prioridadeMap[prioridade];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const getTipoName = (tipo: Obra['tipo']) => {
    const tipoMap = {
      pavimentacao: 'Pavimentação',
      construcao: 'Construção',
      reforma: 'Reforma',
      manutencao: 'Manutenção',
      infraestrutura: 'Infraestrutura',
      outros: 'Outros'
    };
    return tipoMap[tipo];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Building className="h-10 w-10 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando obras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Obras</h1>
          <p className="text-muted-foreground">
            Gerencie projetos, cronogramas e recursos
          </p>
        </div>
        <Button onClick={() => toast.info("Formulário de nova obra será implementado")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Obra
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">
            <TrendingUp className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="obras">
            <Building className="mr-2 h-4 w-4" />
            Obras
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          {dashboardData && <ObrasDashboard data={dashboardData} />}
        </TabsContent>

        <TabsContent value="obras">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Obras</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar obras..."
                    value={filter.search || ''}
                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                    className="pl-9"
                  />
                </div>

                <Select
                  value={filter.tipo || 'all'}
                  onValueChange={(value) => setFilter({ ...filter, tipo: value === 'all' ? undefined : value as Obra['tipo'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de obra" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="pavimentacao">Pavimentação</SelectItem>
                    <SelectItem value="construcao">Construção</SelectItem>
                    <SelectItem value="reforma">Reforma</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                    <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filter.status || 'all'}
                  onValueChange={(value) => setFilter({ ...filter, status: value === 'all' ? undefined : value as Obra['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="planejamento">Planejamento</SelectItem>
                    <SelectItem value="aprovacao">Aprovação</SelectItem>
                    <SelectItem value="execucao">Execução</SelectItem>
                    <SelectItem value="pausada">Pausada</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filter.prioridade || 'all'}
                  onValueChange={(value) => setFilter({ ...filter, prioridade: value === 'all' ? undefined : value as Obra['prioridade'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as prioridades</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lista de Obras */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredObras.map((obra) => (
                  <Card key={obra.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-base">{obra.nome}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {getTipoName(obra.tipo)} • {obra.clienteNome}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(obra.status)}
                          {getPrioridadeBadge(obra.prioridade)}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <p className="text-sm line-clamp-2">{obra.descricao}</p>
                      
                      {/* Progresso */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Progresso</span>
                          <span className="text-sm font-medium">{obra.progressoPercentual}%</span>
                        </div>
                        <Progress value={obra.progressoPercentual} className="h-2" />
                      </div>

                      {/* Informações básicas */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate">{obra.endereco.cidade}/{obra.endereco.uf}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate">
                            {obra.valorContrato.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                              minimumFractionDigits: 0
                            })}
                          </span>
                        </div>
                        {obra.dataFimPrevista && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">
                              {new Date(obra.dataFimPrevista).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate">{obra.funcionariosAlocados.length} pessoas</span>
                        </div>
                      </div>

                      {/* Alertas */}
                      {obra.dataFimPrevista && new Date(obra.dataFimPrevista) < new Date() && obra.status !== 'concluida' && (
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-800">Obra atrasada</span>
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="text-xs text-muted-foreground">
                          {obra.etapas.length} etapa(s)
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredObras.length === 0 && (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {obras.length === 0 ? 'Nenhuma obra cadastrada' : 'Nenhuma obra encontrada com os filtros selecionados'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Obras;
