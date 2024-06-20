import { InferGetServerSidePropsType } from "next";
import { NewVaultDialog } from "@/components/NewVaultDialog";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VaultLayout } from "@/components/VaultLayout";
import { VaultTableRow } from "@/components/VaultTableRow";
import { getServerSideProtectedRoute } from "@/lib/getServerSideProtectedRoute";

export default function VaultPage({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <VaultLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Your vaults</h1>
        <NewVaultDialog />
      </div>

      {user.vaults.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">You have no vaults</h3>
            <p className="text-sm text-muted-foreground">
              You can start by creating a new encrypted vault.
            </p>
            <NewVaultDialog />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed shadow-sm">
          <div className="grid grid-cols-1 gap-4 p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vault Name</TableHead>
                  <TableHead>Vault ID</TableHead>
                  <TableHead>Created at</TableHead>
                  <TableHead>Last updated</TableHead>
                  <TableHead className="w-[20px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.vaults.map((vault) => (
                  <VaultTableRow key={vault.id} vault={vault} />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </VaultLayout>
  );
}

export const getServerSideProps = getServerSideProtectedRoute;
