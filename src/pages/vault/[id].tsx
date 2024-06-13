import { VaultLayout } from "@/components/VaultLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getServerSideProtectedRoute } from "@/lib/getServerSideProtectedRoute";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { DecryptVaultDialog } from "@/components/DecryptVaultDialog";
import { useState } from "react";

export default function VaultPage({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const vault = user.vaults.find((vault) => vault.id === router.query.id);
  const [vaultValue, setVaultValue] = useState<string>(vault?.value || "");
  const [isDecrypted, setIsDecrypted] = useState(false);

  if (!vault) {
    return (
      <VaultLayout>
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Vault not found</h1>
        </div>
      </VaultLayout>
    );
  }

  return (
    <VaultLayout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Vault: {vault.name}
        </h1>
      </div>

      <div className="relative">
        <Textarea
          value={vaultValue}
          readOnly
          rows={10}
          placeholder="Vault value"
          className={isDecrypted ? "" : "text-muted-foreground blur-[1px]"}
        />
        {!isDecrypted && (
          <DecryptVaultDialog
            setIsDecrypted={setIsDecrypted}
            vaultId={vault.id}
            setVaultValue={setVaultValue}
          />
        )}
      </div>

      <div className="flex gap-4 justify-end">
        <Button className="min-w-24">Edit</Button>
        <Button className="min-w-24" variant="destructive">
          Delete
        </Button>
      </div>
    </VaultLayout>
  );
}

export const getServerSideProps = getServerSideProtectedRoute;
