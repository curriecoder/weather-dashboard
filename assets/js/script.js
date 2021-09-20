var APIKey = "66547e9042ab360b2c2f1ef36d0552f5";
var searchButton = $("#searchBtn");
var uvIndex = $("#uvIndex");

// returns city name from input field and makes request for weather.
function getApi() {
  // fetch request gets a list of all the repos for the node.js organization
  var city = $("input").val();
  var requestUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    APIKey;
  var cityName = $("#cityNameDate");
  var today = moment().format("M/D/YYYY");

  cityName.text(city + " " + "(" + today + ")");
  console.log(city);
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      var temp = $("#temp");
      var wind = $("#wind");
      var humidity = $("#humidity");
      var lat = data.coord.lat;
      var lon = data.coord.lon;

      temp.text("Temp: " + data.main.temp + "°F");
      wind.text("Wind: " + data.wind.speed + "mph");
      humidity.text("Humidity: " + data.main.humidity + "%");

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
          uvIndex.text("UV Index: " + data.current.uvi);

          var uviColor = data.current.uvi;
          if (uviColor < 2) {
            uvIndex.attr("class", "bg-success text-white");
          } else if (3 < uviColor < 5) {
            uvIndex.attr("class", "bg-warning text-white");
          } else if (6 < uviColor < 7) {
            uvIndex.attr("class", "bg-orange text-white");
          } else if (8 < uviColor < 10) {
            uvIndex.attr("class", "bg-danger text-white");
          } else if (uviColor > 10) {
            uvIndex.attr("class", "bg-violet text-white");
          }
        });

      var requestUrl5Day =
        "http://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&cnt=5&units=imperial&appid=" +
        APIKey;

      fetch(requestUrl5Day)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          var wf = ""; // start here for refactoring
          wf += data.city.name; // City (displays once)
          $.each(data.list, function (index, val) {
            wf += "<p>"; // Opening paragraph tag
            wf += "<b>Day " + index + "</b>: "; // Day
            wf += val.main.temp + "&degF"; // Temperature
            wf += "<span> | " + val.weather[0].description + "</span>"; // Description
            wf +=
            '<img src= "https://openweathermap.org/img/wn/' + //good link format
            val.weather[0].icon +
            '@2x.png">'; // Icon
            wf += "</p>"; // Closing paragraph tag
          });
          $('#forecast').html(wf);
        });
    });
}

searchButton.on("click", getApi);
