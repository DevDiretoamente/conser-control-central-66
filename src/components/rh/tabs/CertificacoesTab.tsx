
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Certificacao, CertificacaoFilter } from '@/types/documentosRH';
import CertificacaoFilters from '../filters/CertificacaoFilters';
import CertificacaoCard from '../cards/CertificacaoCard';

interface CertificacoesTabProps {
  certificacoes: Certificacao[];
  filteredCertificacoes: Certificacao[];
  certificacaoFilter: CertificacaoFilter;
  setCertificacaoFilter: (filter: CertificacaoFilter) => void;
  onNewCertification: () => void;
  onEditCertification: (certificacao: Certificacao) => void;
}

const CertificacoesTab: React.FC<CertificacoesTabProps> = ({
  certificacoes,
  filteredCertificacoes,
  certificacaoFilter,
  setCertificacaoFilter,
  onNewCertification,
  onEditCertification
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Certificações</CardTitle>
          <Button onClick={onNewCertification}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Certificação
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CertificacaoFilters 
          filter={certificacaoFilter}
          onFilterChange={setCertificacaoFilter}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCertificacoes.map((certificacao) => (
            <CertificacaoCard
              key={certificacao.id}
              certificacao={certificacao}
              onEdit={onEditCertification}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificacoesTab;
