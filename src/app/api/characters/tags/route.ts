import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
    CharacterTagsResponse,
    CharacterTagCreateRequest,
    CharacterTagCreateResponse
} from "@/types/character";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest): Promise<NextResponse<CharacterTagsResponse | { error: string; details?: any }>> {
    try {
        const supabase = await createClient();
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !sessionData?.session?.access_token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get token from session
        const token = sessionData.session.access_token;

        const searchParams = request.nextUrl.searchParams;
        const queryParams = new URLSearchParams(searchParams).toString();
        const response = await fetch(`${API_URL}/characters/tags/?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch tags", details: await response.text() },
                { status: response.status }
            );
        }

        const data: CharacterTagsResponse = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}

export async function POST(request: NextRequest): Promise<NextResponse<CharacterTagCreateResponse | { error: string; details?: any }>> {
    try {
        const supabase = await createClient();
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !sessionData?.session?.access_token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = sessionData.session.access_token;
        const requestBody: CharacterTagCreateRequest = await request.json();

        const response = await fetch(`${API_URL}/characters/tags/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to create tag", details: await response.text() },
                { status: response.status }
            );
        }

        const data: CharacterTagCreateResponse = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}
