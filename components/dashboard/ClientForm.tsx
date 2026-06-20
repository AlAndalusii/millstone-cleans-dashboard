'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Client } from '@/lib/types'

interface ClientFormProps {
  open: boolean
  onClose: () => void
  onSave: (client: Omit<Client, 'id'> & { id?: string }) => void
  editingClient: Client | null
}

const emptyForm = {
  companyName: '',
  managerName: '',
  phone: '',
  cleaningDate: '',
  collectionDate: '',
  contractor: '',
  notes: '',
  completed: false,
}

export function ClientForm({ open, onClose, onSave, editingClient }: ClientFormProps) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({})

  useEffect(() => {
    if (editingClient) {
      setForm({
        companyName: editingClient.companyName,
        managerName: editingClient.managerName,
        phone: editingClient.phone,
        cleaningDate: editingClient.cleaningDate,
        collectionDate: editingClient.collectionDate,
        contractor: editingClient.contractor,
        notes: editingClient.notes,
        completed: editingClient.completed,
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [editingClient, open])

  function validate() {
    const newErrors: Partial<typeof emptyForm> = {}
    if (!form.companyName.trim()) newErrors.companyName = 'Required'
    if (!form.managerName.trim()) newErrors.managerName = 'Required'
    if (!form.phone.trim()) newErrors.phone = 'Required'
    if (!form.cleaningDate) newErrors.cleaningDate = 'Required'
    if (!form.collectionDate) newErrors.collectionDate = 'Required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onSave(editingClient ? { ...form, id: editingClient.id } : form)
    onClose()
  }

  function set(field: keyof typeof emptyForm, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof typeof emptyForm]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg font-sans">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            {editingClient ? 'Edit Client Record' : 'Add New Client'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-4 py-2">
            {/* Company Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="companyName" className="text-sm font-medium text-foreground">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="companyName"
                placeholder="e.g. The Grand Hotel"
                value={form.companyName}
                onChange={e => set('companyName', e.target.value)}
                aria-invalid={!!errors.companyName}
                className={errors.companyName ? 'border-destructive' : ''}
              />
              {errors.companyName && (
                <p className="text-xs text-destructive">{errors.companyName}</p>
              )}
            </div>

            {/* Two columns: Manager + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="managerName" className="text-sm font-medium text-foreground">
                  Manager Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="managerName"
                  placeholder="e.g. Sarah Mitchell"
                  value={form.managerName}
                  onChange={e => set('managerName', e.target.value)}
                  aria-invalid={!!errors.managerName}
                  className={errors.managerName ? 'border-destructive' : ''}
                />
                {errors.managerName && (
                  <p className="text-xs text-destructive">{errors.managerName}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. 07891 234567"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  aria-invalid={!!errors.phone}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Two columns: Cleaning Date + Collection Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cleaningDate" className="text-sm font-medium text-foreground">
                  Cleaning Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cleaningDate"
                  type="date"
                  value={form.cleaningDate}
                  onChange={e => set('cleaningDate', e.target.value)}
                  aria-invalid={!!errors.cleaningDate}
                  className={errors.cleaningDate ? 'border-destructive' : ''}
                />
                {errors.cleaningDate && (
                  <p className="text-xs text-destructive">{errors.cleaningDate}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="collectionDate" className="text-sm font-medium text-foreground">
                  Collection Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="collectionDate"
                  type="date"
                  value={form.collectionDate}
                  onChange={e => set('collectionDate', e.target.value)}
                  aria-invalid={!!errors.collectionDate}
                  className={errors.collectionDate ? 'border-destructive' : ''}
                />
                {errors.collectionDate && (
                  <p className="text-xs text-destructive">{errors.collectionDate}</p>
                )}
              </div>
            </div>

            {/* Bin Contractor (optional) */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contractor" className="text-sm font-medium text-foreground">
                Bin Contractor{' '}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="contractor"
                placeholder="e.g. Biffa, Veolia, Suez…"
                value={form.contractor}
                onChange={e => set('contractor', e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes" className="text-sm font-medium text-foreground">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Access codes, bin quantities, special instructions..."
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Completed toggle (only show when editing) */}
            {editingClient && (
              <div className="flex items-center gap-2">
                <input
                  id="completed"
                  type="checkbox"
                  checked={form.completed}
                  onChange={e => set('completed', e.target.checked)}
                  className="size-4 rounded accent-[var(--accent)]"
                />
                <Label htmlFor="completed" className="text-sm font-medium text-foreground cursor-pointer">
                  Mark as Completed
                </Label>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {editingClient ? 'Save Changes' : 'Add Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
