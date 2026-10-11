import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "./session";

/** Verificação dupla dentro de páginas e server actions do painel. */
export async function requireAdmin() {
  const store = await cookies();
  if (!(await verifySession(store.get(SESSION_COOKIE)?.value))) redirect("/admin/login");
}
