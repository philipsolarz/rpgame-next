"use client"
import { login, signup } from '@/app/actions'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Github } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
    const [isOpen, setIsOpen] = useState(false);
    // State for sign in form
    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    // State for sign up form
    const [signUpEmail, setSignUpEmail] = useState("")
    const [signUpPassword, setSignUpPassword] = useState("")
    const [signUpFirstName, setSignUpFirstName] = useState("")
    const [signUpLastName, setSignUpLastName] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")


    const handleSignIn = async () => {
        try {
            await login({ email: signInEmail, password: signInPassword });
            setIsOpen(false); // Optionally close the dialog on success
        } catch (error) {
            console.error("Error during sign in:", error);
            // Optionally show an error message to the user
        }
    };

    const handleSignUp = async () => {
        try {
            // Handle password confirmation
            // if (signUpPassword !== confirmPassword
            //     || !signUpPassword
            //     || !confirmPassword
            //     || !signUpEmail
            //     || !signUpFirstName
            //     || !signUpLastName) {
            //     console.error("Password mismatch or empty fields");
            //     // Optionally show an error message to the user
            //     return;
            // }

            await signup({ email: signUpEmail, password: signUpPassword, firstName: signUpFirstName, lastName: signUpLastName });
            setIsOpen(false);
        } catch (error) {
            console.log("Error during sign up:", error);
            // Optionally show an error message to the user
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/80 to-muted/50">
            <main className="flex-1 flex items-center justify-center">
                <section className="container px-4 py-12 md:py-24 text-center">
                    <Badge className="mb-4 rounded-md px-3 py-1 inline-flex">✨ Welcome to RoleplayAI</Badge>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                        Chat with AI Characters
                    </h1>
                    <p className="mx-auto mt-6 max-w-[600px] text-muted-foreground md:text-xl">
                        Explore endless conversations with unique AI personalities. From mystical wizards to space explorers.
                    </p>
                    <div className="mt-8 flex flex-col items-center gap-4">
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="text-lg px-8">
                                    Get Started Now <Sparkles className="ml-2 h-5 w-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Start Your Journey</DialogTitle>
                                    <DialogDescription>Select Your Preferred Sign-In Method</DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Button
                                            variant="outline"
                                            className="relative overflow-hidden group hover:border-primary"
                                            onClick={() => (window.location.href = "/api/auth/google")}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                                <path
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    fill="#4285F4"
                                                />
                                                <path
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    fill="#34A853"
                                                />
                                                <path
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                    fill="#FBBC05"
                                                />
                                                <path
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                    fill="#EA4335"
                                                />
                                            </svg>
                                            Continue with Google
                                        </Button>
                                        {/* <Button
                      variant="outline"
                      className="relative overflow-hidden group hover:border-primary"
                      onClick={() => (window.location.href = "/api/auth/github")}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Github className="mr-2 h-5 w-5" />
                      Continue with GitHub
                    </Button> */}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-muted-foreground">Or use email</span>
                                        </div>
                                    </div>
                                    <Tabs defaultValue="signin" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="signin">Sign In</TabsTrigger>
                                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="signin" className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="email-signin">Email</Label>
                                                <Input
                                                    id="email-signin"
                                                    type="email"
                                                    placeholder="hello@example.com"
                                                    value={signInEmail}
                                                    onChange={(e) => setSignInEmail(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="password-signin">Password</Label>
                                                <Input
                                                    id="password-signin"
                                                    type="password"
                                                    value={signInPassword}
                                                    onChange={(e) => setSignInPassword(e.target.value)}
                                                />
                                            </div>
                                            <Button className="w-full" onClick={handleSignIn}>
                                                Sign In
                                            </Button>
                                        </TabsContent>
                                        <TabsContent value="signup" className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="firstname-signup">First Name</Label>
                                                    <Input
                                                        id="firstname-signup"
                                                        placeholder="John"
                                                        value={signUpFirstName}
                                                        onChange={(e) => setSignUpFirstName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="lastname-signup">Last Name</Label>
                                                    <Input
                                                        id="lastname-signup"
                                                        placeholder="Doe"
                                                        value={signUpLastName}
                                                        onChange={(e) => setSignUpLastName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email-signup">Email</Label>
                                                <Input
                                                    id="email-signup"
                                                    type="email"
                                                    placeholder="hello@example.com"
                                                    value={signUpEmail}
                                                    onChange={(e) => setSignUpEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="password-signup">Password</Label>
                                                <Input
                                                    id="password-signup"
                                                    type="password"
                                                    value={signUpPassword}
                                                    onChange={(e) => setSignUpPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                                <Input
                                                    id="confirm-password"
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <Button className="w-full" onClick={handleSignUp}>
                                                Create Account
                                            </Button>
                                        </TabsContent>
                                        {/* <TabsContent value="signup" className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="email-signup">Email</Label>
                                                <Input
                                                    id="email-signup"
                                                    type="email"
                                                    placeholder="hello@example.com"
                                                    value={signUpEmail}
                                                    onChange={(e) => setSignUpEmail(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="password-signup">Password</Label>
                                                <Input
                                                    id="password-signup"
                                                    type="password"
                                                    value={signUpPassword}
                                                    onChange={(e) => setSignUpPassword(e.target.value)}
                                                />
                                            </div>
                                            <Button className="w-full" onClick={handleSignUp}>
                                                Create Account
                                            </Button>
                                        </TabsContent> */}
                                    </Tabs>
                                    {/* <div className="text-center">
                                        <Link
                                            href="/chat"
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            Try as guest with limited access
                                        </Link>
                                    </div> */}
                                </div>
                            </DialogContent>
                        </Dialog>
                        <p className="text-sm text-muted-foreground">No credit card required</p>
                    </div>
                </section>
            </main>
            {/* 
      <footer className="border-t">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full items-center justify-center flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} RoleplayAI. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Terms
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer> */}
        </div>
    )
}
