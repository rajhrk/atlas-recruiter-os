
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AtlasContextType {
  selectedRole: string;
  setSelectedRole: (role: string) => void;
}

const AtlasContext = createContext<AtlasContextType | undefined>(undefined);

export function AtlasProvider({ children }: { children: ReactNode }) {
  const [selectedRole, setSelectedRole] = useState(
    "Critical Facilities Engineer"
  );

  return (
    <AtlasContext.Provider
      value={{
        selectedRole,
        setSelectedRole,
      }}
    >
      {children}
    </AtlasContext.Provider>
  );
}

export function useAtlas() {
  const context = useContext(AtlasContext);

  if (!context) {
    throw new Error("useAtlas must be used inside AtlasProvider");
  }

  return context;
}