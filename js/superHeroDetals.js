const SuperHero = (function () {
  const superHeroDetailContainer = document.querySelector('.super-hero-detail');

  /* Get query parameters from the URL */
  function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  function renderSuperHeroDetails(data) {
    // If there is no superhero available
    if (!data) 
    {
      superHeroDetailContainer.innerHTML ='Cannot laod the superhero, please try again!';
      return;
    }
    /*If superhero exists display their details*/
    superHeroDetailContainer.innerHTML = 
    `
      <img src=${data.image.url} alt="" />
      <h1>${data.name}</h1>
      <h3>${data.biography['full-name']}</h3>
      <div class="power-stats">
        <div><span> Intelligence </span> <span> ${data.powerstats.intelligence}</span></div>
        <div><span> Strength </span> <span> ${data.powerstats.strength}</span></div>
        <div><span> Speed </span> <span> ${data.powerstats.speed}</span></div>
        <div><span> Durability </span> <span> ${data.powerstats.durability}</span></div>
        <div><span> Power </span> <span>${data.powerstats.power}</span></div>
        <div><span> Combat </span> <span>${data.powerstats.combat}</span></div>
      </div>
    `;
  }

  /* Fetching the data of superhero with character id */
  async function fetchSuperHeroData(id) {
    const url = Common.apiUrl;
    try 
    {
      const data = await Common.apiRequest(`${url}/${id}`);       //Making the request from api
      if (data.success) 
        renderSuperHeroDetails(data.data);
      else 
        renderSuperHeroDetails(null);
    } 
    catch (error) 
    {
      console.log('error', error);
      renderSuperHeroDetails(null);
    }
  }

  /* Initialize the module */
  function init() {
    const heroId = getQueryParameter('id');
    fetchSuperHeroData(heroId);
  }

  return {
    init,
  };
})();