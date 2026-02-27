'use client'

import Link from 'next/link'
import { ArrowLeftIcon, UserRoundIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldTitle } from '@/components/ui/field'
import {
  UserCertificatesForm,
  UserIdentityForm,
  UserLanguagesForm,
  UserSkillsForm
} from '@/features/users/app/user-profile-forms'
import { getUserById as fetchUser } from '@/lib/db/users'

function valueOrDash(value) {
  return value == null || value === '' ? <span className='text-muted-foreground'>-</span> : String(value)
}

export default function UserDetailsPage({ userId }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  })

  if (isLoading) {
    return <p className='text-muted-foreground text-sm'>Loading user...</p>
  }

  if (error || !user) {
    return <p className='text-destructive text-sm'>Failed to load user.</p>
  }

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <div className='mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-4'>
        <header className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0 space-y-1'>
            <h1 className='inline-flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl'>
              <UserRoundIcon className='text-muted-foreground size-4.5' />
              <span className='truncate'>{user.name ?? user.email ?? 'User profile'}</span>
            </h1>
            <p className='text-muted-foreground text-sm'>{`User ID: ${user.id}`}</p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Button asChild size='sm' variant='ghost'>
              <Link href='/dashboard/users'>
                <ArrowLeftIcon />
                Back to users
              </Link>
            </Button>
          </div>
        </header>

        <Card className='w-full max-w-4xl border-border shadow-sm'>
          <CardHeader className='gap-1'>
            <CardTitle className='text-base'>User details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <FieldGroup>
              <Field>
                <FieldTitle>Name</FieldTitle>
                <div>{valueOrDash(user.name)}</div>
              </Field>

              <Field>
                <FieldTitle>Email</FieldTitle>
                <div>{valueOrDash(user.email)}</div>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <div className='space-y-6'>
          <UserIdentityForm
            profileId={user.id}
            name={user.name ?? ''}
            email={user.email ?? ''}
          />
          <UserSkillsForm profileId={user.id} />
          <UserCertificatesForm profileId={user.id} />
          <UserLanguagesForm profileId={user.id} />
        </div>
      </div>
    </div>
  )
}
