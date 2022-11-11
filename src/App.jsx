import './App.css'
import DrawingInput from './DrawingInput'
import FourierCircles from './FourierCircles'
import { useRef, useState } from 'react'
import { sqrt } from 'mathjs'

function App() {
  const [coordinates, setCoordinates] = useState([]);

  return (
    <>
      <h2>Fourier Transform by <a href="https://github.com/mattpk/fourier-transform">mattpk</a></h2>
      <p>Draw a shape:</p>
      <DrawingInput
        coordinates={coordinates}
        setCoordinates={setCoordinates}
      />
      <p>Below is your drawing drawn with circles computed using a fourier transform.</p>
      <FourierCircles coordinates={coordinates} />
    </>
  )
}

export default App
