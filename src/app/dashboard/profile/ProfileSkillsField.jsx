'use client'

import * as React from 'react'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor
} from '@/components/ui/combobox'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { supabase } from '@/lib/supabase/client'

export default function ProfileSkillsField({ profileId, initialValue = [], options = [], disabled = false, onSaved }) {
  const anchor = useComboboxAnchor()
  const [selectedNames, setSelectedNames] = React.useState(initialValue)
  const [saveStatus, setSaveStatus] = React.useState('idle')
  const [saveError, setSaveError] = React.useState(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isDirty =
    selectedNames.length !== initialValue.length ||
    selectedNames.some((name, i) => initialValue[i] !== name) ||
    initialValue.some((name, i) => selectedNames[i] !== name)

  React.useEffect(() => {
    setSelectedNames(initialValue)
    setSaveStatus('idle')
    setSaveError(null)
  }, [initialValue])

  React.useEffect(() => {
    if (saveStatus !== 'saved') return
    const timer = setTimeout(() => setSaveStatus('idle'), 1400)
    return () => clearTimeout(timer)
  }, [saveStatus])

  async function handleSave(e) {
    e.preventDefault()
    if (!profileId || !isDirty) return
    setIsSubmitting(true)
    setSaveError(null)
    try {
      const { data: skillRows, error: skillsError } = await supabase
        .from('skills')
        .select('id, name')
        .in('name', selectedNames)
      if (skillsError) throw skillsError
      const skillIds = (skillRows ?? []).map((r) => r.id)

      await supabase.from('profile_skills').delete().eq('profile_id', profileId)
      if (skillIds.length > 0) {
        const { error: insertError } = await supabase
          .from('profile_skills')
          .insert(skillIds.map((skill_id) => ({ profile_id: profileId, skill_id })))
        if (insertError) throw insertError
      }
      setSaveStatus('saved')
      onSaved?.()
    } catch {
      setSaveStatus('error')
      setSaveError('Failed to save skills.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleClear(e) {
    e.preventDefault()
    setSelectedNames(initialValue)
    setSaveStatus('idle')
    setSaveError(null)
  }

  const allSkillNames = React.useMemo(
    () => options.flatMap((category) => category.skills.map((skill) => skill.name)),
    [options]
  )

  return (
    <form onSubmit={handleSave} className='space-y-3'>
      <Field>
        <FieldLabel>Skills</FieldLabel>
        <Combobox multiple autoHighlight items={allSkillNames} value={selectedNames} onValueChange={setSelectedNames}>
          <ComboboxChips ref={anchor} className='w-full max-w-sm min-w-0'>
            <ComboboxValue>
              {(values) => (
                <>
                  {values.map((value) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput placeholder='Search skills...' />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>No skills found.</ComboboxEmpty>
            <ComboboxList>
              {options.map((category, index) => (
                <React.Fragment key={category.id}>
                  {index > 0 ? <ComboboxSeparator /> : null}
                  <ComboboxGroup>
                    <ComboboxLabel>{category.name}</ComboboxLabel>
                    {category.skills.map((skill) => (
                      <ComboboxItem key={skill.id} value={skill.name}>
                        {skill.name}
                      </ComboboxItem>
                    ))}
                  </ComboboxGroup>
                </React.Fragment>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <Field orientation='horizontal'>
        {isDirty ? (
          <Button variant='outline' type='button' onClick={handleClear} disabled={disabled}>
            Clear
          </Button>
        ) : null}
        <Button variant='outline' type='submit' disabled={disabled || isSubmitting || !isDirty}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
        {saveStatus === 'saved' ? <p className='text-sm text-emerald-600'>Saved</p> : null}
        {saveStatus === 'error' ? <p className='text-sm text-red-600'>{saveError}</p> : null}
      </Field>
    </form>
  )
}
