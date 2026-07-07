import { createBrowserClient } from "@supabase/ssr";
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export async function logAction(
  adminEmail: string,
  action: string,
  details?: object
) {
  await supabase.from("audit_logs").insert([{
    admin_email: adminEmail,
    action,
    details: details ?? null,
  }]);
}