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
import { LockOpen, SquarePen } from "lucide-react";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const EditVaultDialog = ({
  vaultId,
  setVaultValue,
  setIsDecrypted,
  setOriginalDecryptedVaultValue,
}: {
  vaultId: string;
  setVaultValue: Dispatch<SetStateAction<string>>;
  setIsDecrypted: Dispatch<SetStateAction<boolean>>;
  setOriginalDecryptedVaultValue: Dispatch<SetStateAction<string>>;
}) => {
  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);
  const editQuery = router.query.edit === "true";
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (editQuery) {
      setIsOpen(true);
    }
  }, [editQuery]);

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

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      router.push(`/vault/${router.query.id}?edit=true`, undefined, {
        shallow: true,
      });
    } else {
      router.push(`/vault/${router.query.id}`, undefined, { shallow: true });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="min-w-32">
          <SquarePen className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Decrypt vault and edit contents?</DialogTitle>
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
            Decrypt & Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
