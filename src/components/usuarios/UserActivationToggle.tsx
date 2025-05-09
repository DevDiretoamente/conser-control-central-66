
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/auth';
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

interface UserActivationToggleProps {
  user: User;
  disabled?: boolean;
}

const UserActivationToggle: React.FC<UserActivationToggleProps> = ({ user, disabled = false }) => {
  const { toggleUserActivation } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState<boolean>(user.isActive);

  const handleToggle = (checked: boolean) => {
    setNewStatus(checked);
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    toggleUserActivation(user.id, newStatus);
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        {user.isActive ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
        <Switch 
          checked={user.isActive} 
          onCheckedChange={handleToggle}
          disabled={disabled}
          aria-label={`Ativar ou desativar usuário ${user.name}`}
        />
        <span className="text-sm">
          {user.isActive ? 'Ativo' : 'Inativo'}
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
