'use client'

import * as React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Field, FieldLabel } from '@/components/ui/field'
import { supabase } from '@/lib/supabase/client'

export default function ProfileAvailabilityField({ profileId, initialValue = [], disabled = false, onSaved }) {
  const [ranges, setRanges] = React.useState(
    initialValue.length > 0
      ? initialValue.map((r) => ({
          start_date: r.start_date,
          end_date: r.end_date
        }))
      : [{ start_date: undefined, end_date: undefined }]
  )
  const [saveStatus, setSaveStatus] = React.useState('idle')
  const [saveError, setSaveError] = React.useState(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const initialSerialized = JSON.stringify(
    initialValue.map((r) => ({
      start_date: r.start_date?.toISOString?.() ?? null,
      end_date: r.end_date?.toISOString?.() ?? null
    }))
  )
  const currentSerialized = JSON.stringify(
    ranges.map((r) => ({
      start_date: r.start_date?.toISOString?.() ?? null,
      end_date: r.end_date?.toISOString?.() ?? null
    }))
  )
  const isDirty = initialSerialized !== currentSerialized

  const initialSerializedRef = React.useRef(initialSerialized)
  React.useEffect(() => {
    if (initialSerializedRef.current !== initialSerialized) {
      initialSerializedRef.current = initialSerialized
      setRanges(
        initialValue.length > 0
          ? initialValue.map((r) => ({ start_date: r.start_date, end_date: r.end_date }))
          : [{ start_date: undefined, end_date: undefined }]
      )
      setSaveStatus('idle')
      setSaveError(null)
    }
  }, [initialSerialized, initialValue])

  React.useEffect(() => {
    if (saveStatus !== 'saved') return
    const timer = setTimeout(() => setSaveStatus('idle'), 1400)
    return () => clearTimeout(timer)
  }, [saveStatus])

  function addRange() {
    setRanges((prev) => [...prev, { start_date: undefined, end_date: undefined }])
  }

  function removeRange(index) {
    setRanges((prev) => prev.filter((_, i) => i !== index))
  }

  function setRangeStart(index, date) {
    setRanges((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], start_date: date }
      return next
    })
  }

  function setRangeEnd(index, date) {
    setRanges((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], end_date: date }
      return next
    })
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!profileId || !isDirty) return
    setIsSubmitting(true)
    setSaveError(null)
    try {
      await supabase.from('profile_availability').delete().eq('profile_id', profileId)
      const toInsert = ranges
        .filter((r) => r.start_date != null)
        .map((r) => ({
          profile_id: profileId,
          start_date: r.start_date.toISOString(),
          end_date: r.end_date != null ? r.end_date.toISOString() : null
        }))
      if (toInsert.length > 0) {
        const { error } = await supabase.from('profile_availability').insert(toInsert)
        if (error) throw error
      }
      setSaveStatus('saved')
      onSaved?.()
    } catch {
      setSaveStatus('error')
      setSaveError('Failed to save availability.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleClear(e) {
    e.preventDefault()
    setRanges(
      initialValue.length > 0
        ? initialValue.map((r) => ({ start_date: r.start_date, end_date: r.end_date }))
        : [{ start_date: undefined, end_date: undefined }]
    )
    setSaveStatus('idle')
    setSaveError(null)
  }

  return (
    <form onSubmit={handleSave} className='space-y-3'>
      <Field>
        <FieldLabel>Availability</FieldLabel>
        <div className='flex w-full max-w-sm flex-col gap-3'>
          {ranges.map((range, index) => (
            <div key={index} className='flex flex-wrap items-end gap-2'>
              <div className='flex flex-col gap-1'>
                <span className='text-muted-foreground text-xs'>Start</span>
                <DatePicker
                  value={range.start_date}
                  onSelect={(date) => setRangeStart(index, date)}
                  placeholder='Start date'
                />
              </div>
              <div className='flex flex-col gap-1'>
                <span className='text-muted-foreground text-xs'>End</span>
                <DatePicker
                  value={range.end_date}
                  onSelect={(date) => setRangeEnd(index, date)}
                  placeholder='End date'
                />
              </div>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => removeRange(index)}
                disabled={disabled || ranges.length <= 1}
                aria-label='Remove range'
              >
                <Trash2 className='size-4' />
              </Button>
            </div>
          ))}
          <Button type='button' variant='outline' onClick={addRange} disabled={disabled}>
            Add range
          </Button>
        </div>
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
