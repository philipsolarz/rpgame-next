import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
    Character,
    CharactersResponse
} from "@/types/character";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse<CharactersResponse | { error: string; details?: any }>> {
    try {
        // Create Supabase client
        const supabase = await createClient();

        // Get user data
        const { data: userData, error: userError } = await supabase.auth.getUser();

        // Check if user is authenticated
        if (userError || !userData?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        // Check if session is valid
        if (sessionError || !sessionData?.session?.access_token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get token from session
        const token = sessionData.session.access_token;

        // Fetch participants for this conversation
        const response = await fetch(`${API_URL}/conversations/${params.id}/participants`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        // Handle response
        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch participants", details: await response.text() },
                { status: response.status }
            );
        }

        // Parse response
        const data: CharactersResponse = await response.json();

        // Return response
        return NextResponse.json(data);
    } catch (error) {
        // Handle error
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse<{ message: string } | { error: string; details?: any }>> {
    try {
        // Create Supabase client
        const supabase = await createClient();

        // Get user data
        const { data: userData, error: userError } = await supabase.auth.getUser();

        // Check if user is authenticated
        if (userError || !userData?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        // Check if session is valid
        if (sessionError || !sessionData?.session?.access_token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get token from session
        const token = sessionData.session.access_token;

        // Parse request body
        const requestBody = await request.json();
        if (!requestBody.participant_id) {
            return NextResponse.json({ error: "Missing participant_id" }, { status: 400 });
        }

        // Send POST request to external API
        const response = await fetch(`${API_URL}/conversations/${params.id}/participants`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ participant_id: requestBody.participant_id }),
            cache: "no-store",
        });

        // Handle response
        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to add participant", details: await response.text() },
                { status: response.status }
            );
        }

        return NextResponse.json({ message: "Participant added successfully" });
    } catch (error) {
        // Handle error
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}
