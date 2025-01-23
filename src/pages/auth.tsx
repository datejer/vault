import { waitUntil } from "@vercel/functions";
import { sql } from "drizzle-orm";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/db";

export default function AuthPage(): JSX.Element {
  return (
    <div className="min-h-dvh flex justify-center items-center">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    // Ping the database to wake up from sleep (avoid cold start on login request)
    waitUntil(db.run(sql`SELECT 1`));
    return { props: {} };
  } catch (error) {
    console.error("Error pinging database:", error);
    return { props: {} };
  }
}
