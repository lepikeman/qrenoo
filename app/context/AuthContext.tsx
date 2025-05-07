import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
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
  initialUser: User | null; // Changé de initialSession à initialUser
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [session, setSession] = useState<Session | null>(
    initialUser ? ({ user: initialUser } as Session) : null
  );
  const [loading, setLoading] = useState(!initialUser);
  const { error } = useServerLog();

  useEffect(() => {
    let isMounted = true;

    // Fonction d'initialisation sécurisée
    async function initAuth() {
      try {
        // Récupère l'utilisateur authentifié de manière sécurisée
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (isMounted) {
          setUser(user);
          // Ne définit la session que si l'utilisateur est authentifié
          setSession(user ? ({ user } as Session) : null);
          setLoading(false);
        }
      } catch (e) {
        error("Erreur d'authentification", {
          component: "AuthProvider",
          details: e instanceof Error ? e.message : "Erreur inconnue",
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

    // Écoute les changements d'état d'authentification
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (isMounted) {
          // Vérifie toujours l'utilisateur après un changement d'état
          const {
            data: { user },
          } = await supabase.auth.getUser();
          setUser(user);
          setSession(user ? newSession : null);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [error, initialUser]);

  // Mémorise la valeur du context pour éviter les rerenders inutiles
  const value = useMemo(
    () => ({
      session,
      user,
      loading,
    }),
    [session, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
