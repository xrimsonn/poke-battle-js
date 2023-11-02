let url = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=150';
let pokemonList = [];
let pokemonOponents = [];

function capitalizeFirstLetter(string) {
  return (string) ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase(): '';
}

function fetchPokeAPI() {
  fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data.results.forEach((pokemon) => {
      pokemonList.push(pokemon);
    });
    selectPokemon();
  });
}

async function selectPokemon() {
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
  for(let i = 1; i <= 3; i++){
    let randPokemon = Math.floor(Math.random() * 150);
    pokemonOponents.push(pokemonList[randPokemon]);
  }
}

function startBattles() {
  selectOponents();
  console.log(pokemonOponents);
  let section = document.getElementsByTagName('section')[0];
  section.innerHTML = '';
}

// pokemonJSON.then((data) => {
// let pokemonData = fetch(pokemon.url).then((response) => {
//   return response.json();
// });
// pokemonData.then((data) => {
//   pokemonList.push(data);
// });
// });


function load() {
  fetchPokeAPI();
}
