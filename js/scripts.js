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
      return {};
    }
  }

  function addListItem(pokemon) {
    let list = document.querySelector('.pokemon-list');

    // Creating main elements
    let listItem = document.createElement('li');
    listItem.setAttribute('role', 'listitem');

    let button = document.createElement('button');
    button.classList.add('pokemon-list__item');

    let span = document.createElement('span');

    // Setting the content of the button
    span.innerText = pokemon.height;
    button.innerText = `${pokemon.name} (height: `;
    button.appendChild(span);
    let textEnding = document.createTextNode(")");
    if (pokemon.height > 0.4) {
      textEnding.nodeValue += ' - Wow, that\'s big!';
    }
    button.appendChild(textEnding);

    /*
    Alternative solution to get <span> to work:

    let pattern = /\d+\.\d/i;
    let result = pattern.exec(button.innerHTML)[0];
    button.innerHTML = button.innerHTML.replace(result, `<span>${result}</span>`);
    */

    // Stick everything together
    list.appendChild(listItem);
    listItem.appendChild(button);

    // Add Event Handler
    handleEvents(button, pokemon);
  }

  function showDetails(pokemon) {
    console.log(pokemon);
  }

  function handleEvents(element, pokemon) {
    element.addEventListener('click', function () {
      showDetails(pokemon);
    })
  }

  return {
    getAll: getAll,
    add: add,
    findPokemonByName: findPokemonByName,
    addListItem: addListItem
  }
})();

// Add the data for each pokemon to the unordered list
pokemonRepository.getAll().forEach(pokemonRepository.addListItem);
