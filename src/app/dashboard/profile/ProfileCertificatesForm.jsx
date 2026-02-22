'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor
} from '@/components/ui/combobox'
import { Button } from '@/components/ui/button'
import { Field, FieldTitle } from '@/components/ui/field'
import { supabase } from '@/lib/supabase/client'
import { saveProfileCertificates } from './actions'

export default function ProfileCertificatesForm({ id }) {
  const anchor = useComboboxAnchor()
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [state, formAction, isPending] = useActionState(saveProfileCertificates, { status: null, message: '' })

  const [profileFound, setProfileFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data: profile } = await supabase.from('profiles').select('id').eq('auth_id', id).maybeSingle()
      if (cancelled) {
        setLoaded(true)
        return
      }
      if (!profile) {
        setProfileFound(false)
        setLoaded(true)
        return
      }
      setProfileFound(true)
      const [certsRes, linkRes] = await Promise.all([
        supabase.from('certificates').select('id, name').order('name', { ascending: true }),
        supabase.from('profile_certificates').select('certificates(name)').eq('profile_id', profile.id)
      ])
      if (cancelled) return
      const certRows = (certsRes.data ?? []).filter((r) => r.id != null && r.name)
      const names = (linkRes.data ?? []).map((r) => r.certificates?.name ?? r.certificate?.name).filter(Boolean)
      setOptions(certRows)
      setSelected(names)
      setLoaded(true)
    })()
    return () => { cancelled = true }
  }, [id])

  const certificateNames = useMemo(() => options.map((c) => c.name), [options])

  if (!loaded) return <p className="text-muted-foreground text-sm">Loading certificates…</p>
  if (loaded && !profileFound) return <p className="text-muted-foreground text-sm">Profile not found.</p>

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="auth_id" value={id} />
      {selected.map((name) => (
        <input key={name} type="hidden" name="certificate_names" value={name} />
      ))}
      <Field>
        <FieldTitle>Certificates</FieldTitle>
        <Combobox multiple autoHighlight items={certificateNames} value={selected} onValueChange={setSelected}>
          <ComboboxChips ref={anchor} className="w-full max-w-md min-w-0">
            <ComboboxValue>
              {(values) => (
                <>
                  {values.map((value) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput placeholder="Search certificates…" />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>No certificates found.</ComboboxEmpty>
            <ComboboxList>
              {options.map((cert) => (
                <ComboboxItem key={cert.id} value={cert.name}>{cert.name}</ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : 'Save certificates'}
        </Button>
        {state?.status === 'error' && <p className="text-destructive text-sm">{state.message}</p>}
        {state?.status === 'success' && <p className="text-emerald-600 text-sm">{state.message}</p>}
      </div>
    </form>
  )
}
