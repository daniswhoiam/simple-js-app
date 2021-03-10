// Setting up a general dataset in an IIFE
let pokemonRepository = (function () {
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

  function getAll() {
    return pokemonList;
  }

  function add(item) {
    // Check first if the item is an object
    if (typeof item === 'object') {
      // Further check if the number and types of object keys are right
      let rightKeys = ['name', 'height', 'types'];
      let itemNumberOfKeys = Object.keys(item).length;
      let itemHasRightKeys = rightKeys.every( function (key) {
        return Object.keys(item).includes(key);
      });

      if (itemNumberOfKeys === 3 && itemHasRightKeys) {
        pokemonList.push(item);
      } else {
        console.log("The item you are trying to add has an invalid number and/or invalid types of keys.")
      }
    } else {
      console.log("The item you are trying to add is not of the required type (object).")
    }
  }

  function findPokemonByName(name) {
    // Only matches if the search parameter is exactly (!) the name
    let searchResult = pokemonList.filter( function(pokemon) {
      return pokemon.name === name;
    });
    // Make sure that there is a search result and it is only one
    if (searchResult && searchResult.length === 1) {
      return searchResult[0];
    } else {
      console.log("The pokemon you have been searching for does not exist. (Or there is a typo in your search)");
    }
  }

  return {
    getAll: getAll,
    add: add,
    findPokemonByName: findPokemonByName
  }
})();


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
pokemonRepository.getAll().forEach(displayPokemon);
document.write('</ul>');
