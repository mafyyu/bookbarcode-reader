import "server-only";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function createSupabaseClient() {
  const { getToken, userId } = await auth();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      accessToken: async () => {
        return await getToken();
      },
    },
  );

  return { supabase, userId };
}
