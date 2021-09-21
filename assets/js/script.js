var APIKey = "66547e9042ab360b2c2f1ef36d0552f5";
var searchButton = $("#searchBtn");
var uvIndex = $("#uvIndex");


renderHistory();

function renderHistory() {
  var storedArr = JSON.parse(localStorage.getItem('historyArr'));
  console.log(storedArr);
  if (storedArr !== null) {
    historyArr = storedArr;
    $('#history').html(historyArr);
  }
}

// returns city name from input field and makes request for weather.
function getApi() {
  // fetch request gets a list of all the repos for the node.js organization
  var city = $('input').val();
  var requestUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    APIKey;
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
      var lat = data.coord.lat;
      var lon = data.coord.lon;

      temp.text("Temp: " + data.main.temp + "°F");
      wind.text("Wind: " + data.wind.speed + "mph");
      humidity.text("Humidity: " + data.main.humidity + "%");

      var requestUrlUV =
        "http://api.openweathermap.org/data/2.5/onecall?&units=imperial&lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIKey;

      fetch(requestUrlUV)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          uvIndex.text("UV Index: " + data.current.uvi);
          console.log(data);
          // var uviColor = data.current.uvi;
          var uviColor = 6;
          if (uviColor <= 2) {
            uvIndex.attr("class", "bg-success text-white");
          } else if (uviColor <= 3 && uviColor <= 5) {
            uvIndex.attr("class", "bg-warning text-white");
          } else if (uviColor <= 6 && uviColor <= 7) {
            uvIndex.attr("class", "bg-orange text-white");
          } else if (uviColor <= 8 && uviColor <= 10) {
            uvIndex.attr("class", "bg-danger text-white");
          } else if (uviColor > 10) {
            uvIndex.attr("class", "bg-violet text-white");
          }

          var wf = ""; // start here for refactoring
          wf += "<b>" + city + "</b>"; // City (displays once)
          $.each(data.daily, function (index, val) {
            if (index < 5) {
              wf += "<p>"; // Opening paragraph tag
              wf += "<b>Day " + (index + 1) + "</b>: "; // Day
              wf += "Temp: " + val.temp.day + "&degF | ";
              wf += "Wind: " + val.wind_speed + " mph | ";
              wf += "Humidity: " + val.humidity + "%";
              wf +=
                '<img src= "https://openweathermap.org/img/wn/' + //good link format
                val.weather[0].icon +
                '@2x.png">'; // Icon
              wf += "<span>" + val.weather[0].description + "</span>"; // Description
              wf += "</p>"; // Closing paragraph tag
            }
          });
          $("#forecast").html(wf);
          history();
        });
    });
}

//after a search is made I want to create a button and add it to the history list.
var historyArr = [];

function history() {
  var historyCity = $('input').val();
  historyArr.push('<div><button>' + historyCity + '</div></button>');
  localStorage.setItem('historyArr', JSON.stringify(historyArr));
  console.log(historyArr);
  $('#history').html(historyArr);
}

searchButton.on("click", getApi);
