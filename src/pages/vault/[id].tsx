import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EyeOff, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { DecryptVaultDialog } from "@/components/DecryptVaultDialog";
import { DeleteVaultDialog } from "@/components/DeleteVaultDialog";
import { EditVaultDialog } from "@/components/EditVaultDialog";
import { defaultSpreadsheetData } from "@/components/NewVaultDialog";
import { SaveVaultDialog } from "@/components/SaveVaultDialog";
import { Spreadsheet } from "@/components/Spreadsheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VaultHeader } from "@/components/VaultHeader";
import { VaultLayout } from "@/components/VaultLayout";
import { dbDateToLocal } from "@/lib/dbDateToLocal";
import { getServerSideProtectedRoute } from "@/lib/getServerSideProtectedRoute";
import { cn } from "@/lib/utils";

export default function VaultPage({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const vault = user.vaults.find((vault) => vault.id === router.query.id);
  const [vaultValue, setVaultValue] = useState<string>(vault?.value || "");
  const [originalDecryptedVaultValue, setOriginalDecryptedVaultValue] = useState(
    vault?.value || "",
  );
  const [isDecrypted, setIsDecrypted] = useState(false);
  const editQuery = router.query.edit === "true";
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
          <h1 className="text-lg font-semibold md:text-2xl">❗ Vault not found</h1>
        </div>
      </VaultLayout>
    );
  }

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

  return (
    <VaultLayout>
      <VaultHeader vault={vault} editMode={editMode} isDecrypted={isDecrypted} />

      <div className="relative flex-1">
        {vault.type === "text" && (
          <Textarea
            value={vaultValue}
            onChange={(e) => setVaultValue(e.target.value)}
            readOnly={!editMode}
            placeholder="This vault is empty..."
            className={cn(
              isDecrypted
                ? ""
                : "text-muted-foreground blur-[1px] pointer-events-none overflow-hidden",
              "h-full",
              !editMode && "focus-visible:ring-0",
              "max-w-full",
            )}
          />
        )}
        {vault.type === "spreadsheet" && (
          <div className={cn("overflow-scroll", !isDecrypted && "blur-[1px] pointer-events-none")}>
            <Spreadsheet
              isDecrypted={isDecrypted}
              data={isDecrypted ? JSON.parse(vaultValue) : defaultSpreadsheetData}
              onChange={(data) => setVaultValue(JSON.stringify(data))}
              disabled={!editMode}
            />
          </div>
        )}
        <DecryptVaultDialog
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

      <div className="flex justify-between  gap-2 flex-col items-start sm:flex-row sm:items-center">
        <div className="text-muted-foreground" suppressHydrationWarning>
          Last updated: {dbDateToLocal(vault.updatedAt)}
        </div>
        <div className="flex gap-4 w-full justify-end sm:w-auto flex-wrap">
          {editMode ? (
            <>
              <Button className="min-w-32" onClick={handleSaveButton}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button className="min-w-32" variant="outline" onClick={handleDiscardButton}>
                <X className="mr-2 h-4 w-4" />
                Discard
              </Button>
            </>
          ) : (
            <>
              {isDecrypted && (
                <Button className="min-w-32" variant="outline" onClick={handleHideContentsButton}>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Hide contents
                </Button>
              )}
              <EditVaultDialog
                setIsDecrypted={setIsDecrypted}
                vaultId={vault.id}
                setVaultValue={setVaultValue}
                setOriginalDecryptedVaultValue={setOriginalDecryptedVaultValue}
              />
              <Button className="min-w-32" variant="destructive" onClick={handleDeleteButton}>
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
