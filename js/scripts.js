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

    // Setting the content of the button
    button.innerText = `${pokemon.name}`;

    // Stick everything together
    list.appendChild(listItem);
    listItem.appendChild(button);

    // Add Event Handler
    handleEvents(button, pokemon);
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      modal.showModal(pokemon);
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
      // Types are stored as object, convert to array with type names
      item.types = details.types.map(function (value) {
        return value["type"]["name"];
      });
    }).catch(function (e) {
      console.error(e);
    });
  }

  function getIndex(pokemon) {
    return pokemonList.indexOf(pokemon);
  }

  return {
    getAll: getAll,
    add: add,
    findPokemonByName: findPokemonByName,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    getIndex: getIndex
  };
})();

let modal = (function () {
  // Elements that are not specific to a pokemon
  let modalContainer = document.querySelector('.modal-container');
  let modalWindow = document.querySelector('.modal');
  let modalCloseButton = document.querySelector('.modal__button.close-button');
  let modalContentWrapper = document.querySelector('.modal__content');
  let modalPreviousButton = document.querySelector('.modal__button.previous-button');
  let modalNextButton = document.querySelector('.modal__button.next-button');

  let currentPokemon;

  // Makes modal visible and adds all pokemon-specific elements
  function showModal (pokemon) {
    currentPokemon = pokemon;
    improveNavigation(pokemon);

    let modalTitle = document.createElement('h1');
    modalTitle.classList.add('modal__title');
    modalTitle.innerText = pokemon.name;

    let modalProperties = document.createElement('div');
    modalProperties.classList.add('modal__properties');
    addModalProperties(modalProperties, pokemon).forEach(function (property) {
      modalProperties.appendChild(property);
    });

    let modalPicture = document.createElement('img');
    modalPicture.classList.add('modal__image');
    modalPicture.setAttribute('src', pokemon.imageUrl);

    modalContentWrapper.appendChild(modalTitle);
    modalContentWrapper.appendChild(modalProperties);
    modalContentWrapper.appendChild(modalPicture);

    modalContainer.classList.add('is-visible');
  }

  // Removes non-functioning navigation on first and last pokemon
  function improveNavigation(pokemon) {
    let indexOfCurrentPokemon = pokemonRepository.getIndex(pokemon);
    if (indexOfCurrentPokemon === 0) {
      modalPreviousButton.style.visibility = 'hidden';
    } else if (indexOfCurrentPokemon === (pokemonRepository.getAll().length - 1)) {
      modalNextButton.style.visibility = 'hidden';
    } else {
      [modalPreviousButton, modalNextButton].forEach(function (button) {
        if (button.hasAttribute('style')) {
          button.removeAttribute('style');
        }
      });
    }
  }

  // Adds all pokemon text properties, own function for greater flexibility
  function addModalProperties(modalProperties, pokemon) {
    let height = document.createElement('p');
    height.classList.add('modal-property');
    height.innerText = `Height: ${pokemon.height}`;

    let types = document.createElement('ul');
    types.classList.add('modal-property');
    pokemon.types.forEach(function (value) {
      let type = document.createElement('li');
      type.classList.add('modal-property__type');
      type.innerText = value;
      types.appendChild(type);
    })

    return [height, types];
  }

  // Closes modal and removes all parts that are pokemon-specific
  function closeModal() {
    removeModalContent();
    currentPokemon = null;
    modalContainer.classList.remove('is-visible');
  }

  function removeModalContent() {
    // Remove children dynamically in order to avoid double code
    let modalChildren = modalContentWrapper.querySelectorAll('.modal__content > *');
    modalChildren.forEach(function (child) {
      modalContentWrapper.removeChild(child);
    });
  }

  // Enables navigation between pokemon
  function navigateModal(e) {
    let currentPosition = pokemonRepository.getIndex(currentPokemon);
    let newPokemon;
    if (e.target === modalPreviousButton) {
      newPokemon = pokemonRepository.getAll()[currentPosition - 1];
    } else if (e.target === modalNextButton) {
      newPokemon = pokemonRepository.getAll()[currentPosition + 1];
    }
    if (newPokemon) {
      removeModalContent();
      pokemonRepository.showDetails(newPokemon);
    }
  }

  // Closing modal via Close-button, Esc-key or by clicking outside of modal
  modalCloseButton.addEventListener('click', closeModal);
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
  modalContainer.addEventListener('click', function (e) {
    if (e.target === modalContainer) {
      closeModal();
    }
  });

  // Event listeners for navigation
  [modalPreviousButton, modalNextButton].forEach(function (button) {
    button.addEventListener('click', navigateModal);
  });

  return {
    showModal: showModal,
    closeModal: closeModal
  };
})();

// Load data and display it in list
pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
