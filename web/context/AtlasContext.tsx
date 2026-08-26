"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import {
  TALENT_DOMAINS,
  TalentDomainId,
} from "@/lib/atlas/talentDomains";

interface AtlasContextType {
  selectedDomain: TalentDomainId;
  setSelectedDomain: (domain: TalentDomainId) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
}

const DEFAULT_DOMAIN: TalentDomainId = "data-center";

const AtlasContext = createContext<AtlasContextType | undefined>(undefined);

export function AtlasProvider({ children }: { children: ReactNode }) {
  const defaultDomain = TALENT_DOMAINS.find(
    (domain) => domain.id === DEFAULT_DOMAIN,
  )!;

  const [selectedDomain, setSelectedDomainState] =
    useState<TalentDomainId>(DEFAULT_DOMAIN);

  const [selectedRole, setSelectedRole] =
    useState<string>(
      defaultDomain.defaultRole,
    );

  function setSelectedDomain(domain: TalentDomainId) {
    setSelectedDomainState(domain);

    const nextDomain = TALENT_DOMAINS.find(
      (item) => item.id === domain,
    );

    if (nextDomain) {
      setSelectedRole(nextDomain.defaultRole);
    }
  }

  return (
    <AtlasContext.Provider
      value={{
        selectedDomain,
        setSelectedDomain,
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
