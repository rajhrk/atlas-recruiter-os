"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import UniversalSearch from "@/components/search/UniversalSearch";

import { useAtlas } from "@/context/AtlasContext";
import { TALENT_DOMAINS } from "@/lib/atlas/talentDomains";

interface SearchFormProps {
  className?: string;
}

export function SearchForm({ className }: SearchFormProps) {
  const { selectedDomain, selectedRole, setSelectedRole } = useAtlas();

  const domain = TALENT_DOMAINS.find(
    (item) => item.id === selectedDomain,
  )!;

  /*
   * Recruiter Search is domain-scoped.
   *
   * Do not merge the global Atlas role registry here.
   * The selected talent domain owns the valid role universe.
   */
  const roles = domain.roles;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{domain.label} Recruiter Search</CardTitle>
        <p className="text-sm text-muted-foreground">
          Search Atlas {domain.label.toLowerCase()} talent intelligence.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <UniversalSearch domainId={selectedDomain} />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input placeholder="Singapore" />
          </div>

          <div className="space-y-2">
            <Label>Experience</Label>
            <Input placeholder="5-8 years" />
          </div>
        </div>

        <div className="flex gap-3">
          <Button>Search</Button>
          <Button variant="outline">Clear</Button>
        </div>
      </CardContent>
    </Card>
  );
}
