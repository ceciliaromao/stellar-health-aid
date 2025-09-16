"use client";

import { useRef } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { useAuth, useWallet } from "@crossmint/client-sdk-react-ui";
import Steps from "./_components/steps";
import { Welcome } from "./_components/welcome";

export default function LoginPage() {
  const { wallet, status: walletStatus } = useWallet();
  const { status: authStatus } = useAuth();
  const nodeRef = useRef(null);
  const isAuthenticated = wallet != null && authStatus === "logged-in";
  const isLoading = walletStatus === "in-progress" || authStatus === "initializing";

  return (
    <main className="min-h-screen overflow-hidden relative flex justify-center items-center">
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={isAuthenticated ? "welcome" : isLoading ? "loading" : "steps"}
          nodeRef={nodeRef}
          timeout={300}
          classNames="page-transition"
          unmountOnExit
        >
          <div ref={nodeRef} className="w-full h-full flex flex-col justify-center items-center">
            {isAuthenticated ? <Welcome /> : <Steps />}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </main>
  );
}
