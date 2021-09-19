var APIKey = "66547e9042ab360b2c2f1ef36d0552f5";
var searchButton = $("#searchBtn");

// returns city name from input field and makes request for weather.
function getApi() {
  // fetch request gets a list of all the repos for the node.js organization
  var city = $("input").val();
  var requestUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    APIKey;
  console.log(city);
  var cityName = $("#cityNameDate");
  var today = moment().format("M/D/YYYY");
  
  cityName.text(city + " " + "(" + today + ")");
  
  fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    
    var temp = $("#temp");
    var wind = $("#wind");
    var humidity = $("#humidity");
    var uvIndex = $("#uvIndex");
    var lat = data.coord.lat;
    var lon =data.coord.lon;
    
    temp.text("Temp: " + data.main.temp + "°F");
    wind.text("Wind: " + data.wind.speed + " mph");
    humidity.text("Humidity: " + data.main.humidity + " %");
    
    var requestUrlUV =
    "http://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=hourly,minutely,daily,alerts&appid=" +
    APIKey;
    
    fetch(requestUrlUV)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      uvIndex.text("UV Index: " + data.current.uvi);
        });
  });
  
}

searchButton.on("click", getApi);
