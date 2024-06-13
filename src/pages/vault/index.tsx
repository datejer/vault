import { NewVaultDialog } from "@/components/NewVaultDialog";
import { VaultLayout } from "@/components/VaultLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getServerSideProtectedRoute } from "@/lib/getServerSideProtectedRoute";
import { EllipsisVertical } from "lucide-react";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";

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
        <div
          className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
          x-chunk="dashboard-02-chunk-1"
        >
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no vaults
            </h3>
            <p className="text-sm text-muted-foreground">
              You can start by creating a new encrypted vault.
            </p>
            <NewVaultDialog />
          </div>
        </div>
      ) : (
        <div
          className="rounded-lg border border-dashed shadow-sm"
          x-chunk="dashboard-02-chunk-1"
        >
          <div className="grid grid-cols-1 gap-4 p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vault Name</TableHead>
                  <TableHead>Vault ID</TableHead>
                  <TableHead>Created at</TableHead>
                  <TableHead>Last updated</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.vaults.map((vault) => (
                  <TableRow key={vault.id}>
                    <TableCell className="font-medium">
                      <Link href={`/vault/${vault.id}`}>{vault.name}</Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/vault/${vault.id}`}>{vault.id}</Link>
                    </TableCell>
                    <TableCell>{vault.createdAt}</TableCell>
                    <TableCell>{vault.updatedAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div
                            className="flex items-center justify-center h-5 w-5 cursor-pointer"
                            role="button"
                          >
                            <EllipsisVertical className="h-5 w-5" />
                            <span className="sr-only">Toggle vault menu</span>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/vault/${vault.id}`}>
                            <DropdownMenuItem className="cursor-pointer">
                              Open
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/vault/${vault.id}`}>
                            <DropdownMenuItem className="cursor-pointer">
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/vault/${vault.id}`}>
                            <DropdownMenuItem className="cursor-pointer">
                              Delete
                            </DropdownMenuItem>
                          </Link>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
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
