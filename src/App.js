import React, { Component } from 'react';
import Accordion from './Accordion';

import './css/style.css';
import { planets } from './Planets';

class App extends Component {

  constructor() {
    super();

    this.state = {
      slideDuration: 700,
      showBellow: [1]
    }

    this.updateSlideDuration = this.updateSlideDuration.bind(this);
  }

  updateSlideDuration(event) {

  }

  render() {
    const { slideDuration, showBellow } = this.state;

    return (
      <div className="App">
        <main className="main">
          <h1>A simple react accordion</h1>
          <Accordion data={planets} showBellow={showBellow} slideDuration={slideDuration} />
        </main>
      </div>
    );
  }
}

export default App;
