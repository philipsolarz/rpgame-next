import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
    CharacterResponse,
    CharacterUpdateRequest,
    CharacterUpdateResponse,
    CharacterDeleteResponse
} from "@/types/character";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse<CharacterResponse | { error: string; details?: any }>> {
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

        const { id } = await params;

        // Fetch character from external API
        const response = await fetch(`${API_URL}/characters/${id}`, {
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
                { error: "Failed to fetch character", details: await response.text() },
                { status: response.status }
            );
        }

        // Parse response
        const data: CharacterResponse = await response.json();

        // Return response
        return NextResponse.json(data);
    } catch (error) {
        // Handle error
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse<CharacterUpdateResponse | { error: string; details?: any }>> {
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
        const requestBody: CharacterUpdateRequest = await request.json();

        // Send PATCH request to external API
        const response = await fetch(`${API_URL}/characters/${params.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
            cache: "no-store",
        });

        // Handle response
        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to update character", details: await response.text() },
                { status: response.status }
            );
        }

        // Parse response
        const data: CharacterUpdateResponse = await response.json();

        // Return response
        return NextResponse.json(data);
    } catch (error) {
        // Handle error
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse<CharacterDeleteResponse | { error: string; details?: any }>> {
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

        // Send DELETE request to external API
        const response = await fetch(`${API_URL}/characters/${params.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to delete character", details: await response.text() },
                { status: response.status }
            );
        }

        return NextResponse.json({ message: "Character deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}
