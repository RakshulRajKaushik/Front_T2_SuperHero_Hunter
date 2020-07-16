const Favourites = (function () {
  const searchList = document.getElementById('search-results-list');

  function renderFavourites() {
    const favouritesData = Common.getFavouriteSuperheroes();

    // First empty the list
    searchList.innerHTML = '';

    //If there is no favourites added
    if (!favouritesData || favouritesData.length === 0)
    {
      searchList.innerHTML = '<li style:>No results found!</li>';
    } 
    // else append in the list
    else 
    {
      favouritesData.forEach((element) => 
      {
        const li = document.createElement('li');
        li.classList.add('search-result');
        li.innerHTML = `

          <div class="search-left">
            <img src=${element.image.url} />
          </div>
          
          <div class="search-right">

            <a href="superhero.html?id=${element.id}">
              <div class="name">${element.name}</div>
            </a>
            <div class="full-name">${element.biography['full-name']}</div>
            <div class="address">${element.biography['place-of-birth']}</div>
            <button class="btn remove-from-fav" data-id=${element.id}>Remove from favourites</button>
          
          </div>
                  `;
        searchList.appendChild(li);
      });
    }

    return;
  }

  /* Handle search key down event and make an API call */
  function handleDocumentClick(e) {
    const target = e.target;

    if (target.classList.contains('remove-from-fav')) {
      // Find the hero data and store it in favourites and localstorage
      const searchResultClickedId = target.dataset.id;
      Common.removeHeroFromFavourites(searchResultClickedId);
      renderFavourites();
    }
  }

  function init() {
    renderFavourites();
    document.addEventListener('click', handleDocumentClick);
  }

  return {
    init,
  };
})();