'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [digits, setDigits] = useState(['', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  useEffect(() => {
    inputRefs[0].current?.focus()
  }, [])

  async function submit(pin: string) {
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError('Incorrect PIN. Try again.')
      setDigits(['', '', ''])
      setLoading(false)
      setTimeout(() => inputRefs[0].current?.focus(), 0)
    }
  }

  function handleDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newDigits = [...digits]
    newDigits[index] = digit
    setDigits(newDigits)
    setError('')

    if (digit) {
      if (index < 2) {
        inputRefs[index + 1].current?.focus()
      }
      if (newDigits.every(d => d !== '')) {
        submit(newDigits.join(''))
      }
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xs">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary p-3 mb-4">
            <Image
              src="/millstone-logo.svg"
              alt="Millstone Cleans"
              width={48}
              height={48}
              className="size-full"
            />
          </div>
          <h1 className="text-xl font-bold text-foreground">Millstone Cleans</h1>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-1">
            Commercial Bin Cleaning
          </p>
        </div>

        {/* PIN card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
          <p className="text-sm font-semibold text-foreground mb-1">Enter your PIN</p>
          <p className="text-xs text-muted-foreground mb-6">3-digit access code</p>

          <div className="flex justify-center gap-3 mb-6">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                disabled={loading}
                className="size-14 rounded-xl border border-border bg-background text-center text-2xl font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {loading && (
            <p className="text-sm text-muted-foreground mt-2">Checking…</p>
          )}
        </div>
      </div>
    </div>
  )
}
