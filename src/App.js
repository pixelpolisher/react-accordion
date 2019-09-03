import React from 'react';
import Accordion from './Accordion';

import './css/style.css';
import { planets } from './Planets';

function App() {


  return (
    <div className="App">
      <main className="main">
        <h1>A simple react accordion</h1>
        <Accordion data={planets} showBellow={1} slideDuration={900} />
      </main>
    </div>
  );
}

export default App;
