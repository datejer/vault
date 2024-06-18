import { User } from "@/db/schema";
import React, { createContext, useContext, useState } from "react";

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
});

type UserProviderProps = {
  initialUser: User | null;
};

export const UserProvider = ({
  children,
  initialUser,
}: React.PropsWithChildren<UserProviderProps>) => {
  const [user, setUser] = useState<User | null>(initialUser);

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
