//© Zero - Código libre no comercial


// Cargar el SVG y animar los corazones
fetch('Img/hermoso-ramo-flores-dibujado-mano_44538-13746.svg')
  .then(res => res.text())
  .then(svgText => {
    const container = document.getElementById('tree-container');
    container.innerHTML = svgText;
    const svg = container.querySelector('svg');
    if (!svg) return;

    // Detectar automáticamente el tamaño del SVG y ajustar el contenedor
    const svgWidth = svg.getAttribute('width');
    const svgHeight = svg.getAttribute('height');
    
    // Extraer números del atributo width/height (ej: "500px" -> 500)
    const width = parseInt(svgWidth) || 500;
    const height = parseInt(svgHeight) || 500;
    
    // Calcular el tamaño óptimo del contenedor basado en el viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Para desktop: usar el 60% del viewport más pequeño
    const maxSize = Math.min(viewportWidth, viewportHeight) * 0.6;
    
    // Para móvil: usar el 80% del viewport más pequeño
    const isMobile = window.innerWidth <= 700;
    const mobileMaxSize = Math.min(viewportWidth, viewportHeight) * 0.8;
    
    const containerSize = isMobile ? mobileMaxSize : maxSize;
    
    // Aplicar el tamaño calculado al contenedor
    container.style.width = containerSize + 'px';
    container.style.height = containerSize + 'px';
    container.style.maxWidth = '95vw';
    container.style.maxHeight = '85vh';
    
    // Hacer la animación inicial 3 veces más rápida
    svg.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
    svg.style.opacity = '0';
    svg.style.transform = 'scale(0.3)';
    
    setTimeout(() => {
      svg.style.opacity = '1';
      svg.style.transform = 'scale(1)';
    }, 50);
    
    // Calcular el viewBox real basado en el contenido del SVG
    function calculateViewBox(svgElement) {
      const paths = svgElement.querySelectorAll('path');
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      paths.forEach(path => {
        const d = path.getAttribute('d');
        if (d) {
          // Extraer coordenadas del path (simplificado)
          const coords = d.match(/[ML]\s*([-\d.]+)\s*,\s*([-\d.]+)/g);
          if (coords) {
            coords.forEach(coord => {
              const match = coord.match(/[ML]\s*([-\d.]+)\s*,\s*([-\d.]+)/);
              if (match) {
                const x = parseFloat(match[1]);
                const y = parseFloat(match[2]);
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
              }
            });
          }
        }
      });
      
      // Si no se encontraron coordenadas válidas, usar valores por defecto
      if (minX === Infinity) {
        return '0 0 500 500';
      }
      
      // Agregar un pequeño margen
      const margin = 10;
      const width = maxX - minX + margin * 2;
      const height = maxY - minY + margin * 2;
      
      return `${minX - margin} ${minY - margin} ${width} ${height}`;
    }
    
    // Agregar viewBox al SVG si no lo tiene para que se vea completo
    if (!svg.getAttribute('viewBox')) {
      const viewBox = calculateViewBox(svg);
      svg.setAttribute('viewBox', viewBox);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }
    
    // Asegurar que el SVG se ajuste al contenedor
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.objectFit = 'contain';

    // Animación de "dibujo" para todos los paths
    const allPaths = Array.from(svg.querySelectorAll('path'));
    allPaths.forEach(path => {
      path.style.stroke = '#222';
      path.style.strokeWidth = '2.5';
      path.style.fillOpacity = '0';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
    });

    // Forzar reflow y luego animar
    setTimeout(() => {
      allPaths.forEach((path, i) => {
        path.style.transition = `stroke-dashoffset 0.16s cubic-bezier(.77,0,.18,1) ${i * 0.008}s, fill-opacity 0.06s ${0.12 + i * 0.008}s`;
        path.style.strokeDashoffset = 0;
        setTimeout(() => {
          path.style.fillOpacity = '1';
          path.style.stroke = '';
          path.style.strokeWidth = '';
        }, 160 + i * 8);
      });

      // Después de la animación de dibujo, mueve y agranda el SVG
      const totalDuration = 160 + (allPaths.length - 1) * 8 + 60;
      setTimeout(() => {
        // Calcular el movimiento proporcional al tamaño del contenedor
        const containerRect = container.getBoundingClientRect();
        const isMobile = window.innerWidth <= 700;
        
        let moveX, moveY, scale;
        
        if (isMobile) {
          // En móvil: mover hacia abajo y centrar horizontalmente
          moveX = 0; // No mover horizontalmente
          moveY = containerRect.height * 0.15; // 15% hacia abajo
          scale = 1.1; // Escala más pequeña para móvil
        } else {
          // En desktop: mover hacia la derecha
          moveX = containerRect.width * 0.3; // 30% del ancho del contenedor
          moveY = 0; // No mover verticalmente en desktop
          scale = 1.2;
        }
        
        // Aplicar transformación personalizada
        svg.style.transition = 'transform 1.2s cubic-bezier(.77,0,.18,1)';
        svg.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
        
        // Mostrar texto con efecto typing
        setTimeout(() => {
          showDedicationText();
          // Mostrar petalos flotando
          startFloatingObjects();
          // Mostrar cuenta regresiva
          showCountdown();
          // Iniciar música de fondo
          playBackgroundMusic();
        }, 160); //Tiempo para agrandar el SVG
      }, totalDuration);
    }, 50);

    // Selecciona los corazones (formas rojas)
    const heartPaths = allPaths.filter(el => {
      const style = el.getAttribute('style') || '';
      return style.includes('#FC6F58') || style.includes('#ffffffff');
    });
    heartPaths.forEach(path => {
      path.classList.add('animated-heart');
    });
  });

