
import React from 'react';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { Switch } from '@/components/ui/switch';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { User } from '@/types/auth';

interface UserActivationToggleProps {
  user: User;
  disabled?: boolean;
}

const UserActivationToggle: React.FC<UserActivationToggleProps> = ({ user, disabled = false }) => {
  const { updateUserProfile } = useSecureAuth();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState<boolean>(user.is_active);

  const handleToggle = (checked: boolean) => {
    setNewStatus(checked);
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await updateUserProfile(user.id, { is_active: newStatus });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        {user.is_active ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
        <Switch 
          checked={user.is_active} 
          onCheckedChange={handleToggle}
          disabled={disabled}
          aria-label={`Ativar ou desativar usuário ${user.name}`}
        />
        <span className="text-sm">
          {user.is_active ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              {newStatus ? 'Ativar usuário?' : 'Desativar usuário?'}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {newStatus 
              ? `Tem certeza que deseja ativar o usuário ${user.name}? Ele poderá fazer login no sistema.`
              : `Tem certeza que deseja desativar o usuário ${user.name}? Ele não poderá mais fazer login no sistema.`
            }
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {newStatus ? 'Ativar' : 'Desativar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserActivationToggle;
