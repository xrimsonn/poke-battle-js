class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.items.length === 0) return 'No hay elementos en el stack';
    return this.items.pop();
  }

  size() {
    return this.items.length;
  }
}

class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.items.length === 0) return 'No hay elementos en la cola';
    return this.items.shift();
  }

  size() {
    return this.items.length;
  }
}

let url = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=150';
let pokemonList = [];
let battleHistory = new Stack();
let pokemonOponents = new Queue();
let pokemonName = '';
let pokemonURL = '';

function capitalizeFirstLetter(string) {
  return string
    ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    : '';
}

async function fetchPokeAPI(url) {
  const response = await fetch(url);
  const data = await response.json();
  data.results.forEach((pokemon) => {
    pokemonList.push(pokemon);
  });
}

async function fetchPokemon(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function calculateTotalStats(pokemon) {
  let totalStats = 0;
  pokemon.stats.forEach((stat) => {
    totalStats += stat.base_stat;
  });
  return totalStats;
}

async function selectPokemon() {
  await fetchPokeAPI(url);
  let select = document.getElementById('pokemonSelect');
  pokemonList.forEach((pokemon) => {
    let option = document.createElement('option');
    option.value = capitalizeFirstLetter(pokemon.name);
    option.text = capitalizeFirstLetter(pokemon.name);
    select.appendChild(option);
  });
}

function selectOponents() {
  pokemonOponents = new Queue();
  for (let i = 1; i <= 5; i++) {
    let randPokemon = Math.floor(Math.random() * 150);
    // Metemos al final de la cola de rivales 3 pokemones al azar de la lista
    pokemonOponents.enqueue(pokemonList[randPokemon]);
  }
}

function getPokemon() {
  let pokemonName = document.getElementById('pokemonSelect').value;
  startBattles(pokemonName);
}

async function startBattles(pokemonName) {
  let section = document.getElementsByTagName('section')[0];
  let winner = '';

  pokemonURL = pokemonList.find((pokemon) => {
    return pokemon.name === pokemonName.toLowerCase();
  }).url;

  if (pokemonOponents.size() > 0) {
    // Si la cola esta vacia, descolamos el primer elemento
    let oponent = pokemonOponents.dequeue();

    const oponentPokemon = await fetchPokemon(oponent.url);
    const oponentStats = calculateTotalStats(oponentPokemon);

    const selectedPokemon = await fetchPokemon(pokemonURL);
    const selectedStats = calculateTotalStats(selectedPokemon);

    winner =
      selectedStats > oponentStats ? selectedPokemon.name : oponentPokemon.name;

    let title = document.createElement('h3');
    title.innerText = 'Rival: ' + capitalizeFirstLetter(oponent.name);

    let pokemonSprite = document.createElement('img');
    pokemonSprite.src = selectedPokemon.sprites.front_default;
    let bolt = document.createElement('i');
    bolt.classList.add('fa-solid', 'fa-bolt', 'fa-fade');
    let oponentSprite = document.createElement('img');
    oponentSprite.src = oponentPokemon.sprites.front_default;

    let strong = document.createElement('strong');
    strong.innerHTML =
      winner.toLowerCase() === pokemonName.toLowerCase()
        ? '<ins>Ganador: ' + capitalizeFirstLetter(winner) + '</ins>'
        : '<del>Ganador: ' + capitalizeFirstLetter(winner) + '</del>';

    let nextButton = document.createElement('button');
    nextButton.innerHTML = 'Siguiente batalla';
    nextButton.className = 'contrast';

    let lastButton = document.createElement('button');
    lastButton.innerHTML = 'Ver ultimo resultado';
    lastButton.className = 'contrast';

    let div = document.createElement('div');
    div.className = 'versus';
    div.appendChild(pokemonSprite);
    div.appendChild(bolt);
    div.appendChild(oponentSprite);

    section.innerHTML = '';
    section.appendChild(title);
    section.appendChild(div);
    section.appendChild(strong);
    if (pokemonOponents.size() !== 0) {
      nextButton.style = 'margin-top: 1rem';
      section.appendChild(nextButton);
    } else {
      nextButton.innerHTML = 'Volver a jugar';
      nextButton.style = 'margin-top: 1rem';
      section.appendChild(nextButton);
      nextButton.addEventListener('click', () => {
        location.reload();
      });
    }
    if (battleHistory.size() > 0) {
      section.appendChild(lastButton);
    }

    nextButton.onclick = () => {
      battleHistory.push(strong.innerHTML);
      startBattles(pokemonName);
    };
    lastButton.onclick = () => {
      let prevStrong = document.createElement('strong');
      prevStrong.innerHTML = battleHistory.pop(); 
      section.append(prevStrong);
      section.removeChild(lastButton);
    };
  }
}

async function load() {
  await selectPokemon();
  selectOponents();
}
