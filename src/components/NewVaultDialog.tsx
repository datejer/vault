import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Spreadsheet } from "@/components/Spreadsheet";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { vaultType } from "@/lib/vaultTypes";

const formSchema = z.object({
  name: z.string(),
  type: vaultType,
  value: z.object({
    text: z.string(),
    kv: z.record(z.string()),
    spreadsheet: z.array(z.array(z.object({ value: z.string() }).or(z.undefined()))),
  }),
  password: z.string(),
});

export type SpreadsheetData = ({ value: string; readOnly?: boolean } | undefined)[][];

export const defaultSpreadsheetData = [
  [{ value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }],
];

export function NewVaultDialog() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "text",
      value: {
        text: "",
        kv: {
          key: "value",
        },
        spreadsheet: defaultSpreadsheetData,
      },
      password: "",
    },
  });

  const type = useWatch({ control: form.control, name: "type" });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await fetch("/api/vault/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        type: values.type,
        value: JSON.stringify(values.value[values.type]),
        password: values.password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success && data.data.vaultId) {
      router.push(`/vault/${data.data.vaultId}`);
      return;
    }

    toast.error(data.error.message || "An error occurred. Please try again.");
  };

  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetData>(defaultSpreadsheetData);

  useEffect(() => {
    form.setValue("value.spreadsheet", spreadsheetData);
  }, [form, spreadsheetData]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4">New Vault</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Create new Vault</DialogTitle>
              <DialogDescription>
                Crete a new encrypted vault to store your secrets.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vault name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        autoComplete="off"
                        placeholder="Personal"
                        className="col-span-3"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Storage type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="text" />
                          </FormControl>
                          <FormLabel className="font-normal">Text</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="kv" disabled />
                          </FormControl>
                          <FormLabel className="font-normal text-muted-foreground">
                            Key-value pairs
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="spreadsheet" />
                          </FormControl>
                          <FormLabel className="font-normal">Spreadsheet</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {type === "text" && (
                <FormField
                  control={form.control}
                  name="value.text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial value</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="My vault for personal secrets"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {type === "spreadsheet" && (
                <Spreadsheet
                  isDecrypted={true}
                  data={spreadsheetData}
                  onChange={setSpreadsheetData}
                />
              )}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="col-span-3"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
