import React, { Component } from 'react'
import './App.css'

import SRR from './lib'

window.SRR = SRR

SRR.get('/', () => (
  <div>hello world</div>
))

SRR.get('/list', () => (
  <div>list</div>
))

SRR.get('/detail', () => (
  <div>detail</div>
))

class App extends Component {
  render () {
    return (
      <SRR />
    )
  }
}

export default App
