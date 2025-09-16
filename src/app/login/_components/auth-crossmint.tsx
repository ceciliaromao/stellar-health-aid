"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { EmbeddedAuthForm, useAuth, useWallet } from "@crossmint/client-sdk-react-ui";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

export function AuthCrossmint() {
  const { status: authStatus } = useAuth();

  const isLoggedIn = authStatus === "logged-in";

  useEffect(() => {
    if (isLoggedIn) {
      // Redirect to dashboard after login
      window.location.href = "/dashboard/wallet";
    } 
  }, [isLoggedIn]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <DrawerHeader>
          <Button className="bg-primary w-full text-black rounded-2xl">
            Login
          </Button>
        </DrawerHeader>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full flex flex-col justify-center items-center gap-4 p-4">
          <div className="sm:max-w-md">
            <DialogTitle className="text-lg font-semibold text-center">Welcome</DialogTitle>
            <hr className="bb-2 mt-4" />
            <EmbeddedAuthForm />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
