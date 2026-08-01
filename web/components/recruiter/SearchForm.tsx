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

import { getAllRoles } from "@/lib/atlas/service";
import { useAtlas } from "@/context/AtlasContext";

interface SearchFormProps {
  className?: string;
}

export function SearchForm({ className }: SearchFormProps) {
  const { selectedRole, setSelectedRole } = useAtlas();

  const roles = getAllRoles();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recruiter Search</CardTitle>

        <p className="text-sm text-muted-foreground">
          Search Atlas recruiter intelligence.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Universal Search */}
        <UniversalSearch />

        {/* Filters */}
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
                  <SelectItem
                    key={role.role}
                    value={role.role}
                  >
                    {role.role}
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

        {/* Buttons */}
        <div className="flex gap-3">
          <Button>Search</Button>

          <Button variant="outline">
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}