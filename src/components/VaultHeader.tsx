import { useState } from "react";
import { PencilLine, Save } from "lucide-react";
import { toast } from "sonner";
import { Vault } from "@/db/schema";
import { dbDateToLocal } from "@/lib/dbDateToLocal";
import { vaultTypeIcons, vaultTypeLabels } from "@/lib/vaultTypes";

export const VaultHeader = ({
  vault,
  editMode,
  isDecrypted,
}: {
  vault: Vault;
  editMode: boolean;
  isDecrypted: boolean;
}) => {
  const [isEditingVaultName, setIsEditingVaultName] = useState(false);
  const [internalVaultName, setInternalVaultName] = useState(vault.name);

  const getStatusLabel = () => {
    if (editMode) {
      return "Edit mode";
    }

    if (isDecrypted) {
      return "Viewing: Decrypted";
    }

    return "Viewing: Encrypted";
  };

  const handleSaveVaultName = async () => {
    const response = await fetch("/api/vault/changeName", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: vault.id,
        name: internalVaultName,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success && data.data.updatedName) {
      setIsEditingVaultName(false);
      setInternalVaultName(data.data.updatedName);
      toast.success("Vault name changed successfully.");
      return;
    }

    setIsEditingVaultName(false);
    setInternalVaultName(vault.name);
    toast.error(data.error.message || "An error occurred. Please try again.");
  };

  return (
    <div className="flex items-center justify-between gap-2 flex-col sm:flex-row">
      <span className="self-start">
        <h1 className="text-lg font-semibold md:text-2xl flex gap-2 items-center">
          🔐 Vault:{" "}
          {isEditingVaultName ? (
            <>
              <input
                type="text"
                value={internalVaultName}
                onChange={(e) => setInternalVaultName(e.target.value)}
                className="bg-transparent flex-1 w-full"
              />
              <button onClick={() => handleSaveVaultName()}>
                <Save size={20} />
              </button>
            </>
          ) : (
            <>
              {internalVaultName}{" "}
              <button onClick={() => setIsEditingVaultName(true)}>
                <PencilLine size={20} />
              </button>
            </>
          )}
        </h1>
        <div className="text-muted-foreground">
          <span>
            {vaultTypeLabels[vault.type]} {vaultTypeIcons[vault.type]}
          </span>
          <span className="mx-2">•</span>
          <span suppressHydrationWarning>{dbDateToLocal(vault.createdAt)}</span>
        </div>
      </span>
      <span className="ml-2 text-muted-foreground self-end sm:self-center">
        {getStatusLabel()} {isDecrypted ? "🔓" : "🔒"}
      </span>
    </div>
  );
};
