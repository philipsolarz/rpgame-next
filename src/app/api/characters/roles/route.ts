import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
    CharacterRolesResponse,
    CharacterRoleCreateRequest,
    CharacterRoleCreateResponse
} from "@/types/character";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest): Promise<NextResponse<CharacterRolesResponse | { error: string; details?: any }>> {
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
        const searchParams = request.nextUrl.searchParams;
        const queryParams = new URLSearchParams(searchParams).toString();

        const response = await fetch(`${API_URL}/characters/roles/?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch roles", details: await response.text() },
                { status: response.status }
            );
        }

        const data: CharacterRolesResponse = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}

export async function POST(request: NextRequest): Promise<NextResponse<CharacterRoleCreateResponse | { error: string; details?: any }>> {
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
        const requestBody: CharacterRoleCreateRequest = await request.json();

        const response = await fetch(`${API_URL}/characters/roles/`, {
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
                { error: "Failed to create role", details: await response.text() },
                { status: response.status }
            );
        }

        const data: CharacterRoleCreateResponse = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}
