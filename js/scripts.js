// Setting up a general dataset
let pokemonList = [
  {
    name: 'Weedle',
    height: 0.3,
    types: [
      'bug',
      'poison'
    ]
  },
  {
    name: 'Pikachu',
    height: 0.4,
    types: [
      'electric'
    ]
  },
  {
    name: 'Bellsprout',
    height: 0.7,
    types: [
      'grass',
      'poison'
    ]
  }
];

function displayPokemon (pokemon) {
  document.write(`
    <li class="pokemon-list__item">
      ${pokemon.name} (height: <span>${pokemon.height}</span>)
  `);
  if (pokemon.height > 0.4) {
    document.write(' - Wow, that\'s big!');
  }
  document.write('</li><br>');
}

// Display the data on the page as an unordered list
document.write('<ul class="pokemon-list">');
pokemonList.forEach(displayPokemon);
document.write('</ul>');
