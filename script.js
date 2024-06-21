$(document).ready(function () {
  var apiKey = "445f52d682f901b9dd7c94b50f32a3a0"; // Replace with your actual API key

  // Initialize Leaflet map but don't display it yet
  var map = L.map("map", {
    center: [51.505, -0.09],
    zoom: 13,
    zoomControl: false,
  }); // Default center and zoom

  // Add OpenStreetMap tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Marker for the map
  var marker = L.marker([51.5, -0.09]).addTo(map);

  // Function to fetch weather data
  function fetchWeather(city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;
    console.log("Fetching weather for: " + city); // Debugging line
    console.log("API URL: " + apiUrl); // Debugging line

    $.getJSON(apiUrl, function (data) {
      displayWeather(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error("Error details:", jqXHR, textStatus, errorThrown); // Debugging line
      alert("City not found. Please try again.");
    });
  }

  // Function to fetch weather data by coordinates
  function fetchWeatherByCoordinates(lat, lng) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
    console.log("Fetching weather for coordinates: " + lat + ", " + lng); // Debugging line
    console.log("API URL: " + apiUrl); // Debugging line

    $.getJSON(apiUrl, function (data) {
      displayWeather(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error("Error details:", jqXHR, textStatus, errorThrown); // Debugging line
      alert("Location not found. Please try again.");
    });
  }

  // Function to display weather data
  function displayWeather(data) {
    var weatherHtml = `
          <h2>${data.name}, ${data.sys.country}</h2>
          <div class="weather-info">Temperature: ${data.main.temp} °C</div>
          <div class="weather-info">Weather: ${data.weather[0].description}</div>
          <div class="weather-info">Humidity: ${data.main.humidity} %</div>
          <div class="weather-info">Wind Speed: ${data.wind.speed} m/s</div>
      `;
    $("#weatherResult").html(weatherHtml);
  }

  // Search button click handler
  $("#searchButton").click(function () {
    var city = $("#cityInput").val().trim();
    if (city) {
      fetchWeather(city);
      $.getJSON(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          city
        )}`,
        function (data) {
          if (data.length > 0) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            map.setView([lat, lon], 13);
            marker.setLatLng([lat, lon]);
            $("#map").show(); // Show the map when a city is found
            $("#mapTitle").show(); // Show the map title
            setTimeout(function () {
              map.invalidateSize(); // Resize the map
            }, 100);
          }
        }
      ).fail(function () {
        alert("City not found on the map. Please try again.");
      });
    } else {
      alert("Please enter a city name.");
    }
  });

  // Theme toggle button
  const themeToggleBtn = document.querySelector(".theme-toggle");
  const theme = localStorage.getItem("theme");
  theme && document.body.classList.add(theme);

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark-mode");
    } else {
      localStorage.removeItem("theme");
    }
  });
});
