'use client'

import { Pencil, Trash2, Phone, Building2, User, CalendarDays, Truck, FileText, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge, getStatus } from '@/components/dashboard/StatusBadge'
import type { Client } from '@/lib/types'

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

interface ClientTableProps {
  clients: Client[]
  onEdit: (client: Client) => void
  onDelete: (id: string) => void
}

export function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
        <Building2 className="mb-3 size-10 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">No clients found</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Add your first client record using the button above.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/60">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Manager
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Cleaning Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Collection Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Contractor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Notes
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map(client => {
                const status = getStatus(client.cleaningDate, client.completed)
                return (
                  <tr
                    key={client.id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-foreground">{client.companyName}</span>
                    </td>
                    <td className="px-4 py-3.5 text-foreground">{client.managerName}</td>
                    <td className="px-4 py-3.5">
                      <a
                        href={`tel:${client.phone}`}
                        className="text-foreground hover:text-accent transition-colors"
                      >
                        {client.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3.5 text-foreground">{formatDate(client.cleaningDate)}</td>
                    <td className="px-4 py-3.5 text-foreground">{formatDate(client.collectionDate)}</td>
                    <td className="px-4 py-3.5">
                      {client.contractor ? (
                        <span className="text-foreground">{client.contractor}</span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-4 py-3.5 max-w-[180px]">
                      {client.notes ? (
                        <span
                          className="block truncate text-muted-foreground"
                          title={client.notes}
                        >
                          {client.notes}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(client)}
                          aria-label={`Edit ${client.companyName}`}
                          className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(client.id)}
                          aria-label={`Delete ${client.companyName}`}
                          className="size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {clients.map(client => {
          const status = getStatus(client.cleaningDate, client.completed)
          return (
            <div
              key={client.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">{client.companyName}</p>
                  <StatusBadge status={status} className="mt-1" />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(client)}
                    aria-label={`Edit ${client.companyName}`}
                    className="size-8 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(client.id)}
                    aria-label={`Delete ${client.companyName}`}
                    className="size-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="size-3.5 shrink-0" />
                  <span>{client.managerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-3.5 shrink-0" />
                  <a href={`tel:${client.phone}`} className="hover:text-accent transition-colors">
                    {client.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-3.5 shrink-0" />
                  <span>Cleaning: {formatDate(client.cleaningDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="size-3.5 shrink-0" />
                  <span>Collection: {formatDate(client.collectionDate)}</span>
                </div>
                {client.contractor && (
                  <div className="flex items-center gap-2">
                    <Wrench className="size-3.5 shrink-0" />
                    <span>Contractor: {client.contractor}</span>
                  </div>
                )}
                {client.notes && (
                  <div className="flex items-start gap-2">
                    <FileText className="size-3.5 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{client.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
