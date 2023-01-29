let cityName,
citySearch,
currentFetch,
forecastFetch,
cityLat,
cityLon;

let data = {
  city: 'A city',
  date: '2022-09-13',
  temp: 0,
  feelsLike: 0,
  wind: 0,
  humidity: 0,
}

let forecast = [
  {
    day: 1,
    date: '2022-09-13',
    temp: 0,
    wind: 0,
    humidity: 0,
  },

  {
    day: 2,
    date: '2022-09-13',
    temp: 0,
    wind: 0,
    humidity: 0,
  },
  
  {
    day: 3,
    date: '2022-09-13',
    temp: 0,
    wind: 0,
    humidity: 0,
  },
  
  {
    day: 4,
    date: '2022-09-13',
    temp: 0,
    wind: 0,
    humidity: 0,
  },
  
  {
    day: 5,
    date: '2022-09-13',
    temp: 0,
    wind: 0,
    humidity: 0,
  },
]

let apiKey = "a27072c44a7ebeacb5fd74e2baf25714";

function getData(){
  currentFetch = `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&units=metric`
  fetch(currentFetch, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(weather => {
    console.log(weather)
    data.temp = Math.floor(weather.main.temp);
    data.feelsLike = Math.floor(weather.main.feels_like);
    // convert wind speed from m/s to km/h
    data.wind = Math.floor((weather.wind.speed) * 3.6);
    data.humidity = weather.main.humidity;
    data.date = new Date(weather.dt * 1000).toString()
    console.log(new Date(weather.dt * 1000))
    data.city = weather.name;
    showCurrentWeather(data);
    dataForecast(forecast)
  });
}

function showCurrentWeather(data){
  // template literal
  let weatherHTML = `
  <div class="card">
    <div class="card-body">
      <h2 id="cityDate"> ${data.city} (${data.date}) </h2>
      <p>Temp: ${data.temp} °C</p>
      <p>Feels like: ${data.feelsLike} °C</p>
      <p>Wind: ${data.wind} KM/H</p>
      <p>Humidity: ${data.humidity} %</p>
    </div>
  </div>`
  $('#currentWeather').html(weatherHTML)
}



function dataForecast(forecast){
  forecastFetch = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&units=metric`
  fetch(forecastFetch, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(weatherForecast => {
    // convert wind speed from m/s to km/h
    forecast[0].date = 
    console.log(weatherForecast.list[0])
  });
}

function showForecast(){


  for(let i = 0; i < 5; i ++){
  // another template literal
  let forecastHTML = `
  <div id='day-${forecast[i].day}' class="card" style="width: 20%;">
    <div class="card-header">${data.date}</div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">Temp: ${data.temp} °C</li>
      <li class="list-group-item">Wind: ${data.wind} KM/H</li>
      <li class="list-group-item">Humidity: ${data.humidity} %</li>
    </ul>
  </div>`
  $('#currentForecast').append(forecastHTML)
  }
}

// Create a function to retrieve weather data from API
function getCityData(citySearch) {
  // Create a new XMLHttpRequest object
  fetch(citySearch, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    let coordinates = data.list[0].coord;
    // console.log(coordinates.lon);
    cityLat = coordinates.lat;
    cityLon = coordinates.lon;
    getData();
  });
} 

$('#searchBtn').click(function() {
  cityName = $('#cityName').val();
  citySearch = `https://api.openweathermap.org/data/2.5/find?q=${cityName}&appid=${apiKey}&units=metric`;
  getCityData(citySearch);
});

// weather api fetch
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}