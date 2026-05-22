// Простий локальний словник початкових слів
const initialWords = [
  {eng:"Apple", native:"Яблуко"},
  {eng:"Book", native:"Книга"},
  {eng:"School", native:"Школа"},
  {eng:"Computer", native:"Комп'ютер"},
  {eng:"Friend", native:"Друг"}
];

const storageKey = "my_dictionary_v1";
const dictEl = document.getElementById('dictionary');
const template = document.getElementById('card-template');
const form = document.getElementById('add-word-form');
const translateInput = document.getElementById('translate-input');
const translateBtn = document.getElementById('translate-btn');
const translateResult = document.getElementById('translate-result');
const langSelect = document.getElementById('lang-select');

function loadWords(){
  const raw = localStorage.getItem(storageKey);
  if(raw) return JSON.parse(raw);
  localStorage.setItem(storageKey, JSON.stringify(initialWords));
  return initialWords.slice();
}

function saveWords(list){
  localStorage.setItem(storageKey, JSON.stringify(list));
}

function render(){
  dictEl.innerHTML = '';
  const words = loadWords();
  words.forEach((w, idx) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector('.card');
    node.querySelector('.eng').textContent = w.eng;
    node.querySelector('.native').textContent = w.native;
    const removeBtn = node.querySelector('.remove');
    const flipBtn = node.querySelector('.flip');
    const favBtn = node.querySelector('.fav');

    removeBtn.addEventListener('click', () => {
      const list = loadWords();
      list.splice(idx,1);
      saveWords(list);
      render();
    });

    flipBtn.addEventListener('click', () => {
      const p = card.querySelector('.native');
      p.style.display = p.style.display === 'none' ? 'block' : 'none';
    });

    favBtn.addEventListener('click', () => {
      favBtn.classList.toggle('active');
      favBtn.style.color = favBtn.classList.contains('active') ? '#ffdd57' : '';
    });

    dictEl.appendChild(node);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const eng = document.getElementById('eng-word').value.trim();
  const native = document.getElementById('native-word').value.trim();
  if(!eng || !native) return;
  const list = loadWords();
  list.unshift({eng, native});
  saveWords(list);
  form.reset();
  render();
});

// Простий локальний "перекладач" — спочатку шукає в словнику, імітує зовнішній API
translateBtn.addEventListener('click', () => {
  const q = translateInput.value.trim();
  if(!q){ translateResult.textContent = 'Введіть слово.'; return; }
  const list = loadWords();
  const found = list.find(x => x.eng.toLowerCase() === q.toLowerCase());
  if(found){
    translateResult.textContent = found.native;
    return;
  }
  // Якщо не знайдено — показати підказку і симулювати "зовнішній" переклад
  const lang = langSelect.value;
  // Проста симуляція: додаємо закінчення для демонстрації (реально: тут можна викликати API)
  const simulated = q + (lang === 'uk' ? ' — (симульований переклад)' : ' — (simulated)');
  translateResult.textContent = simulated;
});

render();
