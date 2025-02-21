import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useAuthToken() {
    const [token, setToken] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchToken = async () => {
            const { data: session } = await supabase.auth.getSession();
            setToken(session?.session?.access_token || null);
        };

        fetchToken();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setToken(session?.access_token || null);
            }
        );

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [supabase]);

    return token;
}
