import confetti from 'canvas-confetti';

const count = 800;
const heart = confetti.shapeFromPath({
  path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
  // @ts-ignore
  matrix: [0.03333333333333333, 0, 0, 0.03333333333333333, -5.566666666666666, -5.533333333333333]
});

function fire(particleRatio: number, opts: any) {
  confetti({
    origin: { y: 0.6 },
    ...opts,
    shapes: [heart],
    particleCount: Math.floor(count * particleRatio),
    colors: ['#F97293', '#A168A3', '#FA3C6C', '#4388DD', '#063B71', '#258AC1']
  });
}

function generateRandomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

const heartFireworks = () => {
  const width = window.innerWidth;

  const scalar = () => {
    if (width < 1800) {
      return generateRandomInRange(1.6, 2.3);
    }

    if (width < 2200) {
      return generateRandomInRange(2.3, 3.3);
    }

    return generateRandomInRange(3.3, 4.3);
  };

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    scalar: scalar()
  });
  fire(0.2, {
    spread: 60,
    scalar: scalar()
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: scalar()
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: scalar()
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    scalar: scalar()
  });
};

export default heartFireworks;
