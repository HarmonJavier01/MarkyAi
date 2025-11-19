import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "react-router-dom";

export const stackClientApp = new StackClientApp({
  // You should store these in environment variables
  projectId: "3c8a1e6d-fa44-4ed4-9081-85db71abc287",
  publishableClientKey: "pck_z45fyr7cx26ymbwhjq3b3rph7t16n8gf20frzp7syst7g",
  tokenStore: "cookie",
  redirectMethod: {
    useNavigate,
  }
});