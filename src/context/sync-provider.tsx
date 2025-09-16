import { useAuth } from "@crossmint/client-sdk-react-ui";
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface SyncContextType {
  isSyncing: boolean;
  isSynced: boolean;
  syncError: string | null;
}

const SyncContext = createContext<SyncContextType>({
  isSyncing: false,
  isSynced: false,
  syncError: null,
});

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "logged-in" && !isSynced && !isSyncing) {
      setIsSyncing(true);
      setSyncError(null);
      
      // Fire sync request
      fetch("/api/auth/sync", { method: "POST" })
        .then(async (res) => {
          if (res.ok) {
            setIsSynced(true);
          } else {
            const error = await res.text();
            setSyncError(error || 'Erro na sincronização');
          }
        })
        .catch((err) => {
          setSyncError(err.message || 'Erro na sincronização');
        })
        .finally(() => {
          setIsSyncing(false);
        });
    }
  }, [status, isSynced, isSyncing]);

  // Reset sync state when user logs out
  useEffect(() => {
    if (status !== "logged-in") {
      setIsSynced(false);
      setIsSyncing(false);
      setSyncError(null);
    }
  }, [status]);

  const contextValue = useMemo(() => ({
    isSyncing,
    isSynced,
    syncError
  }), [isSyncing, isSynced, syncError]);

  return (
    <SyncContext.Provider value={contextValue}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  return useContext(SyncContext);
}