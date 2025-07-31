import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../../api/axiosInstance.jsx'

const createAgent = async (newAgent) => {
  const { data } = await axiosInstance.post('/agents', newAgent)
  return data
}

const AddAgentForm = () => {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const mutation = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      alert('Agent created successfully!')
      reset()
    },
    onError: (error) => {
      alert(`Error: ${error.response?.data?.error || 'Could not create agent.'}`)
    },
  })

  const onSubmit = (data) => {
    const fullPhone = `${data.countryCode}${data.phoneNumber}`

    mutation.mutate({
      name: data.name,
      email: data.email,
      phone: fullPhone,
      password: data.password
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-stack">
        <div className="form-control">
          <label>Name</label>
          <input {...register('name', { required: true })} />
        </div>

        <div className="form-control">
          <label>Email</label>
          <input type="email" {...register('email', { required: true })} />
        </div>

        <div className="form-control">
          <label>Mobile Number (with Country Code)</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="+91"
              style={{ width: '80px' }}
              {...register('countryCode', {
                required: true,
                pattern: {
                  value: /^\+\d{1,4}$/,
                  message: 'Invalid country code',
                },
              })}
            />
            <input
              type="tel"
              {...register('phoneNumber', {
                required: true,
                pattern: {
                  value: /^\d{6,14}$/,
                  message: 'Invalid phone number',
                },
              })}
            />
          </div>
          {(errors.countryCode || errors.phoneNumber) && (
            <p style={{ color: 'red' }}>
              {errors.countryCode?.message || errors.phoneNumber?.message}
            </p>
          )}
        </div>

        <div className="form-control">
          <label>Password</label>
          <input type="password" {...register('password', { required: true })} />
        </div>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Adding...' : 'Add Agent'}
        </button>
      </div>
    </form>
  )
}

export default AddAgentForm
