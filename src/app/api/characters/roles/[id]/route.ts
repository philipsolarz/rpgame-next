import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
    CharacterRoleResponse,
    CharacterRoleUpdateRequest,
    CharacterRoleUpdateResponse,
    CharacterRoleDeleteResponse
} from "@/types/character";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse<CharacterRoleResponse | { error: string; details?: any }>> {
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

        const { id } = await params;

        const response = await fetch(`${API_URL}/characters/roles/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch role", details: await response.text() },
                { status: response.status }
            );
        }

        const data: CharacterRoleResponse = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse<CharacterRoleUpdateResponse | { error: string; details?: any }>> {
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
        const requestBody: CharacterRoleUpdateRequest = await request.json();

        const response = await fetch(`${API_URL}/characters/roles/${params.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to update role", details: await response.text() },
                { status: response.status }
            );
        }

        const data: CharacterRoleUpdateResponse = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse<CharacterRoleDeleteResponse | { error: string; details?: any }>> {
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

        const response = await fetch(`${API_URL}/characters/roles/${params.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to delete role", details: await response.text() },
                { status: response.status }
            );
        }

        return NextResponse.json({ message: "Role deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}
