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
import { saveProfileSkills } from './actions'

export default function ProfileSkillsForm({ id }) {
  const anchor = useComboboxAnchor()
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [state, formAction, isPending] = useActionState(saveProfileSkills, { status: null, message: '' })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data: profile } = await supabase.from('profiles').select('id').eq('auth_id', id).maybeSingle()
      if (cancelled || !profile) {
        if (!cancelled) setLoaded(true)
        return
      }
      const [skillsRes, linkRes] = await Promise.all([
        supabase.from('skills').select('id, name').order('name', { ascending: true }),
        supabase.from('profile_skills').select('skills(name)').eq('profile_id', profile.id)
      ])
      if (cancelled) return
      const skillRows = (skillsRes.data ?? []).filter((r) => r.id != null && r.name)
      const names = (linkRes.data ?? []).map((r) => r.skills?.name).filter(Boolean)
      setOptions(skillRows)
      setSelected(names)
      setLoaded(true)
    })()
    return () => { cancelled = true }
  }, [id])

  const skillNames = useMemo(() => options.map((s) => s.name), [options])

  if (!loaded) return <p className="text-muted-foreground text-sm">Loading skills…</p>
  if (loaded && options.length === 0 && selected.length === 0) return <p className="text-muted-foreground text-sm">Profile not found.</p>

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="auth_id" value={id} />
      {selected.map((name) => (
        <input key={name} type="hidden" name="skill_names" value={name} />
      ))}
      <Field>
        <FieldTitle>Skills</FieldTitle>
        <Combobox multiple autoHighlight items={skillNames} value={selected} onValueChange={setSelected}>
          <ComboboxChips ref={anchor} className="w-full max-w-md min-w-0">
            <ComboboxValue>
              {(values) => (
                <>
                  {values.map((value) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput placeholder="Search skills…" />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>No skills found.</ComboboxEmpty>
            <ComboboxList>
              {options.map((skill) => (
                <ComboboxItem key={skill.id} value={skill.name}>{skill.name}</ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : 'Save skills'}
        </Button>
        {state?.status === 'error' && <p className="text-destructive text-sm">{state.message}</p>}
        {state?.status === 'success' && <p className="text-emerald-600 text-sm">{state.message}</p>}
      </div>
    </form>
  )
}
