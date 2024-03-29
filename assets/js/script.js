// Variables
let cityName,
citySearch,
currentFetch,
forecastFetch,
cityLat,
cityLon,
listElm,
cityArr;

// Current data obj
let data = {
  city: 'A city',
  date: '2022-09-13',
  temp: 0,
  feelsLike: 0,
  wind: 0,
  humidity: 0,
  icon: '',
}

// Forecast array of objs
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

// I know we are supposed to hide this, plz don't steal
let apiKey = "a27072c44a7ebeacb5fd74e2baf25714"

// getCityData function gets the lon and lat from the weatherApi
function getCityData() {
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

// getData function gets the weather data about the current weather at the location provided
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
    // console.log(data.city)
    storeCityHistory(data.city);
    showCurrentWeather(data);
  });
}

// storeCityHistory function stores the city of the data that was collected
function storeCityHistory(dataCity){
  let cityText = dataCity
  
  cityArr = JSON.parse(localStorage.getItem('cityData')) || [];
  // console.log(cityText)
  for(let i=0; i<cityArr.length; i++){
    if(cityArr[i] == cityText){
      // console.log(cityArr[i])
      cityArr.splice(i,1)
      //console.log('err, i=i')
    }
  }
  cityArr.unshift(cityText) 
  localStorage.setItem('cityData', JSON.stringify(cityArr))
  displayCityHistory()
}

// displayCityHistory displays the cityData arr in a list under the search
function displayCityHistory(){
  $('#cityList').empty();
  cityArr = JSON.parse(localStorage.getItem('cityData')) || [];
  for(let i=0; i<cityArr.length; i++){
    let listHTML = `
    <li type="button" class='list-group-item list-group-item-action active text-bg-dark p-3 border border-light-subtle listEl'>${cityArr[i]}</li>`
  $('#cityList').append(listHTML)
  }
  listElm = $('.listEl')
  $(listElm).click(function() {
    cityName = $(this).text();
    // console.log($(this).text())
    citySearch = `https://api.openweathermap.org/data/2.5/find?q=${cityName}&appid=${apiKey}&units=metric`;
    getCityData();
  });
}

// showCurrentWeather displays the current weather data in the box above the forecast
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

// dataForecast gets the data from the weatherApi about the upcoming forecast, it returns the obj in increments of 3hours
function dataForecast(forecast){
  forecastFetch = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&units=metric`
  fetch(forecastFetch, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(weatherForecast => {
    // console.log(weatherForecast)
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

// showForecast displays the forecast using a template literal and appending the html in a loop
function showForecast(){
  $('#currentForecast').empty();
  for(let i = 0; i < 5; i ++){
    let iconLink = `http://openweathermap.org/img/wn/${forecast[i].icon}@2x.png`
    // another template literal
    let forecastHTML = `
    <div id='day-${forecast[i].day}' class="card forecast" style="width: 20%;">
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

// jquery event listener
$('#searchBtn').click(function() {
  cityName = $('#cityName').val();
  citySearch = `https://api.openweathermap.org/data/2.5/find?q=${cityName}&appid=${apiKey}&units=metric`;
  getCityData();
});

// always displays cityHistory
displayCityHistory()