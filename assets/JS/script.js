$(document).ready(function () {
  const apiKey = "711139112329c196220863ed084a16cc";


  $("#search-form").submit(function (event) {
    event.preventDefault();
    const cityName = $("#search-input").val();
    if (cityName !== "") {
      getWeatherData(cityName, apiKey);
      $("#search-input").val("");
    }
  });

  function getWeatherData(cityName, apiKey) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    //! Fazer a chamada da API
    $.get(queryURL, function (response) {
      //! Atualizar a interface com os dados meteorológicos atuais e do forecast
      updateCurrentWeather(response);
      getForecastData(response.coord.lat, response.coord.lon, apiKey);

    });
  }

  //! atualizar a atual temperatura
  function updateCurrentWeather(weatherData) {
    const weatherIconCode = weatherData.weather[0].icon;
    const weatherIconURL = `http://openweathermap.org/img/w/${weatherIconCode}.png`;

    $("#today").html(`
      <h2>${weatherData.name} - ${dayjs().format("MMM D, YYYY")}</h2>
      <img src="${weatherIconURL}" alt="Weather Icon">
      <p>Temperature: ${weatherData.main.temp} °C</p>
      <p>Humidity: ${weatherData.main.humidity}%</p>
      <p>Wind Speed: ${weatherData.wind.speed} m/s</p>
    `);
  }

  //! pegar os dados do api 
  function getForecastData(lat, lon, apiKey) {
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    $.get(forecastURL, function (response) {
      updateForecast(response.list);
      const cityName = response.city.name;
      const storedData = JSON.parse(localStorage.getItem(cityName));
      if (storedData) {
        storedData.forecastData = response;
        addToLocalStorage(cityName, storedData);
      }
    });
  }
