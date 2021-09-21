var APIKey = "66547e9042ab360b2c2f1ef36d0552f5";
var searchButton = $("#searchBtn");
var uvIndex = $("#uvIndex");

function renderHistory() {
  var storedArr = JSON.parse(localStorage.getItem("historyArr"));
  if (storedArr !== null) {
    historyArr = storedArr;
    $("#history").html(historyArr);
  }
}

renderHistory();

function clearText() {
  $("input").val("");
}

// returns city name from input field and makes request for weather.
function getApi(cityPast) {
  // fetch request gets a list of all the repos for the node.js organization
  var city = $("input").val();
  if (city.length === 0) {
    city = cityPast;
  }
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
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
      var temp = $("#temp");
      var wind = $("#wind");
      var humidity = $("#humidity");
      var lat = data.coord.lat;
      var lon = data.coord.lon;

      temp.text("Temp: " + data.main.temp + "°F");
      wind.text("Wind: " + data.wind.speed + "mph");
      humidity.text("Humidity: " + data.main.humidity + "%");

      var requestUrlUV =
        "https://api.openweathermap.org/data/2.5/onecall?&units=imperial&lat=" +
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
          var uviColor = data.current.uvi;
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
          $.each(data.daily, function (index, val) {
            if (index < 5) {
              wf +=
                "<p class='d-inline-block p-4 bg-dark text-white border border-secondary'>"; // Opening paragraph tag
              wf += "<b>Day " + (index + 1) + "</b><br> "; // Day
              wf +=
                '<img src= "https://openweathermap.org/img/wn/' + //good link format
                val.weather[0].icon +
                '@2x.png"><br>'; // Icon
              wf +=
                "<span>" +
                '"' +
                val.weather[0].description +
                '"' +
                "</span><br>"; // Description
              wf += "<b>Temp: " + val.temp.day + "&degF</b><br> ";
              wf += "<b>Wind: " + val.wind_speed + " mph</b><br>";
              wf += "<b>Humidity: " + val.humidity + "%</b>";
              wf += "</p>"; // Closing paragraph tag
            }
          });
          $("#forecast").html(wf);
          history();
          clearText();
        });
    });
}

//after a search is made I want to create a button and add it to the history list.
var historyArr = [];

// Only if input comes from input feild then create a button.
function history() {
  var historyCity = $("input").val();
  if (historyCity.length === 0) {
    return;
  }
  historyArr.push(
    "<div><button class='btn btn-outline-light w-100'>" +
      historyCity +
      "</div></button>"
  );
  localStorage.setItem("historyArr", JSON.stringify(historyArr));
  $("#history").html(historyArr);
}

searchButton.on("click", getApi);

$("#history").on("click", histortySearch);

function histortySearch(event) {
  event.preventDefault();
  var historyButton = $(event.target);
  getApi(historyButton.text());
}
