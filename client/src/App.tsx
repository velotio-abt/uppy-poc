import { useState } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
// import XHRUpload from '@uppy/xhr-upload';
import Tus from '@uppy/tus';

import Dropbox from '@uppy/dropbox';
import GoogleDrive from '@uppy/google-drive';
import Box from '@uppy/box';
import FileSearchPlugin from "./plugins/SearchPlugin";

import './App.css'
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/drag-drop/dist/style.min.css';
import Url from '@uppy/url';

const App = () => {
  const [uppy] = useState(() => new Uppy()
    .use(Tus, { endpoint: '<tus server url>/files', chunkSize:  2*1024*1024 })
    .use(Dropbox, { companionUrl: 'http://localhost:3000/companion' })
    .use(Box, { companionUrl: 'http://localhost:3000/companion' })
    .use(GoogleDrive, { companionUrl: 'http://localhost:3000/companion' })
    .use(Url, { companionUrl: "http://localhost:3000/companion" })
    .use(FileSearchPlugin, { target: 'Dashboard' })
    .on("complete", (res) => {
      console.log('res = ', res);
    })
    .on("error", (error) => {
      console.error('Uppy error:', error);
    })
    .on("upload-error", (file, error, response) => {
      console.error('Upload error:', { file, error, response });
    })
  );

  return (
    <>
      <h1>Uppy POC</h1>
      <div className="card">
        <Dashboard uppy={uppy} plugins={['GoogleDrive', 'Dropbox']} showProgressDetails />
      </div>
    </>
  )
}

export default App
