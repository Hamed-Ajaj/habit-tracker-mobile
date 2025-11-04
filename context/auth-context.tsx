import { account } from "@/lib/appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  isLoadingUser?: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null,
  );
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      setIsLoadingUser(true);
      const session = await account.get();
      setUser(session);
      setIsLoadingUser(false);
    } catch (error) {
      setUser(null);
      if (error instanceof Error) {
        console.log(error.message);
      }
      setIsLoadingUser(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password);
      signIn(email, password);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }

      return "An unknown error occurred during sign up.";
    }
  };
  const signIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      setUser(session);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }

      return "An unknown error occurred during sign in.";
    }
  };
  const signOut = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingUser,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
