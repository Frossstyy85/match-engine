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
import { saveProfileLanguages } from './actions'

export default function ProfileLanguagesForm({ id }) {
  const anchor = useComboboxAnchor()
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [state, formAction, isPending] = useActionState(saveProfileLanguages, { status: null, message: '' })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data: profile } = await supabase.from('profiles').select('id').eq('auth_id', id).maybeSingle()
      if (cancelled || !profile) {
        if (!cancelled) setLoaded(true)
        return
      }
      const [langsRes, linkRes] = await Promise.all([
        supabase.from('languages').select('id, name').order('name', { ascending: true }),
        supabase.from('profile_languages').select('languages(name)').eq('profile_id', profile.id)
      ])
      if (cancelled) return
      const langRows = (langsRes.data ?? []).filter((r) => r.id != null && r.name)
      const names = (linkRes.data ?? []).map((r) => r.languages?.name).filter(Boolean)
      setOptions(langRows)
      setSelected(names)
      setLoaded(true)
    })()
    return () => { cancelled = true }
  }, [id])

  const languageNames = useMemo(() => options.map((l) => l.name), [options])

  if (!loaded) return <p className="text-muted-foreground text-sm">Loading languages…</p>
  if (loaded && options.length === 0 && selected.length === 0) return <p className="text-muted-foreground text-sm">Profile not found.</p>

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="auth_id" value={id ?? ''} />
      {selected.map((name) => (
        <input key={name} type="hidden" name="language_names" value={name} />
      ))}
      <Field>
        <FieldTitle>Languages</FieldTitle>
        <Combobox multiple autoHighlight items={languageNames} value={selected} onValueChange={setSelected}>
          <ComboboxChips ref={anchor} className="w-full max-w-md min-w-0">
            <ComboboxValue>
              {(values) => (
                <>
                  {values.map((value) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput placeholder="Search languages…" />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>No languages found.</ComboboxEmpty>
            <ComboboxList>
              {options.map((lang) => (
                <ComboboxItem key={lang.id} value={lang.name}>{lang.name}</ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : 'Save languages'}
        </Button>
        {state?.status === 'error' && <p className="text-destructive text-sm">{state.message}</p>}
        {state?.status === 'success' && <p className="text-emerald-600 text-sm">{state.message}</p>}
      </div>
    </form>
  )
}
