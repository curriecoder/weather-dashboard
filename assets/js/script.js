var APIKey = "66547e9042ab360b2c2f1ef36d0552f5";
var city;
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;


// returns city name from input field and stores it as city.
$("#searchBtn").on("click", function(){
  city = $("input").val()
  console.log(city);
});



