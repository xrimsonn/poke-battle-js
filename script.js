// Implementación de una pila
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

// Implementación de una cola
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

// Inicialización de las variables
let url = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=150';
let pokemonList = [];
let battleHistory = new Stack();
let pokemonOponents = new Queue();
let pokemonName = '';
let pokemonURL = '';

// Función para capitalizar la primera letra de una palabra
function capitalizeFirstLetter(string) {
  return string
    ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    : '';
}

// Función para guardar los nombres y URL's de los pokemones de la API
async function fetchPokeAPI(url) {
  // Obtenemos la respuesta
  const response = await fetch(url);
  // La convertimos a formato JSON
  const data = await response.json();
  // Guardamos todos los pokemones en la lista
  data.results.forEach((pokemon) => {
    pokemonList.push(pokemon);
  });
}

// Función para devolver los detalles de un pokemon especifico con su URL
async function fetchPokemon(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Función para calcular el total de los stats de un pokemon
function calculateTotalStats(pokemon) {
  let totalStats = 0;
  pokemon.stats.forEach((stat) => {
    totalStats += stat.base_stat;
  });
  return totalStats;
}

// Función para cargar los pokemones en el select
async function selectPokemon() {
  await fetchPokeAPI(url);
  let select = document.getElementById('pokemonSelect');
  pokemonList.forEach((pokemon) => {
    let option = document.createElement('option');
    // Le asignamos el texto y el valor a cada opcion del select
    option.value = pokemon.name;
    option.text = capitalizeFirstLetter(pokemon.name);
    select.appendChild(option);
  });
}

// Función para seleccionar los rivales
function selectOponents() {
  // Cola de rivales a enfrentar
  pokemonOponents = new Queue();
  for (let i = 1; i <= 5; i++) {
    let randPokemon = Math.floor(Math.random() * 150);
    // Metemos al final de la cola de rivales 3 pokemones al azar de la lista
    pokemonOponents.enqueue(pokemonList[randPokemon]);
  }
}

// Función para obtener el pokemon seleccionado
function getPokemon() {
  let pokemonName = document.getElementById('pokemonSelect').value;
  startBattles(pokemonName);
}

// Función para iniciar las batallas
async function startBattles(pokemonName) {
  let section = document.getElementsByTagName('section')[0];
  let winner = '';

  // Buscamos la URL del pokemon introducido
  pokemonURL = pokemonList.find((pokemon) => {
    return pokemon.name === pokemonName;
  }).url;

  if (pokemonOponents.size() > 0) {
    // Si la cola no esta vacia, descolamos el primer elemento
    let oponent = pokemonOponents.dequeue();

    // Obtenemos los detalles de los pokemones
    const oponentPokemon = await fetchPokemon(oponent.url);
    const oponentStats = calculateTotalStats(oponentPokemon);
    const selectedPokemon = await fetchPokemon(pokemonURL);
    const selectedStats = calculateTotalStats(selectedPokemon);

    // Comparamos los stats de los pokemones para determinar al ganador
    winner =
      selectedStats > oponentStats ? selectedPokemon.name : oponentPokemon.name;
    let title = document.createElement('h3');
    title.innerText = 'Rival: ' + capitalizeFirstLetter(oponent.name);

    // Creamos los elementos para mostrar los pokemones
    let pokemonSprite = document.createElement('img');
    pokemonSprite.src = selectedPokemon.sprites.front_default;
    let bolt = document.createElement('i');
    bolt.classList.add('fa-solid', 'fa-bolt', 'fa-fade');
    let oponentSprite = document.createElement('img');
    oponentSprite.src = oponentPokemon.sprites.front_default;

    // Creamos el elemento para mostrar el ganador
    let strong = document.createElement('strong');
    strong.innerHTML =
      winner.toLowerCase() === pokemonName.toLowerCase()
        ? '<ins>Ganador: ' + capitalizeFirstLetter(winner) + '</ins>'
        : '<del>Ganador: ' + capitalizeFirstLetter(winner) + '</del>';

    // Creamos los botones para la siguiente batalla y para ver el ultimo resultado
    let nextButton = document.createElement('button');
    nextButton.innerHTML = 'Siguiente batalla';
    nextButton.className = 'contrast';
    let lastButton = document.createElement('button');
    lastButton.innerHTML = 'Ver ultimo resultado';
    lastButton.className = 'contrast';

    // Creamos el div que contendra los pokemones
    let div = document.createElement('div');
    div.className = 'versus';
    div.appendChild(pokemonSprite);
    div.appendChild(bolt);
    div.appendChild(oponentSprite);

    // Limpiamos el section y agregamos los elementos
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

    // Eventos de los botones
    nextButton.onclick = () => {
      // Guardamos el resultado de la batalla en la pila
      battleHistory.push(strong.innerHTML);
      // Iniciamos la siguiente batalla
      startBattles(pokemonName);
    };

    lastButton.onclick = () => {
      // Mostramos el ultimo resultado
      let prevStrong = document.createElement('strong');
      prevStrong.innerHTML = battleHistory.pop(); 
      section.append(prevStrong);
      // Eliminamos el boton de ver ultimo resultado
      section.removeChild(lastButton);
    };
  }
}

// Función para cargar las demas funciones
async function load() {
  await selectPokemon();
  selectOponents();
}
