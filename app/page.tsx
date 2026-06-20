import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/session'
import { createClient } from '@/lib/supabase/server'
import { Dashboard } from '@/components/dashboard/Dashboard'
import type { Client } from '@/lib/types'

export default async function Page() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)?.value
  if (!session || !verifySessionToken(session)) redirect('/login')

  const supabase = createClient()
  const { data: rows } = await supabase
    .from('businesses')
    .select('*')
    .order('cleaning_date', { ascending: true })

  const clients: Client[] = (rows ?? []).map(b => ({
    id: b.id as string,
    companyName: b.company_name as string,
    managerName: b.manager_name as string,
    phone: b.phone as string,
    cleaningDate: b.cleaning_date as string,
    collectionDate: b.collection_date as string,
    contractor: (b.contractor ?? '') as string,
    notes: (b.notes ?? '') as string,
    completed: b.completed as boolean,
  }))

  return <Dashboard initialClients={clients} />
}
