document.addEventListener('DOMContentLoaded', function(){
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal main content immediately (no countdown)
  document.body.classList.add('revealed');

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, {threshold:0.15});
    items.forEach(function(el){ obs.observe(el); });
  } else {
    // Fallback: just show everything if IntersectionObserver isn't supported
    items.forEach(function(el){ el.classList.add('in'); });
  }

  // Custom cursor + magnetic hover (desktop / fine pointer only)
  if(!prefersReduced && window.matchMedia('(pointer: fine)').matches){
    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');

    if(dot && ring){
      var mx = 0, my = 0, rx = 0, ry = 0;

      window.addEventListener('mousemove', function(e){
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
      });

      function ringLoop(){
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        requestAnimationFrame(ringLoop);
      }
      ringLoop();

      var magnetic = document.querySelectorAll('nav a, .side-links a, .card-links a, .contact-row a, .card');
      magnetic.forEach(function(el){
        el.addEventListener('mouseenter', function(){ ring.classList.add('grow'); });
        el.addEventListener('mouseleave', function(){
          ring.classList.remove('grow');
          el.style.transform = '';
        });
        el.addEventListener('mousemove', function(e){
          var rect = el.getBoundingClientRect();
          var relX = e.clientX - rect.left - rect.width / 2;
          var relY = e.clientY - rect.top - rect.height / 2;
          var strength = el.classList.contains('card') ? 0.06 : 0.25;
          el.style.transform = 'translate(' + (relX * strength) + 'px,' + (relY * strength) + 'px)';
        });
      });
    }
  }
});
