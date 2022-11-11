import { useRef, useState, useEffect } from 'react'

const WIDTH = 400
const HEIGHT = 300
const INPUT_FREQUENCY = 120

function DrawingInput({ coordinates, setCoordinates }) {
  const canvasRef = useRef(null)
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");

  const [isPressed, setIsPressed] = useState(false)
  const [lastCoordRecorded, setLastCoordRecorded] = useState(0);

  useEffect(() => {
    if (coordinates.length > 0) {
      const coord = coordinates[coordinates.length - 1];
      ctx.beginPath();
      ctx.arc(coord[0], coord[1], 4, 0, 2 * Math.PI, false);  // a circle
      ctx.fill();
    }
  })

  const handleDown = (e) => {
    setIsPressed(true)
    const coord = convertEventToCoord(e, canvasRef.current)
    ctx?.clearRect(0, 0, WIDTH, HEIGHT)
    setCoordinates([coord])
    setLastCoordRecorded(Date.now())
  }
  const handleMove = (e) => {
    if (!isPressed) {
      return;
    }
    if (lastCoordRecorded + (1000 / INPUT_FREQUENCY) < Date.now()) {
      setLastCoordRecorded(Date.now())
      const coord = convertEventToCoord(e, canvasRef.current)
      setCoordinates([...coordinates, coord])
    }
  }
  const handleUp = (e) => {
    setIsPressed(false)
    console.log(coordinates)
  }

  return (
    <canvas
      id="canvas"
      width={WIDTH}
      height={HEIGHT}
      ref={canvasRef}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerMove={handleMove}
    />
  )
}

function convertEventToCoord(e, canvas) {
  const rect = canvas.getBoundingClientRect()
  return [e.clientX - rect.left, e.clientY - rect.top]
}

export default DrawingInput
