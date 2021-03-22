const modal = (function() {
  // Elements that are not specific to a pokemon
  const modalContainer = $('.modal');
  const modalContentWrapper = $('.modal-body');
  const modalPreviousButton = $('.modal__button.previous-button');
  const modalNextButton = $('.modal__button.next-button');

  let currentPokemon;

  // Makes modal visible and adds all pokemon-specific elements
  function showModal(pokemon) {
    currentPokemon = pokemon;
    improveNavigation(pokemon);

    const modalTitle = $('<h1></h1>');
    modalTitle.addClass('modal__title');
    modalTitle.text(pokemon.name);

    const modalProperties = $('<div></div>');
    modalProperties.addClass('modal__properties');
    addModalProperties(pokemon).forEach(function(property) {
      modalProperties.append(property);
    });

    const modalPicture = $('<img>');
    modalPicture.addClass('modal__image');
    modalPicture.attr('src', pokemon.imageUrl);

    $('.modal-header').append(modalTitle);
    modalContentWrapper.append(modalProperties);
    modalContentWrapper.append(modalPicture);
  }

  // Removes non-functioning navigation on first and last pokemon
  function improveNavigation(pokemon) {
    const indexOfCurrentPokemon = pokemonRepository.getIndex(pokemon);
    if (indexOfCurrentPokemon === 0) {
      modalPreviousButton.css('visibility', 'hidden');
    } else if (
      indexOfCurrentPokemon ===
      pokemonRepository.getAll().length - 1
    ) {
      modalNextButton.css('visibility', 'hidden');
    } else {
      [modalPreviousButton, modalNextButton].forEach(function(button) {
        if (button.attr('style')) {
          button.removeAttr('style');
        }
      });
    }
  }

  // Adds all pokemon text properties, own function for greater flexibility
  function addModalProperties(pokemon) {
    const height = $('<p></p>');
    height.addClass('modal-property');
    height.text('Height: '.concat(pokemon.height));

    const types = $('<ul></ul>');
    types.addClass('modal-property');
    pokemon.types.forEach(function(value) {
      const type = $('<li></li>');
      type.addClass('modal-property__type');
      type.text(value);
      types.append(type);
    });

    return [height, types];
  }

  // Removes pokemon-specific elements
  function removeModalContent() {
    modalContentWrapper.children().remove();
    $('.modal__title').remove();
    currentPokemon = null;
  }

  // Enables navigation between pokemon
  function navigateModal(e) {
    const currentPosition = pokemonRepository.getIndex(currentPokemon);
    let newPokemon;
    if (e.target === modalPreviousButton[0]) {
      newPokemon = pokemonRepository.getAll()[currentPosition - 1];
    } else if (e.target === modalNextButton[0]) {
      newPokemon = pokemonRepository.getAll()[currentPosition + 1];
    }
    if (newPokemon) {
      removeModalContent();
      pokemonRepository.showDetails(newPokemon);
    }
  }

  // Hook close Modal function to Bootstrap modal closing event
  modalContainer.on('hidden.bs.modal', removeModalContent);

  // Event listeners for navigation
  [modalPreviousButton, modalNextButton].forEach(function(button) {
    button.click(navigateModal);
  });

  return {
    showModal: showModal
  };
})();

// Setting up a dataset in an IIFE
const pokemonRepository = (function(modalElement) {
  let pokemonList = [];
  const apiURL = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function getAll() {
    return pokemonList;
  }

  function add(item) {
    // Check first if the item is an object
    if (typeof item === 'object') {
      // Further check if the number and types of object keys are right
      const rightKeys = ['name', 'height', 'types', 'detailsUrl'];
      const itemNumberOfKeys = Object.keys(item).length;
      const itemHasRightKeys = Object.keys(item).every(function(key) {
        return rightKeys.indexOf(key) + 1;
      });

      if (itemNumberOfKeys <= rightKeys.length && itemHasRightKeys) {
        pokemonList.push(item);
      } else {
        console.log(
          'The item you are trying to add has an invalid number and/or invalid types of keys.'
        );
      }
    } else {
      console.log(
        'The item you are trying to add is not of the required type (object).'
      );
    }
  }

  function addListItem(pokemon) {
    const list = $('.pokemon-list');

    // Creating main elements
    const listItem = $('<li></li>');
    listItem.addClass('group-list-item');
    listItem.attr('role', 'listitem');

    const button = $('<button></button>');
    button.addClass('btn pokemon-list__item');
    button.attr('id', pokemon.name);
    button.attr('data-toggle', 'modal');
    button.attr('data-target', '#pokemon-modal');

    // Setting the content of the button
    button.text(pokemon.name);

    // Stick everything together
    list.append(listItem);
    listItem.append(button);

    // Add Event Handler
    handleEvents(button, pokemon);
  }

  function showDetails(pokemon) {
    if (modalElement && modalElement.showModal) {
      loadDetails(pokemon).then(function() {
        modalElement.showModal(pokemon);
      });
    }
  }

  function handleEvents(element, pokemon) {
    element.on('click', function() {
      showDetails(pokemon);
    });
  }

  function loadList() {
    return fetch(apiURL)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        json.results.forEach(function(item) {
          const pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function loadDetails(item) {
    const url = item.detailsUrl;
    return fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(details) {
        // Now we add the details to the item
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        // Types are stored as object, convert to array with type names
        item.types = details.types.map(function(value) {
          return value['type']['name'];
        });
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function getIndex(pokemon) {
    return pokemonList.indexOf(pokemon);
  }

  return {
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    showDetails: showDetails,
    getIndex: getIndex
  };
})(modal);

// Load data and display it in list
pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

// Search functionality in navbar
$('#search-form').submit(function() {
  // Get the search term
  const searchTerm = $('#search-term').val();

  // Filter all pokemon that include search term
  const results = pokemonRepository.getAll().filter(function(pokemon) {
    return pokemon.name.includes(searchTerm);
  });

  // Clear list of pokemon
  $('.pokemon-list').empty();

  // Add all pokemon from results
  results.forEach(function(result) {
    pokemonRepository.addListItem(result);
  });

  // Mark search term in results
  $('.pokemon-list__item').each(function() {
    $(this).mark(searchTerm);
  });

  // Prevent default submit behavior
  return false;
});
