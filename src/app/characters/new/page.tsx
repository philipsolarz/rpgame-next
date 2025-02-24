// import { CharacterForm } from "@/components/character-creation"
// import api from "@/lib/api"

// export default async function NewCharacterPage() {

//     const rolesData = await api.characterRoles.listRoles()
//     const tagsData = await api.characterTags.listTags()

//     const predefinedRoles = rolesData.map(role => ({
//         label: role.role,
//         value: role.id,
//     }))

//     const predefinedTags = tagsData.map(tag => ({
//         label: tag.name,
//         value: tag.id,
//     }))

//     return (
//         <div className="container py-10">
//             <div className="mb-8">
//                 <h1 className="text-3xl font-bold tracking-tight">Create Your Character</h1>
//                 <p className="text-muted-foreground mt-2">
//                     Build your character&apos;s identity through a series of choices and descriptions.
//                 </p>
//             </div>
//             <CharacterForm predefinedRoles={predefinedRoles} predefinedTags={predefinedTags} />
//         </div>
//     )
// }


import { CharacterForm } from "@/components/character-creation/character-form"
import { User, UserResponse } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export default async function CharacterCreationPage() {
    const supabase = await createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
        return null;
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
        <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold">Create Your Character</h1>
            <p className="text-muted-foreground">Fill in the details to bring your character to life.</p>
            <div className="p-6">
                <CharacterForm user={user} />
            </div>
        </div>
        // <div className="min-h-screen bg-background">
        //     <div className="container max-w-3xl py-10 md:py-16 lg:py-20">
        //         <div className="mb-8 space-y-2">
        //             <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Create Your Character</h1>
        //             <p className="text-muted-foreground">Fill in the details to bring your character to life.</p>
        //         </div>
        //         <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:p-8">
        //             <CharacterForm />
        //         </div>
        //     </div>
        // </div>
    )
}

