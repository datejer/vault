import { useRouter } from "next/router";
import { toast } from "sonner";

export const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    const promise = fetch("/api/auth/logout", {
      method: "POST",
    });

    toast.promise(promise, {
      loading: "Logging out...",
      success: () => {
        router.push("/auth");
        return "Logged out successfully.";
      },
      error: "An error occurred. Please try again or clear cookies manually.",
    });
  };

  return { logout };
};
