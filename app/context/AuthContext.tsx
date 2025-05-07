import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  createClientComponentClient,
  Session,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useServerLog } from "@/app/hooks/useServerLog";

const supabase = createClientComponentClient();

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
  initialUser: User | null;
  initialSession?: Session | null;
}

export function AuthProvider({ children, initialUser, initialSession }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [session, setSession] = useState<Session | null>(initialSession || null);
  const [loading, setLoading] = useState(!initialUser);
  const { error } = useServerLog();

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (isMounted) {
          setUser(userData.user);
          setSession(initialSession || null);
          setLoading(false);
        }
      } catch (e) {
        error("Erreur d'authentification", {
          component: 'AuthProvider',
          details: e instanceof Error ? e.message : 'Erreur inconnue',
          userId: initialUser?.id,
        });

        if (isMounted) {
          setUser(null);
          setSession(null);
          setLoading(false);
        }
      }
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (isMounted) {
          const { data: userData } = await supabase.auth.getUser();
          setUser(userData.user);
          setSession(newSession);
        }
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [error, initialUser?.id, initialSession]);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
