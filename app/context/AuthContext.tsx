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
} from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
  initialSession: Session | null;
}

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [loading, setLoading] = useState(!initialSession);

  useEffect(() => {
    let isMounted = true;
    if (!initialSession) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (isMounted) {
          setSession(session);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (isMounted) {
          setSession(newSession);
          setLoading(false);
        }
      }
    );
    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
