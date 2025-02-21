'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login({ email, password }: { email: string, password: string }) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup({ email, password, firstName, lastName }: { email: string, password: string, firstName: string, lastName: string }) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({ email, password, options: { data: { first_name: firstName, last_name: lastName } } })
    // const { error } = await supabase.auth.signUp({ email: email, password: password })

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
