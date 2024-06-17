import { VaultLayout } from "@/components/VaultLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getServerSideProtectedRoute } from "@/lib/getServerSideProtectedRoute";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { DecryptVaultDialog } from "@/components/DecryptVaultDialog";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { EditVaultDialog } from "@/components/EditVaultDialog";
import { toast } from "sonner";
import { SaveVaultDialog } from "@/components/SaveVaultDialog";
import { dbTimeToLocal } from "@/lib/dbTimeToLocal";
import { DeleteVaultDialog } from "@/components/DeleteVaultDialog";
import { EyeOff, Save, SquarePen, Trash2, X } from "lucide-react";

export default function VaultPage({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const vault = user.vaults.find((vault) => vault.id === router.query.id);
  const [vaultValue, setVaultValue] = useState<string>(vault?.value || "");
  const [originalDecryptedVaultValue, setOriginalDecryptedVaultValue] =
    useState(vault?.value || "");
  const [isDecrypted, setIsDecrypted] = useState(false);
  const editQuery = router.query.edit === "true";
  const showEditPrompt = editQuery && !isDecrypted;
  const editMode = editQuery && isDecrypted;
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (editQuery && isDecrypted) {
      toast.info("Edit mode: enabled");
    }
  }, [editQuery, isDecrypted]);

  if (!vault) {
    return (
      <VaultLayout>
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">
            ❗ Vault not found
          </h1>
        </div>
      </VaultLayout>
    );
  }

  const handleEditButton = () => {
    router.push(`/vault/${router.query.id}?edit=true`);
  };

  const handleDiscardButton = () => {
    router.push(`/vault/${router.query.id}`).then(() => {
      setVaultValue(originalDecryptedVaultValue);
      toast.info("Edit mode: disabled");
    });
  };

  const handleSaveButton = () => {
    setSaveDialogOpen(true);
  };

  const handleHideContentsButton = () => {
    setVaultValue(vault.value || "");
    setOriginalDecryptedVaultValue(vault.value || "");
    setIsDecrypted(false);
    toast.info("Vault contents hidden");
  };

  const handleDeleteButton = () => {
    setDeleteDialogOpen(true);
  };

  const getStatusLabel = () => {
    if (editMode) {
      return "Edit mode";
    }

    if (isDecrypted) {
      return "Viewing: Decrypted";
    }

    return "Viewing: Encrypted";
  };

  return (
    <VaultLayout>
      <div className="flex items-center justify-between">
        <span>
          <h1 className="text-lg font-semibold md:text-2xl">
            🔐 Vault: {vault.name}
          </h1>
          <div className="text-muted-foreground" suppressHydrationWarning>
            {dbTimeToLocal(vault.createdAt)}
          </div>
        </span>
        <span className="ml-2 text-muted-foreground">
          {getStatusLabel()} {isDecrypted ? "🔓" : "🔒"}
        </span>
      </div>

      <div className="relative flex-1">
        <Textarea
          value={vaultValue}
          onChange={(e) => setVaultValue(e.target.value)}
          readOnly={!editMode}
          rows={10}
          placeholder="Vault value"
          className={cn(
            isDecrypted ? "" : "text-muted-foreground blur-[1px]",
            "h-full",
            !editMode && "focus-visible:ring-0"
          )}
        />
        <DecryptVaultDialog
          isDecrypted={isDecrypted}
          setIsDecrypted={setIsDecrypted}
          vaultId={vault.id}
          setVaultValue={setVaultValue}
          setOriginalDecryptedVaultValue={setOriginalDecryptedVaultValue}
        />
        <EditVaultDialog
          defaultOpen={showEditPrompt}
          isDecrypted={isDecrypted}
          setIsDecrypted={setIsDecrypted}
          vaultId={vault.id}
          setVaultValue={setVaultValue}
          setOriginalDecryptedVaultValue={setOriginalDecryptedVaultValue}
        />
        <SaveVaultDialog
          vault={vault}
          defaultOpen={saveDialogOpen}
          setSaveDialogOpen={setSaveDialogOpen}
          vaultValue={vaultValue}
          setOriginalDecryptedVaultValue={setOriginalDecryptedVaultValue}
        />
        <DeleteVaultDialog
          vault={vault}
          isOpen={deleteDialogOpen}
          setIsOpen={setDeleteDialogOpen}
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="text-muted-foreground" suppressHydrationWarning>
          Last updated: {dbTimeToLocal(vault.updatedAt)}
        </div>
        <div className="flex gap-4 ">
          {editMode ? (
            <>
              <Button className="min-w-32" onClick={handleSaveButton}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button
                className="min-w-32"
                variant="outline"
                onClick={handleDiscardButton}
              >
                <X className="mr-2 h-4 w-4" />
                Discard
              </Button>
            </>
          ) : (
            <>
              {isDecrypted && (
                <Button
                  className="min-w-32"
                  variant="outline"
                  onClick={handleHideContentsButton}
                >
                  <EyeOff className="mr-2 h-4 w-4" />
                  Hide contents
                </Button>
              )}
              <Button className="min-w-32" onClick={handleEditButton}>
                <SquarePen className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                className="min-w-32"
                variant="destructive"
                onClick={handleDeleteButton}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </VaultLayout>
  );
}

export const getServerSideProps = getServerSideProtectedRoute;
