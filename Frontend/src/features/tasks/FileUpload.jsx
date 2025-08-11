import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import '../../index.css';

// The function that sends the file to the backend
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('csvfile', file); // 'csvfile' must match the name in your backend multer setup

  const { data } = await axiosInstance.post('/tasks/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      alert('File uploaded and tasks distributed successfully!');
      // This will refetch the tasks and update the display
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['agentsAndTasks'] });
      setSelectedFile(null); // Clear the file input
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'An error occurred during file upload.');
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Basic client-side validation for immediate feedback
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setError('');
      } else {
        setSelectedFile(null);
        setError('Invalid file type. Please select a CSV, XLS, or XLSX file.');
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    mutation.mutate(selectedFile);
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="form-group">
        <label htmlFor="file-upload" className="file-upload-label">
          {selectedFile ? selectedFile.name : 'Choose a file...'}
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          // This helps the user by only showing allowed file types in the file dialog
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
      </div>
      
      <button type="submit" className="upload-button" disabled={mutation.isPending}>
        {mutation.isPending ? 'Uploading...' : 'Upload and Distribute'}
      </button>

      {error && <p className="error-message" style={{ marginTop: '1rem' }}>{error}</p>}
    </form>
  );
};

export default FileUpload;
