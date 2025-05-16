
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Customer } from '@/types/financeiro';
import { Globe, User, Phone, PhoneCall, Mail } from 'lucide-react';

interface CustomerDetailsProps {
  customer: Customer;
  onEdit: () => void;
  onClose: () => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer, onEdit, onClose }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">{customer.name}</CardTitle>
            <CardDescription>
              <Badge className="mt-1" variant={customer.type === 'physical' ? 'outline' : 'default'}>
                {customer.type === 'physical' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </Badge>
            </CardDescription>
          </div>
          <Badge variant={customer.isActive ? 'default' : 'destructive'}>
            {customer.isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Documento</h3>
              <p className="mt-1">{customer.document}</p>
            </div>
            
            {customer.website && (
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                  <a href={customer.website.startsWith('http') ? customer.website : `https://${customer.website}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="mt-1 text-blue-600 hover:underline">
                    {customer.website}
                  </a>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email Principal</h3>
                <p className="mt-1">{customer.email || 'Não informado'}</p>
              </div>
            </div>

            {customer.alternativeEmail && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email Alternativo</h3>
                  <p className="mt-1">{customer.alternativeEmail}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Telefone Principal</h3>
                <p className="mt-1">{customer.phone || 'Não informado'}</p>
              </div>
            </div>

            {customer.landlinePhone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Telefone Fixo</h3>
                  <p className="mt-1">{customer.landlinePhone}</p>
                </div>
              </div>
            )}

            {customer.mobilePhone && (
              <div className="flex items-center space-x-2">
                <PhoneCall className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">WhatsApp/Celular</h3>
                  <p className="mt-1">{customer.mobilePhone}</p>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
              <p className="mt-1">{customer.address || 'Não informado'}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Localização</h3>
            <div className="mt-2 space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Cidade</p>
                <p>{customer.city || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estado</p>
                <p>{customer.state || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">CEP</p>
                <p>{customer.zipCode || 'Não informado'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Contato Principal</span>
            </h3>
            <div className="mt-2 space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Nome</p>
                <p>{customer.contactPerson || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Telefone</p>
                <p>{customer.contactPhone || 'Não informado'}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Observações</h3>
          <p className="mt-2 whitespace-pre-line">{customer.notes || 'Nenhuma observação'}</p>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Informações Adicionais</h3>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Data de Cadastro</p>
              <p>{new Date(customer.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Última Atualização</p>
              <p>{new Date(customer.updatedAt).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-6">
        <Button variant="outline" onClick={onClose} className="mr-2">
          Fechar
        </Button>
        <Button onClick={onEdit}>
          Editar Cliente
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CustomerDetails;
