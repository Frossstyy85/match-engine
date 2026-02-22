'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldTitle } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { saveProfileName } from './actions'

export default function ProfileIdentityForm({ id, name = '', email = '' }) {
  const [state, formAction, isPending] = useActionState(saveProfileName, { status: null, message: '' })

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="auth_id" value={id} />
      <Field>
        <FieldTitle>Name</FieldTitle>
        <Input key={name} name="name" defaultValue={name} placeholder="Name" className="max-w-md" />
      </Field>
      <Field>
        <FieldTitle>Email</FieldTitle>
        <Input type="email" value={email} disabled className="max-w-md" aria-readonly />
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : 'Save name'}
        </Button>
        {state?.status === 'error' && <p className="text-destructive text-sm">{state.message}</p>}
        {state?.status === 'success' && <p className="text-emerald-600 text-sm">{state.message}</p>}
      </div>
    </form>
  )
}
