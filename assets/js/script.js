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
  icon: '',
}

let forecast = [
  {
    day: 1,
    date: '2022-09-13',
    temp: 0,
    feelsLike: 0,
    wind: 0,
    humidity: 0,
    icon: '',
  },

  {
    day: 2,
    date: '2022-09-13',
    temp: 0,
    feelsLike: 0,
    wind: 0,
    humidity: 0,
    icon: '',
  },
  
  {
    day: 3,
    date: '2022-09-13',
    temp: 0,
    feelsLike: 0,
    wind: 0,
    humidity: 0,
    icon: '',
  },
  
  {
    day: 4,
    date: '2022-09-13',
    temp: 0,
    feelsLike: 0,
    wind: 0,
    humidity: 0,
    icon: '',
  },
  
  {
    day: 5,
    date: '2022-09-13',
    temp: 0,
    feelsLike: 0,
    wind: 0,
    humidity: 0,
    icon: '',
  },
]

let apiKey = config.API_KEY

function getData(){
  currentFetch = `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&units=metric`
  fetch(currentFetch, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(weather => {
    // console.log(weather)
    data.icon = weather.weather[0].icon
    data.temp = Math.floor(weather.main.temp);
    data.feelsLike = Math.floor(weather.main.feels_like);
    // convert wind speed from m/s to km/h
    data.wind = Math.floor((weather.wind.speed) * 3.6);
    data.humidity = weather.main.humidity;
    data.date = new Date(weather.dt * 1000).toLocaleString()
    // console.log(new Date(weather.dt * 1000).toLocaleString())
    data.city = weather.name;
    storeCityHistory();
    showCurrentWeather(data);
  });
}

function showCurrentWeather(data){
  let iconLink = `http://openweathermap.org/img/wn/${data.icon}@2x.png`
  // template literal
  let weatherHTML = `
  <div class="card">
    <div class="card-body">
      <h2 id="cityDate"> ${data.city} (${data.date}) <img src=${iconLink}></img></h2>
      <p>Temp: ${data.temp} °C</p>
      <p>Feels like: ${data.feelsLike} °C</p>
      <p>Wind: ${data.wind} KM/H</p>
      <p>Humidity: ${data.humidity} %</p>
    </div>
  </div>`
  $('#currentWeather').html(weatherHTML);
  dataForecast(forecast);
}



function dataForecast(forecast){
  forecastFetch = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&units=metric`
  fetch(forecastFetch, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(weatherForecast => {
    console.log(weatherForecast)
    let dayH = 5
    for(let i=0; i<5; i++){
      // console.log(dayH)
      forecast[i].date = new Date(weatherForecast.list[dayH].dt * 1000).toLocaleDateString();
      forecast[i].temp = Math.floor(weatherForecast.list[dayH].main.temp);
      forecast[i].feelsLike = Math.floor(weatherForecast.list[dayH].main.feels_like);
      // convert wind speed from m/s to km/h
      forecast[i].wind = Math.floor((weatherForecast.list[dayH].wind.speed) * 3.6);
      forecast[i].humidity = weatherForecast.list[dayH].main.humidity;
      forecast[i].icon = weatherForecast.list[dayH].weather[0].icon;
      dayH = dayH + 8;
    }
    
    
    // console.log(forecast)
    showForecast(forecast)
  });
}

function showForecast(){
  $('#currentForecast').empty();
  for(let i = 0; i < 5; i ++){
    let iconLink = `http://openweathermap.org/img/wn/${forecast[i].icon}@2x.png`
    // another template literal
    let forecastHTML = `
    <div id='day-${forecast[i].day}' class="card" style="width: 20%;">
      <div class="card-header">${forecast[i].date} <img src='${iconLink}'></img></div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Temp: ${forecast[i].temp} °C</li>
        <li class="list-group-item">Feels like: ${forecast[i].feelsLike} °C</li>
        <li class="list-group-item">Wind: ${forecast[i].wind} KM/H</li>
        <li class="list-group-item">Humidity: ${forecast[i].humidity} %</li>
      </ul>
    </div>`
    let header = document.querySelector('#forecastHeader').textContent = '5-Day Forecast:'
    $('#currentForecast').append(forecastHTML);
    
  }
}

function storeCityHistory(){
  let cityText = data.city
  
  let cityArr = JSON.parse(localStorage.getItem('cityData')) || [];
  cityArr.unshift(cityText) 
  localStorage.setItem('cityData', JSON.stringify(cityArr))
  displayCityHistory()
}

function displayCityHistory(){
  $('#cityList').empty();
  let cityArr = JSON.parse(localStorage.getItem('cityData')) || [];
  for(let i=0; i<cityArr.length; i++){
    let listHTML = `
    <li>${cityArr[i]}</li>`
  $('#cityList').append(listHTML)
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
    if(data.list[0] !== undefined){
      let coordinates = data.list[0].coord;
      // console.log(coordinates.lon);
      cityLat = coordinates.lat;
      cityLon = coordinates.lon;
      getData();
    }else{
      alert('Error no city found, please try again.')
    }
    
  });
} 

$('#searchBtn').click(function() {
  cityName = $('#cityName').val();
  citySearch = `https://api.openweathermap.org/data/2.5/find?q=${cityName}&appid=${apiKey}&units=metric`;
  getCityData(citySearch);
});

// weather api fetch
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}