
import { useContext } from "react";
import { PlannerContext } from "@/contexts/PlannerProvider";

export function usePlanner() {
  return useContext(PlannerContext);
}