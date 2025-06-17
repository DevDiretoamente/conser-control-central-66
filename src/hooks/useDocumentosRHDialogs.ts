
import { useDocumentosRHFormDialogs } from './rh/useDocumentosRHFormDialogs';
import { useDocumentosRHDetailsDialogs } from './rh/useDocumentosRHDetailsDialogs';
import { useDocumentosRHDeleteDialog } from './rh/useDocumentosRHDeleteDialog';
import { useDocumentosRHRenovacaoDialog } from './rh/useDocumentosRHRenovacaoDialog';

export function useDocumentosRHDialogs() {
  const formDialogs = useDocumentosRHFormDialogs();
  const detailsDialogs = useDocumentosRHDetailsDialogs();
  const deleteDialog = useDocumentosRHDeleteDialog();
  const renovacaoDialog = useDocumentosRHRenovacaoDialog();

  return {
    ...formDialogs,
    ...detailsDialogs,
    ...deleteDialog,
    ...renovacaoDialog
  };
}
