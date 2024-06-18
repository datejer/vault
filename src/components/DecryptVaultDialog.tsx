import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockOpen } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { toast } from "sonner";

export const DecryptVaultDialog = ({
  vaultId,
  setVaultValue,
  setIsDecrypted,
  isDecrypted,
  setOriginalDecryptedVaultValue,
}: {
  vaultId: string;
  setVaultValue: Dispatch<SetStateAction<string>>;
  setIsDecrypted: Dispatch<SetStateAction<boolean>>;
  isDecrypted: boolean;
  setOriginalDecryptedVaultValue: Dispatch<SetStateAction<string>>;
}) => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const submit = async () => {
    if (!passwordRef.current?.value) {
      toast.error("Password is required.");
      return;
    }

    const response = await fetch("/api/vault/decrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: vaultId,
        password: passwordRef.current.value,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setVaultValue(data.data.value);
      setOriginalDecryptedVaultValue(data.data.value);
      setIsOpen(false);
      setIsDecrypted(true);
      return;
    }

    toast.error(data.error.message || "An error occurred. Please try again.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isDecrypted && (
        <DialogTrigger asChild>
          <Button className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
            <LockOpen className="mr-2 h-4 w-4" />
            Decrypt Vault
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Decrypt vault contents?</DialogTitle>
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
            <LockOpen className="mr-2 h-4 w-4" />
            Decrypt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
