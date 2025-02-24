import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar"
import { MainNav } from "@/components/main-navbar"
import { TopBar } from '@/components/top-bar';
import { createClient } from '@/utils/supabase/server'
import LandingPage from '@/components/landing-page';
import { headers } from 'next/headers';
import { User, UserResponse } from "@/types";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return (
      <html lang="en">
        <body>
          <LandingPage />
        </body>
      </html>
    );
  }

  const cookieHeader = (await headers()).get("cookie");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/api/users/${userData.user.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader || "",
      },
      cache: "no-store"
    }
  );
  const userResponse: UserResponse = await response.json();
  const user: User = userResponse.user;

  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <div className="flex min-h-screen flex-col w-full">
            <TopBar user={user} />
            <div className="flex-1 flex">
              <MainNav />
              {children}
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html >
  );
}