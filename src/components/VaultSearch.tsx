import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const LIMIT_RESULTS = 5;

export const VaultSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const user = useUser();

  const search = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const filteredVaults = useMemo(() => {
    const vaults = user?.vaults || [];
    return vaults
      .filter((vault) => vault.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, LIMIT_RESULTS);
  }, [query, user]);

  return (
    <div className="relative">
      <form>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vaults..."
            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            onChange={search}
          />
        </div>
      </form>
      {query && (
        <Card className="absolute top-11 w-full md:w-2/3 lg:w-1/3 z-50">
          <CardContent className="px-4 py-2">
            {filteredVaults.length === 0
              ? `No vaults found for "${query}"`
              : filteredVaults.map((vault, index) => (
                  <>
                    <Link href={`/vault/${vault.id}`} key={vault.id}>
                      <div className="text-sm p-1">
                        🔒 {vault.name} &mdash; {vault.createdAt.split(" ")[0]}
                      </div>
                    </Link>
                    {index < filteredVaults.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </>
                ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
