import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../../api/axiosInstance.jsx'

const uploadFile = async (formData) => {
  const { data } = await axiosInstance.post('/tasks/upload', formData)
  return data
}

const FileUpload = () => {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm()

  const mutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      // Invalidate both tasks and agents to refresh the dashboard
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      alert('File uploaded and tasks distributed!')
      reset()
    },
    onError: (error) => {
      alert(`Error: ${error.response?.data?.error || 'Could not upload file.'}`)
    },
  })

  const onSubmit = (data) => {
    if (!data.taskFile || data.taskFile.length === 0) {
      return alert('Please select a file.')
    }
    const formData = new FormData()
    formData.append('csvfile', data.taskFile[0])
    mutation.mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control">
        <label>Upload a .csv, .xls, or .xlsx file</label>
        <input
          type="file"
          accept=".csv, .xls, .xlsx"
          {...register('taskFile', { required: true })}
        />
      </div>
      <button type="submit" style={{ marginTop: '1rem' }} disabled={mutation.isPending}>
        {mutation.isPending ? 'Uploading...' : 'Upload and Distribute'}
      </button>
    </form>
  )
}

export default FileUpload