// Efecto máquina de escribir para el texto de dedicatoria (seguidores)
function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() { //seguidores
  let text = getURLParam('text');
  if (!text) {
  text = `Para la loquita de mi vida:\n\nNo inicie queriendote cuando te conocí, inicie al igual que tu,(queriendo usarte aunque yo para algo sin importancia xd) y con ello mi error, el mejor que pude cometer porque sin el no habría tenido la oportunidad de prepararme para enamorarme así de ti. ¿De que me enamore? Tu sonrisa, tu voz, tu forma de ser… todo en ti me enamoro y todo lo que hay en ti se encargara de enamorarme el resto de tiempo que sigue. No planeo volver a alejarme de ti.\n\nYo no podre darte una carta hecha a mano,ahora mismo no podras darme algo que usar en los momento más importantes de mi vida. Pero si te quedas conmigo y me das tu confianza... Los momentos importantes de mi vida los compartire contigo y las cartas serán leidas frente a ti cada que pueda verte.\n\nTe amo más de lo que las palabras pueden expresar y no quiero seguir diciendo esto aqui. ¡¡¡VUELVE JULIA!!!`;  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 686 : 88);
    } else {
      // Al terminar el typing, mostrar la firma animada
      setTimeout(showSignature, 600);
      
      // En móvil: después de mostrar la firma, esperar 6 segundos y luego iniciar la secuencia especial
      const isMobile = window.innerWidth <= 700;
      if (isMobile) {
        setTimeout(startMobileSequence, 6600); // 600ms firma + 6000ms espera = 6600ms total
      }
    }
  }
  type();
}

// Firma manuscrita animada
function showSignature() {
  // Cambia para buscar la firma dentro del contenedor de dedicatoria
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Con amor(no sabia que tenia), Asahel";
  signature.classList.add('visible');
}

