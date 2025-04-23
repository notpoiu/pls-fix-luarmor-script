"use client";

import init, { process_code } from "@/../public/darklua/darklua_wasm";
import React, { useEffect } from "react";

const provider = React.createContext({
  transformLuau: async (
    // @ts-ignore
    code: string,
    // @ts-ignore
    config?: Record<string, unknown>
  ): Promise<string> => "",
});

export const DarkLuaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [wasmInitialized, setWasmInitialized] = React.useState(false);

  async function transformLuau(code: string, config?: Record<string, unknown>) {
    if (!wasmInitialized) {
      return "-- Oops, sorry but the code transformer (darklua) is not ready yet.\n-- Please try again in a few seconds.";
    }

    const configObj = config ?? {};
    return process_code(code, configObj);
  }

  useEffect(() => {
    init().then(() => setWasmInitialized(true));
  }, []);

  return (
    <provider.Provider value={{ transformLuau }}>{children}</provider.Provider>
  );
};

export const useDarkLua = () => {
  const context = React.useContext(provider);
  if (context === undefined) {
    throw new Error("useDarkLua must be used within a DarkLuaProvider");
  }
  return context;
};
