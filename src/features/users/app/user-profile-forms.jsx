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
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import {
  saveUserCertificates,
  saveUserLanguages,
  saveUserName,
  saveUserSkills
} from '@/app/dashboard/users/actions'

export function UserIdentityForm({ profileId, name = '', email = '' }) {
  const [state, formAction, isPending] = useActionState(saveUserName, { status: null, message: '' })

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="profile_id" value={profileId ?? ''} />
      <Field>
        <FieldTitle>Name</FieldTitle>
        <Input key={name} name="name" defaultValue={name} placeholder="Name" className="max-w-md" />
      </Field>
      <Field>
        <FieldTitle>Email</FieldTitle>
        <Input type="email" value={email ?? ''} disabled className="max-w-md" aria-readonly />
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending || !profileId}>
          {isPending ? 'Saving…' : 'Save name'}
        </Button>
        {state?.status === 'error' && <p className="text-destructive text-sm">{state.message}</p>}
        {state?.status === 'success' && <p className="text-emerald-600 text-sm">{state.message}</p>}
      </div>
    </form>
  )
}

export function UserSkillsForm({ profileId }) {
  const anchor = useComboboxAnchor()
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [state, formAction, isPending] = useActionState(saveUserSkills, { status: null, message: '' })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!profileId) {
        setLoaded(true)
        return
      }
      const [skillsRes, linkRes] = await Promise.all([
        supabase.from('skills').select('id, name').order('name', { ascending: true }),
        supabase.from('profile_skills').select('skills(name)').eq('profile_id', profileId)
      ])
      if (cancelled) return
      const skillRows = (skillsRes.data ?? []).filter((r) => r.id != null && r.name)
      const names = (linkRes.data ?? []).map((r) => r.skills?.name).filter(Boolean)
      setOptions(skillRows)
      setSelected(names)
      setLoaded(true)
    })()
    return () => {
      cancelled = true
    }
  }, [profileId])

  const skillNames = useMemo(() => options.map((s) => s.name), [options])

  if (!loaded) return <p className="text-muted-foreground text-sm">Loading skills…</p>
  if (loaded && !profileId) return <p className="text-muted-foreground text-sm">Profile not found.</p>

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="profile_id" value={profileId ?? ''} />
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
                <ComboboxItem key={skill.id} value={skill.name}>
                  {skill.name}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending || !profileId}>
          {isPending ? 'Saving…' : 'Save skills'}
        </Button>
        {state?.status === 'error' && <p className="text-destructive text-sm">{state.message}</p>}
        {state?.status === 'success' && <p className="text-emerald-600 text-sm">{state.message}</p>}
      </div>
    </form>
  )
}

export function UserCertificatesForm({ profileId }) {
  const anchor = useComboboxAnchor()
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [state, formAction, isPending] = useActionState(saveUserCertificates, { status: null, message: '' })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!profileId) {
        setLoaded(true)
        return
      }
      const [certsRes, linkRes] = await Promise.all([
        supabase.from('certificates').select('id, name').order('name', { ascending: true }),
        supabase.from('profile_certificates').select('certificates(name)').eq('profile_id', profileId)
      ])
      if (cancelled) return
      const certRows = (certsRes.data ?? []).filter((r) => r.id != null && r.name)
      const names = (linkRes.data ?? []).map((r) => r.certificates?.name ?? r.certificate?.name).filter(Boolean)
      setOptions(certRows)
      setSelected(names)
      setLoaded(true)
    })()
    return () => {
      cancelled = true
    }
  }, [profileId])

  const certificateNames = useMemo(() => options.map((c) => c.name), [options])

  if (!loaded) return <p className="text-muted-foreground text-sm">Loading certificates…</p>
  if (loaded && !profileId) return <p className="text-muted-foreground text-sm">Profile not found.</p>

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="profile_id" value={profileId ?? ''} />
      {selected.map((name) => (
        <input key={name} type="hidden" name="certificate_names" value={name} />
      ))}
      <Field>
        <FieldTitle>Certificates</FieldTitle>
        <Combobox
          multiple
          autoHighlight
          items={certificateNames}
          value={selected}
          onValueChange={setSelected}
        >
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
                <ComboboxItem key={cert.id} value={cert.name}>
                  {cert.name}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending || !profileId}>
          {isPending ? 'Saving…' : 'Save certificates'}
        </Button>
        {state?.status === 'error' && <p className="text-destructive text-sm">{state.message}</p>}
        {state?.status === 'success' && <p className="text-emerald-600 text-sm">{state.message}</p>}
      </div>
    </form>
  )
}

export function UserLanguagesForm({ profileId }) {
  const anchor = useComboboxAnchor()
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [state, formAction, isPending] = useActionState(saveUserLanguages, { status: null, message: '' })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!profileId) {
        setLoaded(true)
        return
      }
      const [langsRes, linkRes] = await Promise.all([
        supabase.from('languages').select('id, name').order('name', { ascending: true }),
        supabase.from('profile_languages').select('languages(name)').eq('profile_id', profileId)
      ])
      if (cancelled) return
      const langRows = (langsRes.data ?? []).filter((r) => r.id != null && r.name)
      const names = (linkRes.data ?? []).map((r) => r.languages?.name).filter(Boolean)
      setOptions(langRows)
      setSelected(names)
      setLoaded(true)
    })()
    return () => {
      cancelled = true
    }
  }, [profileId])

  const languageNames = useMemo(() => options.map((l) => l.name), [options])

  if (!loaded) return <p className="text-muted-foreground text-sm">Loading languages…</p>
  if (loaded && !profileId) return <p className="text-muted-foreground text-sm">Profile not found.</p>

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="profile_id" value={profileId ?? ''} />
      {selected.map((name) => (
        <input key={name} type="hidden" name="language_names" value={name} />
      ))}
      <Field>
        <FieldTitle>Languages</FieldTitle>
        <Combobox
          multiple
          autoHighlight
          items={languageNames}
          value={selected}
          onValueChange={setSelected}
        >
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
                <ComboboxItem key={lang.id} value={lang.name}>
                  {lang.name}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending || !profileId}>
          {isPending ? 'Saving…' : 'Save languages'}
        </Button>
        {state?.status === 'error' && <p className="text-destructive text-sm">{state.message}</p>}
        {state?.status === 'success' && <p className="text-emerald-600 text-sm">{state.message}</p>}
      </div>
    </form>
  )
}

