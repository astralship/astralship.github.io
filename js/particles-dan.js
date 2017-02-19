var width = window.innerWidth;
var height = window.innerHeight;

function range(x) {
  var xs = [];
  for (var i = 0; i < x; i++) {
    xs[i] = i;
  }
  return xs;
}

function distance(a, b) {
  return (
    Math.sqrt(
      Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2)
    )
  );
}

function rgba(r, g, b, a) {
  return 'rgba(' + [r, g, b, a].join(',') + ')';
}

function Particle() {
  return {
    x: Math.floor(Math.random() * window.innerWidth),
    y: Math.floor(Math.random() * window.innerHeight),
    i: (Math.random() - .5) / 2,
    j: (Math.random() - .5) / 2
  };
}

function move(particle) {
  particle.x += particle.i;
  particle.y += particle.j;
  return particle;
}

function bounce(particle) {
  var x = particle.x;
  var y = particle.y;

  if (x <= 0 || x > width) particle.i = -particle.i;
  if (y <= 0 || y > height) particle.j = -particle.j;

  return particle;
}

function update(particle) {
  return (
    bounce(
      move(
        particle
      )
    )
  )
}

function simulate(particles) {
  return particles.map(update);
}

function attach(particles, canvas) {
  var queue = [];
  var mouse = { x: width / 2, y: height / 2 };
  var context = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('click', function(e) {
    var particle = Particle();
    particle.x = e.clientX;
    particle.y = e.clientY;
    queue.push(particle);
  });

  function next(particles) {
    var scene = realize(particles, mouse);
    render(scene, context);

    if (queue.length > 0) {
      particles = particles.concat(queue);
      queue = [];
    }

    requestAnimationFrame(function() {
      next(simulate(particles))
    });
  }

  next(particles);
}

function realize(particles, light) {
  var points = [];
  var lines = [];

  particles.forEach(function(particle) {
    var r = Math.floor(30 + (particle.x / width) * 50);
    var g = Math.floor(50 + (particle.y / height) * 50);
    var a = .2 + Math.max(0, 500 - distance(light, particle)) / 500;

    points.push({
      x: particle.x,
      y: particle.y,
      r: 3,
      color: rgba(r + 80, g + 50, 180, a)
    });

    particles.forEach(function(sibling) {
      if (sibling === particle) return;
      var visibility = (100 - distance(particle, sibling)) / 100;

      if (visibility > 0) {
        lines.push({
          start: particle,
          end: sibling,
          color: rgba(r, g, 220, visibility * a)
        });
      }
    });
  });

  return { points, lines };
}

function render(scene, context) {
  context.clearRect(0, 0, width, height);

  scene.lines.forEach(function(line) {
    context.strokeStyle = line.color;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(line.start.x, line.start.y);
    context.lineTo(line.end.x, line.end.y);
    context.stroke();
  });

  scene.points.forEach(function(point) {
    context.fillStyle = point.color;
    context.beginPath();
    context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    context.fill();
  });
}

var canvases = document.getElementsByTagName('canvas');

for (var i = 0; i < canvases.length; i++) {
  attach(
    range(100).map(Particle),
    canvases[i]
  );
}

