'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

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
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldTitle } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase/client'
import { formatDateForInput } from '@/lib/helpers/date'
import { createProject } from '@/lib/db/projects'

export default function CreateProjectForm() {
  const router = useRouter()
  const dialogContentRef = useRef(null)
  const anchorSkills = useComboboxAnchor()
  const anchorLanguages = useComboboxAnchor()
  const anchorCertificates = useComboboxAnchor()
  const [skillsOpen, setSkillsOpen] = useState(false)
  const [languagesOpen, setLanguagesOpen] = useState(false)
  const [certificatesOpen, setCertificatesOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [saving, setSaving] = useState(false)

  const [availableSkills, setAvailableSkills] = useState([])
  const [availableLanguages, setAvailableLanguages] = useState([])
  const [availableCertificates, setAvailableCertificates] = useState([])

  const [selectedSkills, setSelectedSkills] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [selectedCertificates, setSelectedCertificates] = useState([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [skillsRes, languagesRes, certificatesRes] = await Promise.all([
        supabase.from('skills').select('id, name').order('name', { ascending: true }),
        supabase.from('languages').select('id, name').order('name', { ascending: true }),
        supabase.from('certificates').select('id, name').order('name', { ascending: true })
      ])
      if (cancelled) return
      setAvailableSkills((skillsRes.data ?? []).filter((r) => r.id != null && r.name))
      setAvailableLanguages((languagesRes.data ?? []).filter((r) => r.id != null && r.name))
      setAvailableCertificates((certificatesRes.data ?? []).filter((r) => r.id != null && r.name))
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const skillNames = useMemo(() => availableSkills.map((s) => s.name), [availableSkills])
  const languageNames = useMemo(() => availableLanguages.map((l) => l.name), [availableLanguages])
  const certificateNames = useMemo(() => availableCertificates.map((c) => c.name), [availableCertificates])

  async function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    setSaving(true)
    try {
      const projectId = await createProject({
        name: formData.get('name'),
        description: formData.get('description'),
        startDate: formatDateForInput(startDate) || null,
        endDate: formatDateForInput(endDate) || null,
        skillNames: selectedSkills,
        languageNames: selectedLanguages,
        certificateNames: selectedCertificates
      })

      setOpen(false)
      setStartDate(undefined)
      setEndDate(undefined)
      setSelectedSkills([])
      setSelectedLanguages([])
      setSelectedCertificates([])

      if (projectId) {
        router.push(`/dashboard/projects/${projectId}`)
      } else {
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='w-fit'>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (!nextOpen) {
            setSkillsOpen(false)
            setLanguagesOpen(false)
            setCertificatesOpen(false)
          }
        }}
      >
        <DialogTrigger asChild>
          <Button size='sm'>Create new</Button>
        </DialogTrigger>

        <DialogContent ref={dialogContentRef}>
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input type='hidden' name='start_date' value={formatDateForInput(startDate)} />
            <input type='hidden' name='end_date' value={formatDateForInput(endDate)} />

            <FieldGroup>
              <Field>
                <FieldTitle>Project name (required)</FieldTitle>
                <Input name='name' placeholder='project x' required />
              </Field>

              <Field>
                <FieldTitle>Description</FieldTitle>
                <Textarea name='description' placeholder='Optional description' rows={3} />
              </Field>

              <FieldGroup className='flex flex-col gap-4 sm:flex-row sm:gap-6'>
                <Field>
                  <FieldTitle>Start date</FieldTitle>
                  <DatePicker value={startDate} onSelect={setStartDate} />
                </Field>
                <Field>
                  <FieldTitle>End date</FieldTitle>
                  <DatePicker value={endDate} onSelect={setEndDate} />
                </Field>
              </FieldGroup>

              <Field>
                <FieldTitle>Required skills</FieldTitle>
                <Combobox
                  multiple
                  autoHighlight
                  items={skillNames}
                  value={selectedSkills}
                  onValueChange={(values) => {
                    setSelectedSkills(values)
                    setSkillsOpen(true)
                  }}
                  open={skillsOpen}
                  onOpenChange={setSkillsOpen}
                >
                  <ComboboxChips ref={anchorSkills} className='w-full max-w-md min-w-0'>
                    <ComboboxValue>
                      {(values) => (
                        <>
                          {values.map((value) => (
                            <ComboboxChip key={value}>{value}</ComboboxChip>
                          ))}
                          <ComboboxChipsInput placeholder='Search skills…' />
                        </>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchorSkills} container={dialogContentRef}>
                    <ComboboxEmpty>No skills found.</ComboboxEmpty>
                    <ComboboxList>
                      {availableSkills.map((skill) => (
                        <ComboboxItem key={skill.id} value={skill.name}>
                          {skill.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>

              <Field>
                <FieldTitle>Required languages</FieldTitle>
                <Combobox
                  multiple
                  autoHighlight
                  items={languageNames}
                  value={selectedLanguages}
                  onValueChange={(values) => {
                    setSelectedLanguages(values)
                    setLanguagesOpen(true)
                  }}
                  open={languagesOpen}
                  onOpenChange={setLanguagesOpen}
                >
                  <ComboboxChips ref={anchorLanguages} className='w-full max-w-md min-w-0'>
                    <ComboboxValue>
                      {(values) => (
                        <>
                          {values.map((value) => (
                            <ComboboxChip key={value}>{value}</ComboboxChip>
                          ))}
                          <ComboboxChipsInput placeholder='Search languages…' />
                        </>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchorLanguages} container={dialogContentRef}>
                    <ComboboxEmpty>No languages found.</ComboboxEmpty>
                    <ComboboxList>
                      {availableLanguages.map((lang) => (
                        <ComboboxItem key={lang.id} value={lang.name}>
                          {lang.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>

              <Field>
                <FieldTitle>Required certificates</FieldTitle>
                <Combobox
                  multiple
                  autoHighlight
                  items={certificateNames}
                  value={selectedCertificates}
                  onValueChange={(values) => {
                    setSelectedCertificates(values)
                    setCertificatesOpen(true)
                  }}
                  open={certificatesOpen}
                  onOpenChange={setCertificatesOpen}
                >
                  <ComboboxChips ref={anchorCertificates} className='w-full max-w-md min-w-0'>
                    <ComboboxValue>
                      {(values) => (
                        <>
                          {values.map((value) => (
                            <ComboboxChip key={value}>{value}</ComboboxChip>
                          ))}
                          <ComboboxChipsInput placeholder='Search certificates…' />
                        </>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchorCertificates} container={dialogContentRef}>
                    <ComboboxEmpty>No certificates found.</ComboboxEmpty>
                    <ComboboxList>
                      {availableCertificates.map((cert) => (
                        <ComboboxItem key={cert.id} value={cert.name}>
                          {cert.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
            </FieldGroup>

            <Button type='submit' disabled={saving}>
              {saving ? 'Creating...' : 'Create'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
