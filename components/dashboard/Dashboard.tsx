'use client'

import Image from 'next/image'
import { useState, useMemo, useTransition, useEffect } from 'react'
import { Plus, Search, Trash2, Building2, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ClientForm } from '@/components/dashboard/ClientForm'
import { ClientTable } from '@/components/dashboard/ClientTable'
import { getStatus } from '@/components/dashboard/StatusBadge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { addBusiness, updateBusiness, deleteBusiness } from '@/app/actions'
import type { Client } from '@/lib/types'

interface DashboardProps {
  initialClients: Client[]
}

export function Dashboard({ initialClients }: DashboardProps) {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Sync when server revalidates and pushes fresh data
  useEffect(() => {
    setClients(initialClients)
  }, [initialClients])

  const filteredClients = useMemo(() => {
    const q = searchTerm.toLowerCase().trim()
    if (!q) return clients
    return clients.filter(
      c =>
        c.companyName.toLowerCase().includes(q) ||
        c.managerName.toLowerCase().includes(q) ||
        c.contractor.toLowerCase().includes(q) ||
        c.phone.includes(q)
    )
  }, [clients, searchTerm])

  const stats = useMemo(() => {
    const total = clients.length
    let upcoming = 0
    let overdue = 0
    let completed = 0
    for (const c of clients) {
      const s = getStatus(c.cleaningDate, c.completed)
      if (s === 'upcoming') upcoming++
      else if (s === 'overdue') overdue++
      else completed++
    }
    return { total, upcoming, overdue, completed }
  }, [clients])

  function handleSave(data: Omit<Client, 'id'> & { id?: string }) {
    startTransition(async () => {
      if (data.id) {
        await updateBusiness(data.id, data)
      } else {
        await addBusiness(data)
      }
    })
  }

  function handleEdit(client: Client) {
    setEditingClient(client)
    setIsFormOpen(true)
  }

  function handleDelete(id: string) {
    setDeletingId(id)
  }

  function confirmDelete() {
    if (!deletingId) return
    const id = deletingId
    setDeletingId(null)
    startTransition(async () => {
      await deleteBusiness(id)
    })
  }

  function openAddForm() {
    setEditingClient(null)
    setIsFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-card p-1">
              <Image
                src="/millstone-logo.svg"
                alt="Millstone Cleans logo"
                width={40}
                height={40}
                className="size-full"
              />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none text-primary-foreground">
                Millstone Cleans
              </h1>
              <p className="mt-1 text-xs font-medium uppercase tracking-widest text-accent">
                Commercial Bin Cleaning
              </p>
            </div>
          </div>
          <Button
            onClick={openAddForm}
            disabled={isPending}
            size="sm"
            className="bg-accent text-primary-foreground hover:bg-accent/90 font-semibold"
          >
            <Plus data-icon="inline-start" className="size-4" />
            Add Client
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Stats row */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={<Building2 className="size-5" />} label="Total Clients" value={stats.total} color="primary" />
          <StatCard icon={<Clock className="size-5" />} label="Upcoming" value={stats.upcoming} color="upcoming" />
          <StatCard icon={<AlertCircle className="size-5" />} label="Overdue" value={stats.overdue} color="overdue" />
          <StatCard icon={<CheckCircle2 className="size-5" />} label="Completed" value={stats.completed} color="completed" />
        </div>

        {/* Search bar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by company, manager, or phone…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <p className="text-sm text-muted-foreground shrink-0">
            {filteredClients.length} of {clients.length}{' '}
            {clients.length === 1 ? 'client' : 'clients'}
            {isPending && <span className="ml-2 opacity-60">Saving…</span>}
          </p>
        </div>

        {/* Client table */}
        <ClientTable clients={filteredClients} onEdit={handleEdit} onDelete={handleDelete} />
      </main>

      {/* Add / Edit Form */}
      <ClientForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingClient(null)
        }}
        onSave={data => {
          handleSave(data)
          setIsFormOpen(false)
          setEditingClient(null)
        }}
        editingClient={editingClient}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={open => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete client record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the client record from Supabase. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              <Trash2 data-icon="inline-start" className="size-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

type StatColor = 'primary' | 'upcoming' | 'overdue' | 'completed'

const statStyles: Record<StatColor, { bg: string; iconBg: string; icon: string; label: string }> = {
  primary: {
    bg: 'bg-card border border-border',
    iconBg: 'bg-primary/10',
    icon: 'text-primary',
    label: 'text-muted-foreground',
  },
  upcoming: {
    bg: 'bg-card border border-border',
    iconBg: 'bg-[var(--status-upcoming-bg)]',
    icon: 'text-[var(--status-upcoming-text)]',
    label: 'text-muted-foreground',
  },
  overdue: {
    bg: 'bg-card border border-border',
    iconBg: 'bg-[var(--status-overdue-bg)]',
    icon: 'text-[var(--status-overdue-text)]',
    label: 'text-muted-foreground',
  },
  completed: {
    bg: 'bg-card border border-border',
    iconBg: 'bg-[var(--status-completed-bg)]',
    icon: 'text-[var(--status-completed-text)]',
    label: 'text-muted-foreground',
  },
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: StatColor
}) {
  const styles = statStyles[color]
  return (
    <div className={`flex items-center gap-3 rounded-xl p-4 ${styles.bg}`}>
      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${styles.iconBg} ${styles.icon}`}>
        {icon}
      </div>
      <div>
        <p className={`text-xs font-medium ${styles.label}`}>{label}</p>
        <p className="text-2xl font-bold text-foreground leading-none mt-0.5">{value}</p>
      </div>
    </div>
  )
}
