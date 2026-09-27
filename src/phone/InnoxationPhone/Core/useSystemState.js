import { useContext } from "react";
import { SystemStateContext } from "./SystemStateContext";

export function useSystemState() {
  const context = useContext(SystemStateContext);

  if (!context) {
    throw new Error(
      "useSystemState must be used inside SystemStateProvider"
    );
  }

  return context;
}