import { useRef, useState, useMemo, useEffect } from 'react'
import * as Constants from './Constants'
import { sqrt, floor } from 'mathjs'

function DrawingInput({ coordinates, setCoordinates }) {
  const canvasRef = useRef(null)
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  // Holds the coordinates entered by the user -- we inject extra ones to smooth out the shape
  const [trueCoordinates, setTrueCoordinates] = useState([]);

  const [isPressed, setIsPressed] = useState(false)
  const [lastCoordRecorded, setLastCoordRecorded] = useState(0);

  useEffect(() => {
    if (trueCoordinates.length == 0) return;
    const first = trueCoordinates[0];
    const last = trueCoordinates[trueCoordinates.length - 1];
    const totalLength = calcLength(trueCoordinates);
    const avgLength = totalLength / trueCoordinates.length;
    const lastDist = dist(first, last);
    const numToInject = floor(lastDist / avgLength);
    if (numToInject > 0) {
      console.log(numToInject);
      const newCoords = [];
      const vec = [
        (first[0] - last[0]) / numToInject,
        (first[1] - last[1]) / numToInject,
      ];
      let coord = last;
      for (let i = 0; i < numToInject; i++) {
        coord = [coord[0] + vec[0], coord[1] + vec[1]];
        newCoords.push(coord);
      }
      setCoordinates([...trueCoordinates, ...newCoords]);
    } else {
      setCoordinates(trueCoordinates);
    }
  }, [trueCoordinates]);

  if (ctx) {
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
  }

  const handleDown = (e) => {
    setIsPressed(true)
    const coord = convertEventToCoord(e, canvasRef.current)
    setTrueCoordinates([coord])
    setLastCoordRecorded(Date.now())
  }
  const handleMove = (e) => {
    if (!isPressed) {
      return;
    }
    if (lastCoordRecorded + (1000 / Constants.INPUT_FREQUENCY) < Date.now()) {
      setLastCoordRecorded(Date.now())
      const coord = convertEventToCoord(e, canvasRef.current)
      setTrueCoordinates([...trueCoordinates, coord])
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

function dist(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  return sqrt(x * x + y * y);
}

function calcLength(coordinates) {
  let sum = 0;
  for (let i = 1; i < coordinates.length; i++) {
    let a = coordinates[i - 1]
    let b = coordinates[i]
    sum += dist(a, b);
  }
  return sum;
}

function convertEventToCoord(e, canvas) {
  const rect = canvas.getBoundingClientRect()
  return [e.clientX - rect.left, e.clientY - rect.top]
}

export default DrawingInput
