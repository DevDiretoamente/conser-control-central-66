
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Supplier } from '@/types/financeiro';
import { formatDocument } from '@/utils/validators';
import { Globe, User, Phone, PhoneCall, Mail } from 'lucide-react';

interface SupplierDetailsProps {
  supplier: Supplier;
  onEdit: () => void;
  onClose: () => void;
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({ supplier, onEdit, onClose }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">{supplier.name}</CardTitle>
            <CardDescription>
              <Badge className="mt-1" variant={supplier.type === 'physical' ? 'outline' : 'default'}>
                {supplier.type === 'physical' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </Badge>
            </CardDescription>
          </div>
          <Badge variant={supplier.isActive ? 'default' : 'destructive'}>
            {supplier.isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {supplier.type === 'legal' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Razão Social</h3>
                <p className="mt-1">{supplier.businessName || 'Não informado'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nome Fantasia</h3>
                <p className="mt-1">{supplier.tradeName || 'Não informado'}</p>
              </div>
            </div>
            <Separator />
          </>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Documento</h3>
              <p className="mt-1">{supplier.document}</p>
            </div>

            {supplier.website && (
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                  <a href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="mt-1 text-blue-600 hover:underline">
                    {supplier.website}
                  </a>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email Principal</h3>
                <p className="mt-1">{supplier.email || 'Não informado'}</p>
              </div>
            </div>

            {supplier.alternativeEmail && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email Alternativo</h3>
                  <p className="mt-1">{supplier.alternativeEmail}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Telefone Principal</h3>
                <p className="mt-1">{supplier.phone || 'Não informado'}</p>
              </div>
            </div>

            {supplier.landlinePhone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Telefone Fixo</h3>
                  <p className="mt-1">{supplier.landlinePhone}</p>
                </div>
              </div>
            )}

            {supplier.mobilePhone && (
              <div className="flex items-center space-x-2">
                <PhoneCall className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">WhatsApp/Celular</h3>
                  <p className="mt-1">{supplier.mobilePhone}</p>
                </div>
              </div>
            )}

            {supplier.contactPerson && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Pessoa de Contato</h3>
                  <p className="mt-1">{supplier.contactPerson}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
            <p className="mt-1">{supplier.address || 'Não informado'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Informações Bancárias</h3>
            <p className="mt-1 whitespace-pre-line">{supplier.bankInfo || 'Não informado'}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Observações</h3>
          <p className="mt-2 whitespace-pre-line">{supplier.notes || 'Nenhuma observação'}</p>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Informações Adicionais</h3>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Data de Cadastro</p>
              <p>{new Date(supplier.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Última Atualização</p>
              <p>{new Date(supplier.updatedAt).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-6">
        <Button variant="outline" onClick={onClose} className="mr-2">
          Fechar
        </Button>
        <Button onClick={onEdit}>
          Editar Fornecedor
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupplierDetails;
