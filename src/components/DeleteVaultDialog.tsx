import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Vault } from "@/db/schema";
import { AlertCircle, LockOpen, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const DeleteVaultDialog = ({
  vault,
  isOpen,
  setIsOpen,
}: {
  vault: Vault;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameConfirmRef = useRef<HTMLInputElement>(null);

  const submit = async () => {
    if (!passwordRef.current?.value) {
      toast.error("Password is required.");
      return;
    }

    if (nameConfirmRef.current?.value !== vault.name) {
      toast.error("Vault name does not match.");
      return;
    }

    const response = await fetch("/api/vault/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: vault.id,
        password: passwordRef.current.value,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success && data.data.deleted) {
      router.push("/vault").then(() => {
        toast.success(`Vault "${vault.name}" has been deleted successfully.`);
        setIsOpen(false);
      });
      return;
    }

    toast.error(data.error.message || "An error occurred. Please try again.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this vault?</DialogTitle>
          <DialogDescription>
            Vault: <code>{vault.name}</code>
            <br />
            <br />
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>This action cannot be undone. </AlertTitle>
              <AlertDescription>
                This will permanently delete your vault and remove your
                encrypted data from our servers.
              </AlertDescription>
            </Alert>
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="vault-name-confirm">
          Enter the vault name to continue:
        </Label>
        <Input
          id="vault-name-confirm"
          name="vault-name-confirm"
          autoComplete="off"
          type="text"
          placeholder="Confirm vault name"
          className="w-full"
          ref={nameConfirmRef}
        />
        <Label htmlFor="password-confirm">Password</Label>
        <Input
          id="password-confirm"
          type="password"
          placeholder="••••••••"
          className="w-full"
          ref={passwordRef}
        />
        <DialogFooter>
          <Button onClick={submit} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Yes, delete vault
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
