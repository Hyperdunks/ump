"use client";

import { User, Mail } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

// TODO: Replace with better-auth session data
const user = {
  name: "Harsh Patel",
  email: "harsh@example.com",
  initials: "HP",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <div>
        <h1 className="text-xl font-semibold">Account</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal account settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-16 text-2xl">
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Field>
            <FieldLabel>Full Name</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <User className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                defaultValue={user.name}
                placeholder="Your name"
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel>Email Address</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Mail className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                type="email"
                defaultValue={user.email}
                placeholder="you@example.com"
              />
            </InputGroup>
          </Field>
        </CardContent>

        <CardFooter className="justify-end">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
