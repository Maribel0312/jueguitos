const animals = [
  { id: 'cow', name: 'Delfin', emoji: '🐬', onomatopoeia: 'mami mami mami' },
  { id: 'hen', name: 'Gallina', emoji: '🐔', onomatopoeia: 'cloc-cloc... clo-clo-clo' },
  { id: 'pig', name: 'Cerdo', emoji: '🐷', onomatopoeia: 'oink... oink oink... oink' },
  { id: 'sheep', name: 'Oveja', emoji: '🐑', onomatopoeia: 'beee... beeeeee' },
  { id: 'horse', name: 'Caballo', emoji: '🐴', onomatopoeia: 'hiii-haa... hiii' },
  { id: 'goat', name: 'Cabra', emoji: '🐐', onomatopoeia: 'beeh... beeh' },
  { id: 'duck', name: 'Pato', emoji: '🦆', onomatopoeia: 'cuac... cuac cuac' },
  { id: 'dog', name: 'Perro', emoji: '🐕', onomatopoeia: 'guau... guau guau' },
  { id: 'cat', name: 'Gato', emoji: '🐈', onomatopoeia: 'miau... miau miau' },
  { id: 'donkey', name: 'Burro', emoji: '🫎', onomatopoeia: 'ii-iooo... ii-io' }
];

let score = 0;
let current = null;
let freeMode = false;
let questionsLeft = 0;
let totalQuestions = 0;

const animalsEl = document.getElementById('animals');
const playBtn = document.getElementById('play-sound');
const newBtn = document.getElementById('new-quiz');
const modeFree = document.getElementById('mode-free');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const remainingEl = document.getElementById('remaining');
const questionsCountEl = document.getElementById('questions-count');

function createAnimalButtons(){
  animalsEl.innerHTML = '';
  animals.forEach(a => {
    const div = document.createElement('div');
    div.className = 'animal';
    const btn = document.createElement('button');
    btn.title = a.name;
    btn.dataset.id = a.id;
    // try to load an image from assets/images/{id}.*; if not found, fall back to emoji
    const img = document.createElement('img');
    img.className = 'animal-img';
    img.alt = a.name;
    const basePath = `assets/images/${a.id}`;
    // prefer webp, then png, then jpg
    const tryPaths = [`${basePath}.webp`, `${basePath}.png`, `${basePath}.jpg`];
    let loaded = false;
    function setEmoji(){
      img.remove();
      btn.textContent = a.emoji;
    }
    // attempt to set src progressively
    (function tryNext(i){
      if (i>=tryPaths.length){
        setEmoji();
        return;
      }
      img.src = tryPaths[i];
      img.onload = ()=>{
        // image exists, replace button content with image
        btn.textContent = '';
        btn.appendChild(img);
        loaded = true;
      };
      img.onerror = ()=>{
        tryNext(i+1);
      };
    })(0);
    btn.addEventListener('click', () => onAnimalClick(a));
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = a.name;
    div.appendChild(btn);
    div.appendChild(label);
    animalsEl.appendChild(div);
  });
}

function speak(text){
  if (!('speechSynthesis' in window)) return fallbackBeep();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-ES';
  u.rate = 0.9;
  // make longer onomatopoeias sound clearer: slightly slower and add pauses
  u.pitch = 1.0;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function fallbackBeep(){
  // simple fallback: beep using Oscillator if SpeechSynthesis not available
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = 600;
    o.connect(ctx.destination);
    o.start();
    setTimeout(()=>{o.stop();ctx.close()},200);
  }catch(e){console.log('audio fallback failed', e)}
}

function pickRandom(){
  const i = Math.floor(Math.random()*animals.length);
  return animals[i];
}

function startQuiz(){
  totalQuestions = parseInt(questionsCountEl.value, 10) || 5;
  questionsLeft = totalQuestions;
  score = 0;
  scoreEl.textContent = score;
  updateRemaining();
  feedbackEl.textContent = 'Empieza el quiz: escucha la onomatopeya y elige el animal.';
  nextQuestion();
}

function updateRemaining(){
  remainingEl.textContent = questionsLeft > 0 ? questionsLeft : 0;
}

function nextQuestion(){
  if (questionsLeft <= 0){
    feedbackEl.textContent = `Quiz finalizado — puntuación: ${score} / ${totalQuestions}`;
    speak(`Has terminado. Tu puntuación es ${score} de ${totalQuestions}`);
    current = null;
    updateRemaining();
    return;
  }
  current = pickRandom();
  // speak a slightly longer prompt to improve understanding
  const text = `${current.onomatopoeia}. ¿Qué animal hace este sonido?`;
  feedbackEl.textContent = `Pregunta: escucha y elige (restan ${questionsLeft})`;
  speak(text);
}

function onAnimalClick(animal){
  if (freeMode){
    speak(animal.onomatopoeia);
    return;
  }
  if (!current){
    feedbackEl.textContent = 'Pulsa "Nuevo (Quiz)" para empezar.';
    return;
  }
  if (animal.id === current.id){
    score++;
    feedbackEl.textContent = '✅ ¡Correcto!';
    speak('¡Correcto!');
  } else {
    score = Math.max(0, score-1);
    feedbackEl.textContent = '❌ Intenta otra vez';
    speak('Intenta otra vez');
  }
  scoreEl.textContent = score;
  // advance question count
  questionsLeft = Math.max(0, questionsLeft - 1);
  updateRemaining();
  setTimeout(()=>{
    nextQuestion();
  }, 900);
}

playBtn.addEventListener('click', ()=>{
  if (!current){ startQuiz(); return; }
  if (current) speak(current.onomatopoeia + '.');
});

newBtn.addEventListener('click', ()=>{
  startQuiz();
});

modeFree.addEventListener('change', (e)=>{
  freeMode = e.target.checked;
  feedbackEl.textContent = freeMode ? 'Modo libre activado — haz clic en un animal para escuchar su onomatopeya.' : '';
});

createAnimalButtons();

// auto-start a quiz after load
window.addEventListener('load', ()=>{
  // small warmup utterance to allow voice loading
  setTimeout(()=>{
    startQuiz();
  }, 400);
});
