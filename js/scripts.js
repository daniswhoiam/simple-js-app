// Setting up a general dataset in an IIFE
let pokemonRepository = (function () {
  let pokemonList = [];
  let apiURL = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function getAll() {
    return pokemonList;
  }

  function add(item) {
    // Check first if the item is an object
    if (typeof item === 'object') {
      // Further check if the number and types of object keys are right
      let rightKeys = ['name', 'height', 'types', 'detailsUrl'];
      let itemNumberOfKeys = Object.keys(item).length;
      let itemHasRightKeys = Object.keys(item).every( function (key) {
        return rightKeys.includes(key);
      })

      if (itemNumberOfKeys <= rightKeys.length && itemHasRightKeys) {
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
    button.setAttribute('id', pokemon.name);

    let span = document.createElement('span');
    span.classList.add('pokemon-height');

    // Setting the content of the button
    if (pokemon.height) {
      span.innerText = pokemon.height;
    } else {
      span.innerText = 'Click to find out!';
    }
    button.innerText = `${pokemon.name} (height: `;
    button.appendChild(span);
    let textEnding = document.createTextNode(")");
    if (pokemon.height > 0.4) {
      textEnding.nodeValue += ' - Wow, that\'s big!';
    }
    button.appendChild(textEnding);

    // Stick everything together
    list.appendChild(listItem);
    listItem.appendChild(button);

    // Add Event Handler
    handleEvents(button, pokemon);
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      console.log(pokemon);
      let pokemonButton = document.querySelector(`#${pokemon.name}`);
      let span = pokemonButton.querySelector('span');
      span.innerText = pokemon.height / 10;
    });
  }

  function handleEvents(element, pokemon) {
    element.addEventListener('click', function () {
      showDetails(pokemon);
    })
  }

  function loadList() {
    return fetch(apiURL).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    });
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      // Now we add the details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
    }).catch(function (e) {
      console.error(e);
    });
  }

  return {
    getAll: getAll,
    add: add,
    findPokemonByName: findPokemonByName,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails
  }
})();

// Load data and display it in list
pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