// Secuencia especial para móvil
function startMobileSequence() {
  const dedication = document.getElementById('dedication-text');
  const container = document.getElementById('tree-container');
  const svg = container.querySelector('svg');
  
  // 1. Desaparecer el texto con animación
  dedication.style.transition = 'opacity 0.8s ease-out';
  dedication.style.opacity = '0';
  
  // 2. Desaparecer la flor como se dibujó pero en reversa
  setTimeout(() => {
    const allPaths = svg.querySelectorAll('path');
    
    // Animar la desaparición en reversa (del último al primero)
    allPaths.forEach((path, i) => {
      const reverseIndex = allPaths.length - 1 - i;
      setTimeout(() => {
        path.style.transition = 'stroke-dashoffset 0.16s cubic-bezier(.77,0,.18,1), fill-opacity 0.06s';
        path.style.strokeDashoffset = path.getTotalLength();
        path.style.fillOpacity = '0';
        path.style.stroke = '#e60026';
        path.style.strokeWidth = '2';
      }, reverseIndex * 8); // Mismo delay que la aparición pero en reversa
    });
    
    // 3. Cambiar a treelove.svg después de que termine la desaparición
    const totalDisappearTime = allPaths.length * 8 + 200;
    setTimeout(() => {
      loadTreeLoveSVG();
    }, totalDisappearTime);
  }, 800);
}

