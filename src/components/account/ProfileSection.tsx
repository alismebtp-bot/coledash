import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FormField from './FormField'
import { useAuth } from '@/store/auth'
import type { User } from '@/types'
import { formatDate } from '@/lib/format'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/

type Fields = Pick<User, 'firstName' | 'lastName' | 'email' | 'phone'>

export default function ProfileSection({ user }: { user: User }) {
  const updateProfile = useAuth((s) => s.updateProfile)
  const [form, setForm] = useState<Fields>({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone })
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const dirty = (Object.keys(form) as (keyof Fields)[]).some((k) => form[k] !== user[k])

  const set = (k: keyof Fields) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!form.firstName.trim()) errs.firstName = 'Indiquez votre prénom.'
    if (!EMAIL_RE.test(form.email.trim())) errs.email = 'Adresse e-mail invalide.'
    if (form.phone.trim() && !PHONE_RE.test(form.phone.trim())) errs.phone = 'Format attendu : 06 12 34 56 78.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    updateProfile({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
    })
    toast.success('Profil mis à jour')
  }

  const fields: { k: keyof Fields; label: string; type?: string; auto: string; placeholder?: string }[] = [
    { k: 'firstName', label: 'Prénom', auto: 'given-name' },
    { k: 'lastName', label: 'Nom', auto: 'family-name' },
    { k: 'email', label: 'Adresse e-mail', type: 'email', auto: 'email' },
    { k: 'phone', label: 'Téléphone', type: 'tel', auto: 'tel', placeholder: '06 12 34 56 78' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 font-display text-2xl font-bold text-white">
          {(user.firstName[0] ?? '') + (user.lastName[0] ?? '')}
        </span>
        <div>
          <p className="text-lg font-semibold text-ink">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-muted-foreground">Client depuis le {formatDate(user.createdAt, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
      <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <FormField key={f.k} id={`profile-${f.k}`} label={f.label} error={errors[f.k]}>
            <Input
              id={`profile-${f.k}`}
              type={f.type ?? 'text'}
              autoComplete={f.auto}
              placeholder={f.placeholder}
              value={form[f.k]}
              onChange={(e) => set(f.k)(e.target.value)}
              aria-invalid={!!errors[f.k]}
              aria-describedby={`profile-${f.k}-msg`}
            />
          </FormField>
        ))}
        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit" variant="ink" disabled={!dirty}>
            Enregistrer
          </Button>
          {dirty && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone })
                setErrors({})
              }}
            >
              Annuler
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
