"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { EmbeddedAuthForm } from "@crossmint/client-sdk-react-ui";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
];

export function AuthCrossmint() {
  const [goal, setGoal] = useState(350);

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

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
            <DialogTitle className="text-2xl font-bold text-center">You're almost there!</DialogTitle>
            <EmbeddedAuthForm />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
