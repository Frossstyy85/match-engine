'use client'

import * as React from 'react'
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
import { Field, FieldLabel } from '@/components/ui/field'
import { supabase } from '@/lib/supabase/client'

export default function ProfileLanguagesField({
  profileId,
  initialValue = [],
  options = [],
  disabled = false,
  onSaved
}) {
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
      const nameToId = new Map(options.map((o) => [o.name, o.id]))
      const languageIds = selectedNames.map((name) => nameToId.get(name)).filter(Boolean)

      await supabase.from('profile_languages').delete().eq('profile_id', profileId)
      if (languageIds.length > 0) {
        const { error: insertError } = await supabase
          .from('profile_languages')
          .insert(languageIds.map((language_id) => ({ profile_id: profileId, language_id })))
        if (insertError) throw insertError
      }
      setSaveStatus('saved')
      onSaved?.()
    } catch {
      setSaveStatus('error')
      setSaveError('Failed to save languages.')
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

  const allNames = React.useMemo(() => options.map((o) => o.name), [options])

  return (
    <form onSubmit={handleSave} className='space-y-3'>
      <Field>
        <FieldLabel>Languages</FieldLabel>
        <Combobox multiple autoHighlight items={allNames} value={selectedNames} onValueChange={setSelectedNames}>
          <ComboboxChips ref={anchor} className='w-full max-w-sm min-w-0'>
            <ComboboxValue>
              {(values) => (
                <>
                  {values.map((value) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput placeholder='Search languages...' />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>No languages found.</ComboboxEmpty>
            <ComboboxList>
              {options.map((opt) => (
                <ComboboxItem key={opt.id} value={opt.name}>
                  {opt.name}
                </ComboboxItem>
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
