import { useMemo, useState, useRef } from 'react'
import * as Constants from './Constants'
import { complex, add, multiply, sqrt, pi, e, i, pow, square, floor, atan } from 'mathjs'
import { useEffect } from 'react';

function FourierCircles({ coordinates }) {
  const canvasRef = useRef(null);
  const [time, setTime] = useState(0);
  const complexCoords = useMemo(() => normalizeCoordinates(coordinates), [coordinates]);
  const fourierResults = useMemo(() => fourierTransform(complexCoords), [complexCoords]);
  const fourierWithFreqs = fourierResults.map((f, index) => [f, index - floor(fourierResults.length / 2)]);

  const mag = (c) => c.re * c.re + c.im * c.im;
  // filter out the circle with no frequency and use it as initial offset
  let noFrequencyCircle = fourierWithFreqs.find(f => f[1] == 0);
  let fourierSorted = fourierWithFreqs.filter(f => {
    return mag(f[0]) > 0.001 && f[1] != 0;
  })
    .sort((a, b) => {
      return mag(b[0]) - mag(a[0]);
    });

  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  if (ctx && noFrequencyCircle) {
    ctx.clearRect(0, 0, Constants.WIDTH, Constants.HEIGHT)

    ctx.beginPath();
    let base = noFrequencyCircle[0];
    let coord = unnormalize(base);
    ctx.moveTo(coord[0], coord[1])
    for (let f = 0; f < fourierSorted.length; f++) {
      const bin = fourierSorted[f][0];
      const frequency = fourierSorted[f][1];
      const a = bin.re; const b = bin.im
      // rotate the 
      let progress = (Date.now() % 10000) / 10000;
      // frequency is rotations per second.
      let rotatedBin = multiply(bin, pow(e, multiply(i, 2 * pi * frequency * progress)))

      // draw circle
      ctx.beginPath();
      ctx.arc(coord[0], coord[1], Constants.WIDTH / 2 * sqrt(mag(bin)), 0, 2 * pi);
      ctx.moveTo(coord[0], coord[1]);

      // draw line
      base = add(base, rotatedBin);
      coord = unnormalize(base);
      ctx.lineTo(coord[0], coord[1])
      ctx.stroke();
    }
  }

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now() % 1000), Constants.INPUT_FREQUENCY);
    return () => {
      clearInterval(interval);
    };
  }, [])

  return (
    <canvas
      id="canvas"
      width={Constants.WIDTH}
      height={Constants.HEIGHT}
      ref={canvasRef}
    />
  )
}

// scale into complex numbers with range [-1, 1]
function normalizeCoordinates(coordinates) {
  return coordinates.map(coord => {
    const real = (coord[0] - Constants.WIDTH / 2) / (Constants.WIDTH / 2);
    const imaginary = -1 * ((coord[1] - Constants.HEIGHT / 2) / (Constants.WIDTH / 2));
    return complex(real, imaginary);
  })
}
function unnormalize(coord) {
  const x2 = coord.re * (Constants.WIDTH / 2) + (Constants.WIDTH / 2);
  const y2 = -1 * coord.im * (Constants.WIDTH / 2) + (Constants.HEIGHT / 2);
  return [x2, y2];
}

function fourierTransform(coordinates) {
  const N = coordinates.length;
  const half = floor(N / 2);
  const frequencyBins = new Array(N);
  for (let k = 0 - half; k < N - half; k++) {
    let Xk = complex(0);
    for (let n = 0; n < N; n++) {
      const xn = coordinates[n];
      const exponent = multiply(-2 * pi * k * n * (1 / N), i)
      const power = pow(e, exponent)
      const addend = multiply(xn, power)
      Xk = add(Xk, addend);
    }
    frequencyBins[k + half] = multiply(Xk, 1 / N)
  }
  return frequencyBins;
}

export default FourierCircles