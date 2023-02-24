import React, { useState } from 'react';
import TSTrans from './TSTrans';
import Translator from './Translator';

function App() {
  const [currentPage, setCurrentPage] = useState('peopleList');

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setCurrentPage('Translator')}>General Translator</button>
      <button className="btn btn-primary" onClick={() => setCurrentPage('TSTrans')}>.ts file translator</button>
      {currentPage === 'Translator' ? <Translator /> : <TSTrans />}
    </div>
  );
}

export default App;
