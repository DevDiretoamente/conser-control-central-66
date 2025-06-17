
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, Download, Search, Filter } from 'lucide-react';
import { AuditLog, auditService } from '@/services/auditService';

const AuditHistory: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, entityTypeFilter, actionFilter]);

  const loadLogs = async () => {
    const allLogs = await auditService.getLogs();
    setLogs(allLogs);
  };

  const filterLogs = () => {
    let filtered = [...logs];

    if (searchTerm) {
      filtered = filtered.filter(log =>
        (log.entityName || log.entityTitle).toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (entityTypeFilter !== 'all') {
      filtered = filtered.filter(log => log.entityType === entityTypeFilter);
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    setFilteredLogs(filtered);
  };

  const getActionBadgeVariant = (action: AuditLog['action']) => {
    switch (action) {
      case 'create':
        return 'default';
      case 'update':
        return 'secondary';
      case 'delete':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getActionLabel = (action: AuditLog['action']) => {
    switch (action) {
      case 'create':
        return 'Criado';
      case 'update':
        return 'Atualizado';
      case 'delete':
        return 'Excluído';
      case 'view':
        return 'Visualizado';
      case 'download':
        return 'Download';
      default:
        return action;
    }
  };

  const getEntityTypeLabel = (entityType: AuditLog['entityType']) => {
    switch (entityType) {
      case 'invoice':
        return 'Nota Fiscal';
      case 'supplier':
        return 'Fornecedor';
      case 'customer':
        return 'Cliente';
      case 'cost_center':
        return 'Centro de Custo';
      case 'work':
        return 'Obra/Projeto';
      case 'budget':
        return 'Orçamento';
      case 'documento':
        return 'Documento';
      case 'certificacao':
        return 'Certificação';
      case 'renovacao':
        return 'Renovação';
      default:
        return entityType;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatChanges = (changes: Record<string, { from: any; to: any }>) => {
    return Object.entries(changes).map(([field, change]) => (
      <div key={field} className="text-xs bg-muted p-2 rounded">
        <span className="font-medium">{field}:</span>
        {change.from !== null && (
          <span className="text-red-600"> {JSON.stringify(change.from)} →</span>
        )}
        <span className="text-green-600"> {JSON.stringify(change.to)}</span>
      </div>
    ));
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'audit-history.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Histórico de Alterações</h2>
          <p className="text-muted-foreground">
            Acompanhe todas as modificações realizadas no sistema
          </p>
        </div>
        <Button onClick={exportLogs} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Entidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="invoice">Notas Fiscais</SelectItem>
                <SelectItem value="supplier">Fornecedores</SelectItem>
                <SelectItem value="customer">Clientes</SelectItem>
                <SelectItem value="cost_center">Centros de Custo</SelectItem>
                <SelectItem value="work">Obras/Projetos</SelectItem>
                <SelectItem value="budget">Orçamentos</SelectItem>
                <SelectItem value="documento">Documentos RH</SelectItem>
                <SelectItem value="certificacao">Certificações</SelectItem>
                <SelectItem value="renovacao">Renovações</SelectItem>
              </SelectContent>
            </Select>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Ações</SelectItem>
                <SelectItem value="create">Criação</SelectItem>
                <SelectItem value="update">Atualização</SelectItem>
                <SelectItem value="delete">Exclusão</SelectItem>
                <SelectItem value="view">Visualização</SelectItem>
                <SelectItem value="download">Download</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <Card key={log.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{log.entityName || log.entityTitle}</span>
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {getActionLabel(log.action)}
                      </Badge>
                      <Badge variant="outline">
                        {getEntityTypeLabel(log.entityType)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      por {log.userName} em {formatDate(log.timestamp)}
                    </p>
                  </div>
                </div>
              </div>

              {log.changes && Object.keys(log.changes).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Alterações:</h4>
                  <div className="space-y-1">
                    {formatChanges(log.changes)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredLogs.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <History className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum registro encontrado</h3>
              <p className="text-muted-foreground text-center">
                Não há registros de alterações que correspondam aos filtros aplicados
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuditHistory;
