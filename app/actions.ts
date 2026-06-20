'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SESSION_COOKIE } from '@/lib/session'
import type { Client } from '@/lib/types'

function toRow(data: Omit<Client, 'id'>) {
  return {
    company_name: data.companyName,
    manager_name: data.managerName,
    phone: data.phone,
    cleaning_date: data.cleaningDate,
    collection_date: data.collectionDate,
    contractor: data.contractor,
    notes: data.notes,
    completed: data.completed,
  }
}

export async function addBusiness(data: Omit<Client, 'id'>) {
  const supabase = createClient()
  const { error } = await supabase.from('businesses').insert(toRow(data))
  if (error) throw new Error(error.message)
  revalidatePath('/')
}

export async function updateBusiness(id: string, data: Omit<Client, 'id'>) {
  const supabase = createClient()
  const { error } = await supabase.from('businesses').update(toRow(data)).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
}

export async function deleteBusiness(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('businesses').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect('/login')
}
