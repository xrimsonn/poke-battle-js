let url = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=150';
let pokemonList = [];
let pokemonOponents = [];
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
  pokemonOponents = [];
  for (let i = 1; i <= 3; i++) {
    let randPokemon = Math.floor(Math.random() * 150);
    pokemonOponents.push(pokemonList[randPokemon]);
  }
  console.log(pokemonOponents);
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

  if (pokemonOponents.length > 0) {
    let oponent = pokemonOponents.shift();

    const oponentPokemon = await fetchPokemon(oponent.url);
    const oponentStats = calculateTotalStats(oponentPokemon);

    const selectedPokemon = await fetchPokemon(pokemonURL);
    const selectedStats = calculateTotalStats(selectedPokemon);

    console.log(selectedStats);
    console.log(oponentStats);
    console.log();

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

    let button = document.createElement('button');
    button.innerHTML = 'Siguiente batalla';
    button.className = 'contrast';

    let div = document.createElement('div');
    div.className = 'versus';
    div.appendChild(pokemonSprite);
    div.appendChild(bolt);
    div.appendChild(oponentSprite);

    section.innerHTML = '';
    section.appendChild(title);
    section.appendChild(div);
    section.appendChild(strong);
    console.log(pokemonOponents);
    if (pokemonOponents.length !== 0) {
      button.style = 'margin-top: 1rem';
      section.appendChild(button);
    } else {
      button.innerHTML = 'Volver a jugar';
      button.style = 'margin-top: 1rem';
      section.appendChild(button);
      button.addEventListener('click', () => {
        location.reload();
      });
    }

    button.addEventListener('click', () => {
      startBattles(pokemonName);
    });
  }
}

async function load() {
  await selectPokemon();
  selectOponents();
}
