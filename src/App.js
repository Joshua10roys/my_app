import React, { useRef, useState } from 'react';
import axios from 'axios';

function App() {
  return (
    <div>
      <DownloadPdf />
      <FileUpload />
      {/* <FetchPdfFile /> */}
      {/* <FileUploadForm /> */}
    </div>
  );
}

export default App;


const DownloadPdf = () => {

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [file, setFile] = useState(null)

  const getPdf = () => {
    setLoading(true)
    axios
      .get("http://127.0.0.1:8000/file/getFile",
        {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            let percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setProgress(percentage)
          }
        }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(response.data);
        setFile(url)
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false)
      })
  };

  return (
    <div style={{ margin: "10px", height: "calc(50vh - 20px - 2px)", border: "1px solid gray" }}>
      <h1 style={{ textAlign: "center" }}>Download</h1>

      <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center', gap: '10px' }}>
        <div>
          <button onClick={getPdf}>Download PDF</button>
        </div>
        <div>
          {loading && <p>Downloading: {progress} %</p>}
        </div>
        <div>
          {file && <a href={file} download={"example.pdf"} >Save</a>}
        </div>
      </div>

    </div>
  )
}

const FileUpload = () => {

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    // const formData = new FormData();
    // formData.append("pdf", event.target.files[0])
    // setFile(formData);
    setFile(event.target.files[0])
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios
        .post("http://127.0.0.1:8000/file/uploadFile", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div style={{ margin: "10px", height: "calc(50vh - 20px - 2px)", border: "1px solid gray" }}>
      <h1 style={{ textAlign: "center" }}>Upload</h1>
      <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center', gap: '10px' }}>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSubmit}>Upload</button>
      </div>
    </div>
  );
}


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