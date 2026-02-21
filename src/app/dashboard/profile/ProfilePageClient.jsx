'use client'

import { useForm } from '@tanstack/react-form'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircleIcon, CheckCircle2Icon, LoaderCircleIcon, MailIcon, UserRoundIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

import ProfileAvailabilityField from './ProfileAvailabilityField'
import ProfileCertificatesField from './ProfileCertificatesField'
import ProfileLanguagesField from './ProfileLanguagesField'
import ProfileSkillsField from './ProfileSkillsField'

function parseAvailabilityRanges(ranges = []) {
  return ranges.map((range) => ({
    start_date: range.start_date ? new Date(range.start_date) : undefined,
    end_date: range.end_date ? new Date(range.end_date) : undefined
  }))
}

async function updateProfileField(authId, fieldName, fieldValue) {
  if (!authId) {
    throw new Error('User not found')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ [fieldName]: fieldValue })
    .eq('auth_id', authId)

  if (error) throw error
}

export default function ProfilePageClient({ authId, initialData, loadError = null }) {
  const router = useRouter()
  const [profile, setProfile] = useState(initialData)

  useEffect(() => {
    setProfile(initialData)
  }, [initialData])

  const isReadOnly = !authId

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <section className='mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <h1 className='text-lg font-semibold text-slate-900 sm:text-xl'>Profile Settings</h1>
        </div>

        {loadError ? (
          <div className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>{loadError}</div>
        ) : null}

        <div className='flex flex-col items-start gap-3'>
          <ProfileField
            authId={authId}
            fieldName={'name'}
            label={'Name'}
            icon={UserRoundIcon}
            initialValue={profile.name}
            disabled={isReadOnly}
            onSaved={(nextValue) => {
              setProfile((prev) => ({ ...prev, name: nextValue }))
              router.refresh()
            }}
          />

          <ProfileField
            authId={authId}
            fieldName={'email'}
            label={'Email address'}
            icon={MailIcon}
            type={'email'}
            initialValue={profile.email}
            disabled={isReadOnly}
            onSaved={(nextValue) => {
              setProfile((prev) => ({ ...prev, email: nextValue }))
              router.refresh()
            }}
          />
        </div>

        {profile.profileId ? (
          <div className='flex flex-col items-start gap-3'>
            <ProfileBlock title={'Skills Matrix'}>
              <ProfileSkillsField
                profileId={profile.profileId}
                initialValue={profile.initialSkillNames}
                options={profile.skillsOptions}
                disabled={isReadOnly}
                onSaved={() => router.refresh()}
              />
            </ProfileBlock>

            <ProfileBlock title={'Certificates'}>
              <ProfileCertificatesField
                profileId={profile.profileId}
                initialValue={profile.initialCertificateNames}
                options={profile.certificatesOptions}
                disabled={isReadOnly}
                onSaved={() => router.refresh()}
              />
            </ProfileBlock>

            <ProfileBlock title={'Languages'}>
              <ProfileLanguagesField
                profileId={profile.profileId}
                initialValue={profile.initialLanguageNames}
                options={profile.languagesOptions}
                disabled={isReadOnly}
                onSaved={() => router.refresh()}
              />
            </ProfileBlock>

            <ProfileBlock title={'Availability Windows'}>
              <ProfileAvailabilityField
                profileId={profile.profileId}
                initialValue={parseAvailabilityRanges(profile.initialAvailability)}
                disabled={isReadOnly}
                onSaved={() => router.refresh()}
              />
            </ProfileBlock>
          </div>
        ) : (
          <div className='rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600'>
            Profile record was not found for this account.
          </div>
        )}
      </section>
    </div>
  )
}

function ProfileBlock({ title, children }) {
  return (
    <section className='w-full max-w-4xl rounded-lg border border-slate-200 p-3'>
      <h2 className='mb-2 text-sm font-semibold text-slate-900'>{title}</h2>
      {children}
    </section>
  )
}

