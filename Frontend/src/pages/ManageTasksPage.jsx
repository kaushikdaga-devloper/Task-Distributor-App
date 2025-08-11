import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuthState } from '../store/AuthContext';
import Card from '../components/Card';

const ManageTasksPage = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { token } = useAuthState();

  const fetchFiles = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axiosInstance.get('/tasks/files', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadedFiles(response.data);
    } catch (error) {
      console.error('Failed to fetch file history', error);
    }
  }, [token]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('csvfile', file);
    try {
      const response = await axiosInstance.post('/tasks/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.message);
      document.getElementById('file-upload').value = null;
      fetchFiles();
    } catch (error) {
      alert('Upload Failed: ' + (error.response?.data?.error || 'Server error'));
    }
  };

  return (
    <Card title="Manage Tasks" subtitle="Upload new tasks and view file history" maxWidth="50rem">
      <div className="form-group">
        <label htmlFor="file-upload">Upload Task File (CSV, XLS, XLSX)</label>
        <input
          id="file-upload"
          type="file"
          accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={handleFileChange}
        />
      </div>
      <button onClick={handleUpload} className="primary-button">
        Upload Tasks
      </button>

      <div className="history-section" style={{marginTop: '3rem'}}>
        <h3>Upload History</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Filename</th>
                <th>Tasks Added</th>
                <th>Upload Date</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((uploadedFile) => (
                <tr key={uploadedFile._id}>
                  <td>{uploadedFile.filename}</td>
                  <td>{uploadedFile.taskCount}</td>
                  <td>{new Date(uploadedFile.uploadDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default ManageTasksPage;