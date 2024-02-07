const dailyWeatherSection = $("#weather-daily");
const fiveDayWeatherSection = $("#weather-fiveday");
const searchBtn = $("#search-btn");
const historyCont = $("#search-his");
const clearBtn = $("#clear-btn");

const apiUrl = "https://api.openweathermap.org/";
const apiKey = "812c298cb75ccb625e8f2897604e82bb";

retrieveSearchHistory()

function organizeSearchTerm(input) {

  let inputValue = input;

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
      console.log("City coordinates for " + $("input").val() + ":");
      console.log(data[0].lat);
      console.log(data[0].lon);

      locationLat = data[0].lat;
      locationLon = data[0].lon;

      getDailyWeather(locationLat, locationLon);
      getFiveDayWeather(locationLat, locationLon);

      let locationDataValues = {
        city: data[0].name,
        state: data[0].state,
        country: data[0].country
      };

      

      let keyNameData = data[0].name;

      storeSearchHistory(keyNameData, locationDataValues);

      return data;
    })

    .catch((err) => console.error(err));
}

function storeSearchHistory(keyNameData, searchData) {
  localStorage.setItem(keyNameData, JSON.stringify(searchData));
  return;
}

function retrieveSearchHistory() {
  const storageKeys = Object.keys(localStorage);
    for (let i = 0; i < storageKeys.length; i++) {

      let storedHistoryItems = JSON.parse(localStorage.getItem(storageKeys[i]));
      console.log("Search History Item:")
      console.log(storedHistoryItems);

      let historyItem = $("<li>").html(storedHistoryItems.city + ", " + storedHistoryItems.state + ", " + storedHistoryItems.country);
      historyCont.append(historyItem);
      historyItem.addClass("history-item");
    }
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

searchBtn.on("click", function buttonClick() {
  organizeSearchTerm($("input").val());
  console.log("Search Item: " + $("input").val());
})

$(".history-item").on("click", function historyItemClick() {
  organizeSearchTerm($(this).html());
  console.log("Search Item: " + $(this).html());
})

clearBtn.on("click", function removeHistory() {
    localStorage.clear(), 
    $("li").remove();
});