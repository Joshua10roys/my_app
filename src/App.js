import React, { useState } from 'react';
import axios from 'axios';

function App() {
  return (
    <div>
      <FetchPdfFile />
      <FileUploadForm />
    </div>
  );
}

export default App;


const FetchPdfFile = () => {
  const [pdfData, setPdfData] = useState(null);

  const fetchPdf = () => {
    axios.get('http://127.0.0.1:8000/file/getFile', {
      responseType: 'arraybuffer',
    })
      .then(response => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfData(url);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <button onClick={fetchPdf}>Fetch PDF</button>
      {pdfData && <embed src={pdfData} type="application/pdf" width="100%" height="600px" />}
    </div>
  );
};



const FileUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('pdfFile', selectedFile);

    axios.post('http://your-django-backend-url/api/upload-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log('File uploaded successfully:', response);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};