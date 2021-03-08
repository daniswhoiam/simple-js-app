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

// Display the data on the page as an unordered list
document.write('<ul class="pokemon-list">');
for (let i = 0; i < pokemonList.length; i++) {
  let currentPokemon = pokemonList[i];

  document.write(`
    <li class="pokemon-list__item">
      ${currentPokemon.name} (height: <span>${currentPokemon.height}</span>)
  `);
  if (currentPokemon.height > 0.4) {
    document.write(' - Wow, that\'s big!');
  }
  document.write('</li><br>');
}
document.write('</ul>');
