import './App.css'
import DrawingInput from './DrawingInput'
import { useRef, useState } from 'react'
import { sqrt } from 'mathjs'

function App() {
  const [coordinates, setCoordinates] = useState([]);

  return (
    <>
      <h2>Fourier Transforms</h2>
      <DrawingInput
        coordinates={coordinates}
        setCoordinates={setCoordinates}
      />
    </>
  )
}

export default App
