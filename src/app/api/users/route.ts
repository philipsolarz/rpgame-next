import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { UsersResponse, UserCreateRequest, UserCreateResponse } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest): Promise<NextResponse<UsersResponse | { error: string; details?: any }>> {
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

        // Extract query parameters
        const searchParams = request.nextUrl.searchParams;
        const queryParams = new URLSearchParams(searchParams).toString();

        // Fetch users from external API
        const response = await fetch(`${API_URL}/users?${queryParams}`, {
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
                { error: "Failed to fetch users", details: await response.text() },
                { status: response.status }
            );
        }

        // Parse response
        const data: UsersResponse = await response.json();

        // Return response
        return NextResponse.json(data);
    } catch (error) {
        // Handle error
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}

export async function POST(request: NextRequest): Promise<NextResponse<UserCreateResponse | { error: string; details?: any }>> {
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
        const requestBody: UserCreateRequest = await request.json();

        // Send POST request to external API
        const response = await fetch(`${API_URL}/users`, {
            method: "POST",
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
                { error: "Failed to create user", details: await response.text() },
                { status: response.status }
            );
        }

        // Parse response
        const data: UserCreateResponse = await response.json();

        // Return response
        return NextResponse.json(data);
    } catch (error) {
        // Handle error
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}