// Cargar y animar treelove.svg
function loadTreeLoveSVG() {
  const container = document.getElementById('tree-container');
  
  fetch('Img/treelove.svg')
    .then(res => res.text())
    .then(svgText => {
      container.innerHTML = svgText;
      const svg = container.querySelector('svg');
      if (!svg) return;
      
      // Configurar el SVG
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.opacity = '1';
      
      // Obtener todos los paths del árbol
      const allPaths = svg.querySelectorAll('path');
      
      // Configurar cada path para la animación de dibujado (invisible inicialmente)
      allPaths.forEach((path, i) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.stroke = '#e60026';
        path.style.strokeWidth = '2';
        path.style.fillOpacity = '0';
        path.style.opacity = '0'; // Inicialmente invisible
      });
      
      // Animar el dibujado del árbol (más lento que la flor)
      setTimeout(() => {
        allPaths.forEach((path, i) => {
          // Hacer visible el path
          path.style.opacity = '1';
          
          // Animar el dibujado
          path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.12}s, fill-opacity 0.6s ${1.0 + i * 0.12}s`;
          path.style.strokeDashoffset = 0;
          
          setTimeout(() => {
            path.style.fillOpacity = '1';
            path.style.stroke = '';
            path.style.strokeWidth = '';
          }, 1200 + i * 120);
        });
        
        // Mostrar el mensaje final después de que termine la animación del árbol
        const totalTreeAnimationTime = 1200 + (allPaths.length - 1) * 120 + 600;
        setTimeout(() => {
          showFinalMessage();
        }, totalTreeAnimationTime);
      }, 100);
    });
}

// Mostrar mensaje final con efecto typing
function showFinalMessage() {
  const container = document.getElementById('tree-container');
  const message = document.createElement('div');
  message.className = 'final-message';
  message.style.cssText = `
    position: absolute;
    bottom: -60px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.2rem;
    color: #e60026;
    text-align: center;
    opacity: 1;
    z-index: 10;
  `;
  
  container.appendChild(message);
  
  // Efecto typing para el mensaje final (más lento)
  const finalText = 'Te amo mi Loquita.';
  let i = 0;
  
  function typeFinalMessage() {
    if (i <= finalText.length) {
      message.textContent = finalText.slice(0, i);
      i++;
      setTimeout(typeFinalMessage, 140); // 140ms por carácter (40% más lento)
    }
  }
  
  setTimeout(typeFinalMessage, 300);
}



// Controlador de objetos flotantes
function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';
    // Posición inicial
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    // Animación flotante
    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);

    // Eliminar después de animar
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    // Generar más objetos
    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

// Cuenta regresiva o fecha especial
function showCountdown() {
  const container = document.getElementById('countdown');
  let startParam = getURLParam('start');
  let eventParam = getURLParam('event');
  let startDate = startParam ? new Date(startParam + 'T00:00:00') : new Date('2024-01-27T00:00:00'); 
  let eventDate = eventParam ? new Date(eventParam + 'T00:00:00') : new Date('2026-01-27T00:00:00');

  function update() {
    const now = new Date();
    let diff = now - startDate;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let eventDiff = eventDate - now;
    let eventDays = Math.max(0, Math.floor(eventDiff / (1000 * 60 * 60 * 24)));
    let eventHours = Math.max(0, Math.floor((eventDiff / (1000 * 60 * 60)) % 24));
    let eventMinutes = Math.max(0, Math.floor((eventDiff / (1000 * 60)) % 60));
    let eventSeconds = Math.max(0, Math.floor((eventDiff / 1000) % 60));

    container.innerHTML =
      `Llevamos desde mi idiotez: <b>${days}</b> días<br>` +
      `Mi proxima idiotez(no mentira xd)será en: <b>${eventDays}d ${eventHours}h ${eventMinutes}m ${eventSeconds}s</b>`;
    container.classList.add('visible');
  }
  update();
  setInterval(update, 1000);
}

// --- Música de fondo ---
function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  // --- Opción archivo local por parámetro 'musica' ---
  let musicaParam = getURLParam('musica');
  if (musicaParam) {
    // Decodifica y previene rutas maliciosas
    musicaParam = decodeURIComponent(musicaParam).replace(/[^\w\d .\-]/g, '');
    audio.src = 'Music/' + musicaParam;
  }

  // --- Opción YouTube (solo mensaje de ayuda) ---
  let youtubeParam = getURLParam('youtube');
  if (youtubeParam) {
    // Muestra mensaje de ayuda para descargar el audio
    let helpMsg = document.getElementById('yt-help-msg');
    if (!helpMsg) {
      helpMsg = document.createElement('div');
      helpMsg.id = 'yt-help-msg';
      helpMsg.style.position = 'fixed';
      helpMsg.style.right = '18px';
      helpMsg.style.bottom = '180px';
      helpMsg.style.background = 'rgba(255,255,255,0.95)';
      helpMsg.style.color = '#e60026';
      helpMsg.style.padding = '10px 16px';
      helpMsg.style.borderRadius = '12px';
      helpMsg.style.boxShadow = '0 2px 8px #e6002633';
      helpMsg.style.fontSize = '1.05em';
      helpMsg.style.zIndex = 100;
      helpMsg.innerHTML = 'Para usar música de YouTube, descarga el audio (por ejemplo, usando y2mate, 4K Video Downloader, etc.), colócalo en la carpeta <b>Music</b> y usa la URL así:<br><br><code>?musica=nombre.mp3</code>';
      document.body.appendChild(helpMsg);
      setTimeout(() => { if(helpMsg) helpMsg.remove(); }, 15000);
    }
  }

  let btn = document.getElementById('music-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'music-btn';
    btn.textContent = '🔊 Música';
    btn.style.position = 'fixed';
    btn.style.bottom = '18px';
    btn.style.right = '18px';
    btn.style.zIndex = 99;
    btn.style.background = 'rgba(255,255,255,0.85)';
    btn.style.border = 'none';
    btn.style.borderRadius = '24px';
    btn.style.padding = '10px 18px';
    btn.style.fontSize = '1.1em';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);
  }
  audio.volume = 0.7;
  audio.loop = true;
  // Intentar reproducir inmediatamente
  audio.play().then(() => {
    btn.textContent = '🔊 Música';
  }).catch(() => {
    // Si falla el autoplay, esperar click en el botón
    btn.textContent = '▶️ Música';
  });
  btn.onclick = () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = '🔊 Música';
    } else {
      audio.pause();
      btn.textContent = '🔈 Música';
    }
  };
}

// Intentar reproducir la música lo antes posible (al cargar la página)
window.addEventListener('DOMContentLoaded', () => {
  playBackgroundMusic();
});

// Ajustar el tamaño del contenedor cuando cambie el tamaño de la ventana
window.addEventListener('resize', () => {
  const container = document.getElementById('tree-container');
  const svg = container.querySelector('svg');
  if (svg) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 700;
    const maxSize = isMobile ? 
      Math.min(viewportWidth, viewportHeight) * 0.8 : 
      Math.min(viewportWidth, viewportHeight) * 0.6;
    
    container.style.width = maxSize + 'px';
    container.style.height = maxSize + 'px';
  }
});
