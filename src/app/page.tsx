// app/page.tsx
import LandingPage from '@/components/landing-page';
// import AuthenticatedHomePage from '../components/AuthenticatedHomePage';
import { createClient } from '@/utils/supabase/server'
import { TopBar } from '@/components/top-bar';

export default async function HomePage() {
  // const supabase = await createClient()
  // const { data, error } = await supabase.auth.getUser()
  // const testuser = {
  //   name: "John Doe",
  //   email: "john@example.com",
  //   accountType: "free",
  // } as const
  // if (error || !data?.user) {
  //   return <LandingPage />;
  // }

  // return <div><TopBar user={testuser} />Logged in</div>
  return <div></div>
}
