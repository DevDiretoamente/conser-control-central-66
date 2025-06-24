
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { AlertTriangle, Shield, Trash2, Users } from 'lucide-react';
import { UserGroup } from '@/types/auth';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import GroupPermissionsTab from './GroupPermissionsTab';
import GroupMembersTab from './GroupMembersTab';

interface GroupFormProps {
  group?: UserGroup;
  isOpen: boolean;
  onClose: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ group, isOpen, onClose }) => {
  const { createUser } = useSecureAuth();
  const [activeTab, setActiveTab] = useState('details');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const isNewGroup = !group;
  
  const form = useForm({
    defaultValues: {
      name: group?.name || '',
      description: group?.description || '',
    }
  });
  
  useEffect(() => {
    if (group) {
      form.reset({
        name: group.name,
        description: group.description
      });
    }
  }, [group, form]);
  
  const handleSubmit = form.handleSubmit((data) => {
    if (isNewGroup) {
      // Mock create group functionality
      console.log('Creating group:', data);
      onClose();
    } else if (group) {
      // Mock update group functionality
      console.log('Updating group:', group.id, data);
    }
  });
  
  const handleDelete = () => {
    if (group) {
      // Mock delete group functionality
      console.log('Deleting group:', group.id);
      setIsDeleteDialogOpen(false);
      onClose();
    }
  };

  const handleAddMember = async (userId: string) => {
    console.log('Adding member to group:', userId);
  };

  const handleRemoveMember = async (userId: string) => {
    console.log('Removing member from group:', userId);
  };

  const handlePermissionsChange = (permissions: { area: string; level: string }[]) => {
    console.log('Permissions changed:', permissions);
  };
  
  // Render differently based on whether it's in a dialog or a card
  const renderContent = () => (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="details" className="flex-1">Detalhes</TabsTrigger>
          {!isNewGroup && (
            <>
              <TabsTrigger value="permissions" className="flex-1">Permissões</TabsTrigger>
              <TabsTrigger value="members" className="flex-1">Membros</TabsTrigger>
            </>
          )}
        </TabsList>
        
        <TabsContent value="details">
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Grupo*</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Administradores, Gerentes RH, Operadores" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva a função deste grupo de usuários" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between pt-4">
                <div>
                  {!isNewGroup && (
                    <Button 
                      type="button" 
                      variant="destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {isNewGroup ? 'Criar Grupo' : 'Salvar Alterações'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        {!isNewGroup && group && (
          <>
            <TabsContent value="permissions">
              <GroupPermissionsTab 
                groupId={group.id}
                initialPermissions={group.permissions.map(p => ({ area: p.area, level: p.level }))}
                onPermissionsChange={handlePermissionsChange}
              />
            </TabsContent>
            
            <TabsContent value="members">
              <GroupMembersTab 
                groupId={group.id}
                members={[]}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
  
  // Delete confirmation dialog
  const deleteDialog = (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o grupo {group?.name}? 
            Esta ação removerá todas as permissões associadas ao grupo e não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-4">
          <AlertTriangle className="h-16 w-16 text-amber-500" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  // If this is rendered in a dialog (for new group creation)
  if (isNewGroup) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Criar Novo Grupo</span>
            </DialogTitle>
            <DialogDescription>
              Crie um novo grupo para organizar permissões comuns entre usuários
            </DialogDescription>
          </DialogHeader>
          {renderContent()}
        </DialogContent>
      </Dialog>
    );
  }
  
  // If this is rendered as a card (for editing existing group)
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>{group?.name || 'Detalhes do Grupo'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
      {deleteDialog}
    </>
  );
};

export default GroupForm;
