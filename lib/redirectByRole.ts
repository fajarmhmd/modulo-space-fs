// lib/redirectByRole.ts
import { getUserRole } from "./getUserRole";

export const redirectByRole = async () => {
  const role = await getUserRole();

  if (role === "admin") {
    window.location.href = "/admin";
  } else {
    window.location.href = "/dashboard";
  }
};