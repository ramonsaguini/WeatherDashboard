$(document).ready(function () {
  // OpenWeatherMap API key
  const apiKey = "711139112329c196220863ed084a16cc";

  // Event listener for the form submission
  $("#search-form").submit(function (event) {
    event.preventDefault();
    // Get the trimmed value from the search input
    const cityName = $("#search-input").val().trim();
    // Check if the input is not empty
    if (cityName !== "") {
      // Call the function to get weather data for the city
      getWeatherData(cityName, apiKey);
      // Clear the search input field after the search
      $("#search-input").val("");
    }
  });

  // Event listener for the search history clicks
  $("#history").on("click", ".list-group-item", function () {
    // Get the city name from the clicked history item
    const cityName = $(this).text();
    // Call the function to get weather data for the selected city
    getWeatherData(cityName, apiKey);
    // Clear the search input field when clicking on history
    $("#search-input").val("");
  });

  // Function to get weather data for a specific city
  function getWeatherData(cityName, apiKey) {
    // Construct the OpenWeatherMap API URL for current weather
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    // Make an API call using jQuery's $.get method
    $.get(queryURL, function (response) {
      // Update the UI with the current weather data
      updateCurrentWeather(response);
      // Get forecast data for the city
      getForecastData(response.coord.lat, response.coord.lon, apiKey);

      // Add the city to the search history
      addToHistory(cityName);
    });
  }

  // Function to update the UI with current weather data
  function updateCurrentWeather(weatherData) {
    // Extract weather icon code and construct icon URL
    const weatherIconCode = weatherData.weather[0].icon;
    const weatherIconURL = `http://openweathermap.org/img/w/${weatherIconCode}.png`;

    // Update the HTML content of the 'today' element
    $("#today").html(`
    <h2>${weatherData.name} - ${dayjs().format("MMM D, YYYY")}</h2>
    <img src="${weatherIconURL}" alt="Weather Icon">
    <p>Temperature: ${Math.round(weatherData.main.temp)} °C</p>
    <p>Humidity: ${weatherData.main.humidity}%</p>
    <p>Wind Speed: ${weatherData.wind.speed} m/s</p>
  `);
  }

  // Function to get forecast data for a specific city
  function getForecastData(lat, lon, apiKey) {
    // Construct the OpenWeatherMap API URL for forecast data
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    // Make an API call to get forecast data
    $.get(forecastURL, function (response) {
      // Update the UI with forecast data
      updateForecast(response.list);

      // Update the forecast data in local storage for the city
      const cityName = response.city.name;
      const storedData = JSON.parse(localStorage.getItem(cityName));
      if (storedData) {
        storedData.forecastData = response;
        addToLocalStorage(cityName, storedData);
      }
    });
  }

  // Function to update the UI with forecast data
  function updateForecast(forecastData) {
    // Clear the existing forecast content
    $("#forecast").empty();
    // Iterate over forecast data and display information for each day
    for (let i = 0; i < forecastData.length; i += 8) {
      const day = forecastData[i];
      const date = dayjs(day.dt_txt).format("MMM D, YYYY");
      const weatherIconCode = day.weather[0].icon;
      const weatherIconURL = `http://openweathermap.org/img/w/${weatherIconCode}.png`;

      // Append forecast information to the 'forecast' element
      $("#forecast").append(`
      <div class="col-3 border m-3 border-primary-subtle border-3 nextDays">
      <h3>${date}</h3>
      <p>Temperature: ${Math.round(day.main.temp)} °C</p>
      ${day.weather[0].main}<img src="${weatherIconURL}" alt="Weather Icon">
      <p>Humidity: ${day.main.humidity}%</p>
    </div>
      `);
    }
  }

  // Function to add a city to the search history
  function addToHistory(cityName) {
    // Check if the city is not already in the history
    if ($("#history").children().filter(`:contains("${cityName}")`).length === 0) {
      // Prepend a new history item with the city name
      $("#history").prepend(`
        <a href="#" class="list-group-item">${cityName}</a>
      `);

      // Append a button to the 'latestList' element for recent searches
      $("#latestList").append(`
        <button class="btn btn-secondary btn-sm mb-1" onclick="getWeatherData('${cityName}', '${apiKey}')">${cityName}</button>
      `);
    }
  }
});
