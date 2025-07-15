import { useState } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
// import Tus from '@uppy/tus';

import Dropbox from '@uppy/dropbox';
import GoogleDrive from '@uppy/google-drive';

import './App.css'
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/drag-drop/dist/style.min.css';

const App = () => {
  const [uppy] = useState(() => new Uppy()
    .use(XHRUpload, { endpoint: 'http://localhost:3000/upload' })
    .use(Dropbox, { companionUrl: 'http://localhost:3000/companion' })
    .use(GoogleDrive, { companionUrl: 'http://localhost:3000/companion' })
  );

  return (
    <>
      <h1>Uppy POC</h1>
      <div className="card">
        <Dashboard uppy={uppy} plugins={['GoogleDrive', 'Dropbox']} />
      </div>
    </>
  )
}

export default App
