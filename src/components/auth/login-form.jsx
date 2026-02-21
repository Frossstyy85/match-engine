'use client'
import { useForm } from '@tanstack/react-form'
import { Input } from '../ui/input'
import { useState } from 'react'
import { EyeOff, EyeIcon } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Field, FieldLabel } from '@/components/ui/field'
import { Button } from '../ui/button'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState(null)
  const togglePassword = () => {
    setShowPassword((prevState) => !prevState)
  }
  const Icon = showPassword ? EyeOff : EyeIcon
  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    onSubmit: async ({ value: { email, password } }) => {
      setAuthError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) {
        setAuthError(error.message)
      }
      if (data) router.push('/dashboard')
    }
  })
  const submit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }
  return (
    <div>
      <form onSubmit={submit}>
        {authError && <p>{authError}</p>}
        <div className={'space-y-5'}>
          <form.Field name='email'>
            {(field) => (
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  placeholder={'email'}
                  type='email'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name='password'>
            {(field) => (
              <Field>
                <FieldLabel>Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    placeholder={'password'}
                    type={showPassword ? 'text' : 'password'}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <InputGroupAddon align={'inline-end'}>
                    <Icon
                      onClick={togglePassword}
                      className={'cursor-pointer'}
                      aria-label='Toggle password visibility'
                    />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            )}
          </form.Field>
        </div>
        <div>
          <form.Subscribe selector={(s) => s.isSubmitting}>
            {(isSubmitting) => (
              <>
                <Button type={'submit'} className={'w-full'} disabled={isSubmitting}>
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  )
}
