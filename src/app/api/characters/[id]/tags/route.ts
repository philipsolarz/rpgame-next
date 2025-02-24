import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { CharacterTagAddRequest, CharacterUpdateResponse } from "@/types/character";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse<CharacterUpdateResponse | { error: string; details?: any }>> {
    try {
        // Create Supabase client
        const supabase = await createClient();

        // Get user data
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData?.session?.access_token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const token = sessionData.session.access_token;

        // Parse request body to extract tag_id
        const body: CharacterTagAddRequest = await request.json();

        // Forward the POST request to external API to add the tag
        const response = await fetch(`${API_URL}/characters/${params.id}/tags`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to add tag to character", details: await response.text() },
                { status: response.status }
            );
        }

        const data: CharacterUpdateResponse = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}
