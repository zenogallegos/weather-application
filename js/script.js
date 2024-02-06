const dailyWeatherSection = $("#weather-daily");
const fiveDayWeatherSection = $("#weather-fiveday");
const searchBtn = $("button");

const apiUrl = "https://api.openweathermap.org/";
const apiKey = "812c298cb75ccb625e8f2897604e82bb";

function organizeSearchTerm() {
  let inputValue = $("input").val();

  console.log(inputValue);

  inputInfoArr = inputValue.split(", ");

  searchInfo = {
    city: inputInfoArr[0],
    state: inputInfoArr[1],
    country: inputInfoArr[2],
  };

  console.log(searchInfo);

  getCityCoords(searchInfo);
}

function getCityCoords(searchInfo) {
  console.log("getting city coordinates...");

  fetch(
    apiUrl +
      `geo/1.0/direct?q=` +
      searchInfo.city +
      `,` +
      searchInfo.state +
      `,` +
      searchInfo.country +
      `&appid=` +
      apiKey + `&units=imperial`
  )
    .then((res) => {
      console.log(res);
      
      if (!res.ok) {
        return null;
      }

      return res.json();
    })

    .then((data) => {
      console.log(data);
      console.log(typeof data)
      console.log("City coordinates for " + $("input").val() + ":");
      console.log(data[0].lat);
      console.log(data[0].lon);

      locationLat = data[0].lat;
      locationLon = data[0].lon;

      getDailyWeather(locationLat, locationLon);
      getFiveDayWeather(locationLat, locationLon);

      return data;
    })

    .catch((err) => console.error(err));
}

function getDailyWeather(lat, lon) {
  console.log("getting daily weather...");
  fetch(
    apiUrl + `data/2.5/weather?lat=` + lat + `&lon=` + lon + `&appid=` + apiKey + `&units=imperial`
  ).then((res) => {
    console.log(res);
    if (!res.ok) {
      return null;
    }

    return res.json();
  })

  .then((data) => {
    console.log(data)});
}

function getFiveDayWeather(lat, lon) {
  console.log("getting 5-Day Weather...");
  fetch(
    apiUrl + `data/2.5/forecast?lat=` + lat + `&lon=` + lon + `&appid=` + apiKey + `&units=imperial`
  ).then((res) => {
    console.log(res);
    if (!res.ok) {
      return null;
    }

    return res.json();
  })

  .then((data) => {
    console.log(data)});
}

searchBtn.on("click", organizeSearchTerm);
