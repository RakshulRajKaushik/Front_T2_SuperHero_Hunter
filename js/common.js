const Common = (function () {
  const apiToken = '10219177700206566';
  const apiUrl = `https://www.superheroapi.com/api.php/${apiToken}/`;
  const toastContainer = document.getElementById('toast');
  const FAVOURITES = 'favourites';

  /* Notification handler */
  function showNotification(type, message) {
    
    /*If there is error, add class toast-error*/
    if (type === 'error') {
      toastContainer.classList.remove('toast-success');
      toastContainer.classList.add('toast-error');
    }
    /*if success add class toast-success*/ 
    else if (type === 'success') {
      toastContainer.classList.remove('toast-error');
      toastContainer.classList.add('toast-success');
    }
    toastContainer.style.display = 'block';
    toastContainer.innerText = message;

    setTimeout(() => {                          /*After some time remove the message by display=none*/
      toastContainer.style.display = 'none';
    }, 3000);
  }

  /* Send api requests */
  async function apiRequest(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      return {
        data,
        success: true,
      };
    } catch (error) {
      console.log('error', error);
      return {
        error: error.message,
        success: false,
      };
    }
  }

  /* Add hero to localstorage */
  function addHeroToFavourites(hero) {
    if (!hero) return;

    const favouritesFromLocalStorage = getFavouriteSuperheroes();
    favouritesFromLocalStorage.push(hero);

    // Save in localstorage
    localStorage.setItem(
      FAVOURITES,
      JSON.stringify(favouritesFromLocalStorage)
    );

    showNotification('success', 'Added to favourites');
  }

  /* Remove hero from localstorage */
  function removeHeroFromFavourites(heroId) {
    if (!heroId) return;

    let favouritesFromLocalStorage = getFavouriteSuperheroes();

    // Remove hero from localstorage
    favouritesFromLocalStorage = favouritesFromLocalStorage.filter(
      (item) => item.id !== heroId
    );

    // Save in localstorage
    localStorage.setItem(
      FAVOURITES,
      JSON.stringify(favouritesFromLocalStorage)
    );

    showNotification('Removed', 'Removed from favourites');
  }

  /* Get fav superheroes from the local storage */
  function getFavouriteSuperheroes() {
    return localStorage.getItem(FAVOURITES)
      ? JSON.parse(localStorage.getItem(FAVOURITES))
      : [];
  }

  /*Debounce function for delaying the api call */
  function debounce(func, delay) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;

      clearTimeout(timeout);

      timeout = setTimeout(function () {
        timeout = null;
        func.apply(context, args);
      }, delay);
    };
  }

  return {
    apiRequest,apiUrl,showNotification,addHeroToFavourites,removeHeroFromFavourites,getFavouriteSuperheroes,debounce,
  };
})();