import { useRef, useState, useEffect } from 'react'
import * as Constants from './Constants'

function DrawingInput({ coordinates, setCoordinates }) {
  const canvasRef = useRef(null)
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");

  const [isPressed, setIsPressed] = useState(false)
  const [lastCoordRecorded, setLastCoordRecorded] = useState(0);

  useEffect(() => {
    if (!ctx) {
      return;
    } 
    ctx.clearRect(0, 0, Constants.WIDTH, Constants.HEIGHT)
    let prevCoord = null;
    // draw points
    // for (let i = 0; i < coordinates.length; i++) {
    //   const coord = coordinates[i];
    //   ctx.beginPath();
    //   ctx.arc(coord[0], coord[1], 2, 0, 2 * Math.PI, false);
    //   ctx.fill();
    // }
    // draw lines
    for (let i = 0; i < coordinates.length; i++) {
      const coord = coordinates[i];
      if (i == 0) {
        ctx.beginPath();
        ctx.moveTo(coord[0], coord[1]);
      } else {
        ctx.lineTo(coord[0], coord[1]);
      }
    }
    ctx.closePath();
    ctx.stroke();
  })

  const handleDown = (e) => {
    setIsPressed(true)
    const coord = convertEventToCoord(e, canvasRef.current)
    setCoordinates([coord])
    setLastCoordRecorded(Date.now())
  }
  const handleMove = (e) => {
    if (!isPressed) {
      return;
    }
    if (lastCoordRecorded + (1000 / Constants.INPUT_FREQUENCY) < Date.now()) {
      setLastCoordRecorded(Date.now())
      const coord = convertEventToCoord(e, canvasRef.current)
      setCoordinates([...coordinates, coord])
    }
  }
  const handleUp = (e) => {
    setIsPressed(false)
  }

  return (
    <canvas
      id="canvas"
      width={Constants.WIDTH}
      height={Constants.HEIGHT}
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
