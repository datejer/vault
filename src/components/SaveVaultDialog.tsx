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
import { LockOpen, Save } from "lucide-react";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const SaveVaultDialog = ({
  vault,
  defaultOpen,
  setSaveDialogOpen,
  vaultValue,
  setOriginalDecryptedVaultValue,
}: {
  vault: Vault;
  defaultOpen: boolean;
  setSaveDialogOpen: Dispatch<SetStateAction<boolean>>;
  vaultValue: string;
  setOriginalDecryptedVaultValue: Dispatch<SetStateAction<string>>;
}) => {
  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  const submit = async () => {
    if (!passwordRef.current?.value) {
      toast.error("Password is required.");
      return;
    }

    const response = await fetch("/api/vault/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: vault.id,
        name: vault.name,
        value: vaultValue,
        password: passwordRef.current.value,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success && data.data.vaultId) {
      router.push(`/vault/${data.data.vaultId}`).then(() => {
        toast.success("Vault saved successfully. Exiting edit mode.");
        setOriginalDecryptedVaultValue(vaultValue);
        setSaveDialogOpen(false);
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
          <DialogTitle>Save your changes?</DialogTitle>
        </DialogHeader>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          className="w-full"
          ref={passwordRef}
        />
        <DialogFooter>
          <Button onClick={submit}>
            <Save className="mr-2 h-4 w-4" />
            Save & Encrypt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
