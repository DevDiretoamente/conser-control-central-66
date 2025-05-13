
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CartaoPontoDetails } from '@/components/cartaoponto/CartaoPontoDetails';
import { CartaoPontoDialog } from '@/components/cartaoponto/CartaoPontoDialog';
import { CartaoPontoFormValues } from '@/components/cartaoponto/CartaoPontoDialog';
import { cartaoPontoService } from '@/services/cartaoPontoService';
import { CartaoPonto } from '@/types/cartaoPonto';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const CartaoPontoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { hasSpecificPermission } = useAuth();
  
  const [registro, setRegistro] = useState<CartaoPonto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const canEdit = hasSpecificPermission('cartaoponto', 'write');

  useEffect(() => {
    if (id) {
      loadRegistro(id);
    }
  }, [id]);

  const loadRegistro = async (registroId: string) => {
    setLoading(true);
    try {
      const data = await cartaoPontoService.getById(registroId);
      
      if (data) {
        setRegistro(data);
      } else {
        toast({
          title: 'Erro',
          description: 'Registro não encontrado.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar registro:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os detalhes do registro.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: CartaoPontoFormValues) => {
    if (!id) return;
    
    try {
      const updated = await cartaoPontoService.update(id, data);
      
      if (updated) {
        setRegistro(updated);
        setIsEditDialogOpen(false);
        
        toast({
          title: 'Sucesso',
          description: 'Registro atualizado com sucesso.',
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o registro.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!registro) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">Registro não encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <CartaoPontoDetails 
        registro={registro} 
        onEdit={() => setIsEditDialogOpen(true)}
        canEdit={canEdit}
      />
      
      {canEdit && (
        <CartaoPontoDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          cartaoPonto={registro}
          onSave={handleUpdate}
          isEdit={true}
        />
      )}
    </>
  );
};

export default CartaoPontoDetailPage;