function ProfileField({
  authId,
  fieldName,
  label,
  icon: Icon,
  initialValue,
  type = 'text',
  disabled = false,
  onSaved
}) {
  const [savedValue, setSavedValue] = useState(initialValue)
  const [saveState, setSaveState] = useState('idle')
  const [saveError, setSaveError] = useState(null)
  const lastInitialValueRef = useRef(initialValue ?? '')

  const form = useForm({
    defaultValues: {
      [fieldName]: initialValue
    },
    onSubmit: async ({ value }) => {
      const nextValue = value[fieldName] ?? ''

      try {
        await updateProfileField(authId, fieldName, nextValue)
        setSavedValue(nextValue)
        setSaveState('saved')
        setSaveError(null)
        form.reset({ [fieldName]: nextValue })
        onSaved?.(nextValue)
      } catch {
        setSaveState('error')
        setSaveError('Failed to save changes.')
      }
    }
  })

  useEffect(() => {
    if (saveState !== 'saved') return

    const timer = setTimeout(() => {
      setSaveState('idle')
    }, 1400)

    return () => clearTimeout(timer)
  }, [saveState])

  useEffect(() => {
    const nextInitialValue = initialValue ?? ''
    if (nextInitialValue === lastInitialValueRef.current) return

    lastInitialValueRef.current = nextInitialValue
    setSavedValue(nextInitialValue)
    setSaveState('idle')
    setSaveError(null)
    form.reset({ [fieldName]: nextInitialValue })
  }, [fieldName, form, initialValue])

  return (
    <section
      className={cn(
        'w-full max-w-4xl rounded-lg border bg-white p-3 transition-colors duration-200',
        saveState === 'saved' ? 'border-emerald-300' : 'border-slate-200',
        saveState === 'error' && 'border-red-300'
      )}
    >
      <div className='mb-2 flex items-center justify-between gap-2'>
        <p className='inline-flex items-center gap-2 text-sm font-semibold text-slate-900'>
          <Icon className='size-4 text-slate-500' />
          {label}
        </p>

        <StatusBadge saveState={saveState} disabled={disabled} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className={'space-y-2'}
      >
        <form.Field name={fieldName}>
          {(field) => (
            <Field>
              <FieldLabel className={'sr-only'}>{label}</FieldLabel>
              <Input
                className={cn(
                  'w-full max-w-sm transition-colors duration-200',
                  saveState === 'saved' &&
                    'border-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-200',
                  saveState === 'error' && 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200'
                )}
                type={type}
                value={field.state.value ?? ''}
                onChange={(e) => {
                  setSaveState('idle')
                  setSaveError(null)
                  field.handleChange(e.target.value)
                }}
                disabled={disabled}
              />
            </Field>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.isSubmitting, state.isDirty]}>
          {([isSubmitting, isDirty]) => (
            <Field orientation={'horizontal'}>
              {isDirty ? (
                <Button
                  variant={'outline'}
                  type={'reset'}
                  onClick={(e) => {
                    e.preventDefault()
                    form.reset({ [fieldName]: savedValue })
                    setSaveState('idle')
                    setSaveError(null)
                  }}
                  disabled={disabled}
                >
                  Clear
                </Button>
              ) : null}

              <Button variant={'outline'} type={'submit'} disabled={disabled || isSubmitting || !isDirty}>
                {isSubmitting ? (
                  <span className='inline-flex items-center gap-2'>
                    <LoaderCircleIcon className='size-4 animate-spin' />
                    Saving...
                  </span>
                ) : (
                  'Save'
                )}
              </Button>

              {saveState === 'saved' ? (
                <p className={'inline-flex items-center gap-1 text-sm text-emerald-600'}>
                  <CheckCircle2Icon className='size-4' />
                  Saved
                </p>
              ) : null}

              {saveState === 'error' ? (
                <p className={'inline-flex items-center gap-1 text-sm text-red-600'}>
                  <AlertCircleIcon className='size-4' />
                  {saveError}
                </p>
              ) : null}
            </Field>
          )}
        </form.Subscribe>
      </form>
    </section>
  )
}

function StatusBadge({ saveState, disabled }) {
  if (disabled) {
    return (
      <Badge variant='outline' className='border-slate-200 text-slate-600'>
        Locked
      </Badge>
    )
  }

  if (saveState === 'saved') {
    return (
      <Badge variant='outline' className='border-emerald-200 bg-emerald-50 text-emerald-700'>
        Updated
      </Badge>
    )
  }

  if (saveState === 'error') {
    return (
      <Badge variant='outline' className='border-red-200 bg-red-50 text-red-700'>
        Error
      </Badge>
    )
  }

  return null
}
