import React, { createContext, useContext, useState } from "react";
import { UserWithVaults } from "@/db/schema";

interface UserContextProps {
  user: UserWithVaults | null;
  setUser: (user: UserWithVaults | null) => void;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
});

type UserProviderProps = {
  initialUser: UserWithVaults | null;
};

export const UserProvider = ({
  children,
  initialUser,
}: React.PropsWithChildren<UserProviderProps>) => {
  const [user, setUser] = useState<UserWithVaults | null>(initialUser);

  return (
    <UserContext.Provider value={{ user: user || initialUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const { user } = useContext(UserContext);
  return user;
};
