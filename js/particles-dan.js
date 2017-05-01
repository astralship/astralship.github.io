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

function Particle(dimension) {
  return {
    x: Math.floor(Math.random() * dimension.width),
    y: Math.floor(Math.random() * dimension.height),
    i: (Math.random() - .5) / 2,
    j: (Math.random() - .5) / 2
  };
}

function move(particle) {
  particle.x += particle.i;
  particle.y += particle.j;
  return particle;
}

function bounce(particle, dimension) {
  var x = particle.x;
  var y = particle.y;

  if (x <= 0 || x > dimension.width) particle.i = -particle.i;
  if (y <= 0 || y > dimension.height) particle.j = -particle.j;

  return particle;
}

function update(particle, dimension) {
  return (
    bounce(
      move(particle), dimension
    )
  )
}

function simulate(particles, dimension) {
  return particles.map(function(particle) {
    return update(particle, dimension);
  });
}

function attach(particles, canvas, dimension) {
  var queue = [];
  var mouse = { x: dimension.width / 2, y: dimension.height / 2 };
  var context = canvas.getContext('2d');

  canvas.width = dimension.width;
  canvas.height = dimension.height;

  window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // NO CLICKING
  // window.addEventListener('click', function(e) {
  //   var particle = Particle();
  //   particle.x = e.clientX;
  //   particle.y = e.clientY;
  //   queue.push(particle);
  // });

  function next(particles, dimension) {
    var scene = realize(particles, mouse, dimension);
    render(scene, context, dimension);

    if (queue.length > 0) {
      particles = particles.concat(queue);
      queue = [];
    }

    requestAnimationFrame(function() {
      next(simulate(particles, dimension), dimension);
    });
  }

  next(particles, dimension);
}

function realize(particles, light, dimension) {
  var points = [];
  var lines = [];

  particles.forEach(function(particle) {
    var r = Math.floor(30 + (particle.x / dimension.width) * 50);
    var g = Math.floor(50 + (particle.y / dimension.height) * 50);
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

function render(scene, context, dimension) {
  context.clearRect(0, 0, dimension.width, dimension.height);

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

var particlesCount = Math.min(window.innerWidth / 6, 200);

for (var i = 0; i < canvases.length; i++) {
  var dimension = getDimension(canvases[i])
  attach(
    range(particlesCount).map(function(number) {
      return Particle(dimension);
    }),
    canvases[i],
    dimension
  );
}

function getDimension(canvasElement) {
  // We have jQuery so can afford it
  var parent = $(canvasElement).parent();
  return { width: parent.outerWidth(), height: parent.outerHeight() };
}

