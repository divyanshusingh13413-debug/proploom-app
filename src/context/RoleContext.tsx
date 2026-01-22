
'use client';

import { createContext, useContext, type ReactNode, type Dispatch, type SetStateAction } from 'react';

type RoleContextType = {
  viewAsRole: 'admin' | 'agent' | null;
  primaryRole: 'admin' | 'agent' | null;
  actualRoles: string[];
  displayName: string | null;
  setViewAsRole: Dispatch<SetStateAction<'admin' | 'agent' | null>>;
  setPrimaryRole: Dispatch<SetStateAction<'admin' | 'agent' | null>>;
  setActualRoles: Dispatch<SetStateAction<string[]>>;
  setDisplayName: Dispatch<SetStateAction<string | null>>;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children, value }: { children: ReactNode; value: RoleContextType }) {
  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
