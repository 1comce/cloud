"use client";

import { LogOut } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { handleSignOut } from "@/lib/cognitoActions";

export default function LogoutForm() {
  const [, formAction] = useActionState(handleSignOut, null);
  return (
    <form action={formAction}>
      <Button variant='ghost' size='icon' title='Log out' type='submit'>
        <LogOut className='h-4 w-4' />
      </Button>
    </form>
  );
}
