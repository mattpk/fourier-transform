import './App.css'
import DrawingInput from './DrawingInput'
import { useRef, useState } from 'react'
import { sqrt } from 'mathjs'

function App() {
  const [coordinates, setCoordinates] = useState([]);

  return (
    <>
      <h2>Fourier Transforms</h2>
      <p>Draw a shape:</p>
      <DrawingInput
        coordinates={coordinates}
        setCoordinates={setCoordinates}
      />
      <p>tbd: some cool fourier thing here</p>
    </>
  )
}

export default App
