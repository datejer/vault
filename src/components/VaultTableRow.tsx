import { DeleteVaultDialog } from "@/components/DeleteVaultDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Vault } from "@/db/schema";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const VaultTableRow = ({ vault }: { vault: Vault }): JSX.Element => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteButton = () => {
    setDeleteDialogOpen(true);
  };

  return (
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
            <div className="flex items-center justify-center h-5 w-5 cursor-pointer" role="button">
              <EllipsisVertical className="h-5 w-5" />
              <span className="sr-only">Toggle vault menu</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/vault/${vault.id}`}>
              <DropdownMenuItem className="cursor-pointer">Open</DropdownMenuItem>
            </Link>
            <Link href={`/vault/${vault.id}?edit=true`}>
              <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer" onClick={handleDeleteButton}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DeleteVaultDialog
          vault={vault}
          isOpen={deleteDialogOpen}
          setIsOpen={setDeleteDialogOpen}
        />
      </TableCell>
    </TableRow>
  );
};
