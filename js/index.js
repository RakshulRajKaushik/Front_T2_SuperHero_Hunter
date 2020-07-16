const Main = (function () {
  const searchBox = document.getElementById('search');
  const searchList = document.getElementById('search-results-list');
  let searchResults = [];
  const SEARCH_TEXT_LIMIT = 2;                                                /*More than 2 characters required at least*/

  function renderSearchResults() {
    // If data is empty warn the user
    if (!searchResults || searchResults.length === 0) {                       /*If there is nothing written in search box or no superhero found*/
      searchList.innerHTML = '<li class="no-results">No results found!</li>';
      return;
    }

    const favSuperHeroes = Common.getFavouriteSuperheroes();
    searchList.innerHTML = '';

    searchResults.forEach((element) => {                                      /*Append each search result to the list*/
      const li = document.createElement('li');

      const indexOfSuperHeroInFavourites = favSuperHeroes.findIndex(          /*Find if superhero exists in favourites*/
        (hero) => hero.id === element.id
      );
      li.classList.add('search-result');
      li.innerHTML = 
      `
        <div class="search-left">
          <img src=${element.image.url} alt="" />
        </div>

        <div class="search-right">
          <a href="superhero.html?id=${element.id}">
            <div class="name">${element.name}</div>
          </a>

          <div class="full-name">
            ${element.biography['full-name']}
          </div>

          <div class="address">
            ${element.biography['place-of-birth']}
          </div>

          <button class="btn add-to-fav" data-id=${element.id} style="display: 
              ${indexOfSuperHeroInFavourites === -1 ? 'block' : 'none'}">Add to favourites
          </button>
          <button class="btn remove-from-fav" data-id=${element.id} style="display: 
              ${indexOfSuperHeroInFavourites === -1 ? 'none' : 'block'}">Remove from favourites
          </button>

        </div>
      `;
      searchList.appendChild(li);
    });
  }

  /* Remove all search results from the UI */
  function emptySearchResults() {
    searchList.innerHTML = '';
    searchResults = [];
  }

  /* Handle search key down event and make an API all */
  async function handleSearch(e) {
    const searhTerm = e.target.value;
    const url = Common.apiUrl;

    if (searhTerm.length <= SEARCH_TEXT_LIMIT) {                        /*Api call will not be made if only 2 or less charcters are entered*/
      emptySearchResults();
      return;
    }

    //remove existing search results
    emptySearchResults();

    try {
      const data = await Common.apiRequest(`${url}/search/${searhTerm}`);   /*making api request to render results*/

      if (data.success) {
        searchResults = data.data.results;
        renderSearchResults();
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  /* Handle user clicks (anywhere in the document) */
  function handleDocumentClick(e) {
    const target = e.target;

    if (target.classList.contains('add-to-fav')) {
      const searchResultClickedId = target.dataset.id;                /*Find the hero data and store it in favourites and localstorage*/
      const hero = searchResults.filter(
        (hero) => hero.id === searchResultClickedId
      );
      Common.addHeroToFavourites(hero[0]);
      renderSearchResults();
    } else if (target.classList.contains('remove-from-fav')) {
      // Find the hero data and remove from local storage
      const searchResultClickedId = target.dataset.id;

      // Show add to fav button and hide the remove from fav button
      const addToFavBtn = document.querySelector(
        `button[data-id="${searchResultClickedId}"].add-to-fav`
      );
      if (addToFavBtn) addToFavBtn.style.display = 'block';

      const removeFromFavBtn = document.querySelector(
        `button[data-id="${searchResultClickedId}"].remove-from-fav`
      );
      if (removeFromFavBtn) removeFromFavBtn.style.display = 'none';

      Common.removeHeroFromFavourites(searchResultClickedId);
    }
  }

  function init() {
    searchBox.addEventListener('keyup', Common.debounce(handleSearch, 500));      /*Calling the debounce function on handleSearch*/
    document.addEventListener('click', handleDocumentClick);
  }

  return {
    init,
  };
})();