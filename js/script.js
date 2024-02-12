const dailyWeatherSection = $("#dailyweather-cont");
const fiveDayWeatherSection = $("#fivedayweather-cont");
const searchBtn = $("#search-btn");
const historyCont = $("#search-his");
const clearBtn = $("#clear-btn");
const currentWeather = $("#current-weather");
const fiveDayWeather = [
  $(".one"),
  $(".two"),
  $(".three"),
  $(".four"),
  $(".five"),
];
const searchBarCont = $("#search-bar");

const apiUrl = "https://api.openweathermap.org/";
const apiKey = "812c298cb75ccb625e8f2897604e82bb";

retrieveSearchHistory();

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
      apiKey +
      `&units=imperial`
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
      console.log("City coordinates for location" + $("input").val() + ":");
      console.log(data[0].lat);
      console.log(data[0].lon);

      locationLat = data[0].lat;
      locationLon = data[0].lon;

      getDailyWeather(locationLat, locationLon);
      getFiveDayWeather(locationLat, locationLon);

      let locationDataValues = {
        city: data[0].name,
        state: data[0].state,
        country: data[0].country,
      };

      let keyNameData = data[0].name;

      storeSearchHistory(keyNameData, locationDataValues);

      return data;
    })

    .catch((err) => {
      console.error(err);
    });
}

function storeSearchHistory(keyNameData, searchData) {
  localStorage.setItem(keyNameData, JSON.stringify(searchData));
  return;
}

function retrieveSearchHistory() {
  const storageKeys = Object.keys(localStorage);
  for (let i = 0; i < storageKeys.length; i++) {
    let storedHistoryItems = JSON.parse(localStorage.getItem(storageKeys[i]));
    console.log("Search History Item:");
    console.log(storedHistoryItems);

    let historyItem = $("<li>").html(
      storedHistoryItems.city +
        ", " +
        storedHistoryItems.state +
        ", " +
        storedHistoryItems.country
    );
    historyCont.append(historyItem);
    historyItem.addClass("history-item");
  }
}

function getDailyWeather(lat, lon) {
  console.log("getting daily weather...");
  fetch(
    apiUrl +
      `data/2.5/weather?lat=` +
      lat +
      `&lon=` +
      lon +
      `&appid=` +
      apiKey +
      `&units=imperial`
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
      populateCurrentDay(data);
    });
}

function populateCurrentDay(currentDayData) {
  const data = currentDayData;
  const date = new Date((data.dt + data.timezone) * 1000).toUTCString();
  console.log("Location Date: " + date);

  const dataArr = date.split(" ");

  const currentDate = {
    weekDay: dataArr[0].replace(",", ""),
    day: dataArr[1],
    month: dataArr[2],
    year: dataArr[3],
    time: dataArr[4],
    currentHour: dataArr[4].substring(0, 2),
  };

  console.log("The current hour is: " + currentDate.currentHour + "00");

  weatherInfo = {
    temp: Math.round(data.main.temp) + "°",
    humidity: data.main.humidity + "%",
    windSpd: data.wind.speed + "mph",
  };

  console.log(
    "Current Weather Conditions: Temperature: " +
      weatherInfo.temp +
      ", Humidity: " +
      weatherInfo.humidity +
      ", Wind Speed: " +
      weatherInfo.windSpd
  );

  let locationValues = {
    city: data.name,
    country: data.sys.country,
  };

  const dataLogo = data.weather[0].icon;
  const weatherLogo = $("<img>").attr(
    "src",
    "http://openweathermap.org/img/w/" + dataLogo + ".png"
  );

  const locationName = $("<p>").html(
    locationValues.city + ", " + locationValues.country
  );
  const locationDate = $("<p>").html(
    currentDate.weekDay +
      ", " +
      currentDate.month +
      " " +
      currentDate.day +
      ", " +
      currentDate.year
  );

  const temp = $("<p>").html("Temperature (°F):</br>" + weatherInfo.temp);
  const humidity = $("<p>").html("Humidity:</br>" + weatherInfo.humidity);
  const windSpd = $("<p>").html("Wind Speed:</br>" + weatherInfo.windSpd);

  const locationLogoDateDiv = $("<div>");
  const dataDiv = $("<div>");

  locationLogoDateDiv.addClass("location-logo-date");
  dataDiv.addClass("data-div");

  currentWeather.append(locationLogoDateDiv);
  locationLogoDateDiv.append(locationName);
  locationLogoDateDiv.append(weatherLogo);
  locationLogoDateDiv.append(locationDate);

  currentWeather.append(dataDiv);
  dataDiv.append(temp);
  dataDiv.append(humidity);
  dataDiv.append(windSpd);
}

function getFiveDayWeather(lat, lon) {
  console.log("getting 5-Day Weather...");
  fetch(
    apiUrl +
      `data/2.5/forecast?lat=` +
      lat +
      `&lon=` +
      lon +
      `&appid=` +
      apiKey +
      `&units=imperial`
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
      populateFiveDay(data);
    });
}

function populateFiveDay(fiveDayData) {
  const data = fiveDayData;
  const dataArray = data.list;

  for (let i = 5; i < 40; i += 8) {
    console.log("5-Day Weather:");
    console.log(dataArray[i]);
  };

  const dataOne = dataArray[5];
  const dataTwo = dataArray[13];
  const dataThree = dataArray[21];
  const dataFour = dataArray[29];
  const dataFive = dataArray[37];

  let dayOneInfo = {
    date: dataOne.dt_txt.substr(5, 5).replaceAll("-", "/") + "/" + dataOne.dt_txt.substr(0, 4),
    logo: $("<img>").attr("src", "http://openweathermap.org/img/w/" + dataOne.weather[0].icon + ".png"),
    temp: Math.round(dataOne.main.temp) + "°",
    humidity: dataOne.main.humidity + "%",
    windSpd: dataOne.wind.speed + "mph"
  }

  const dateOne = $("<p>").html(dayOneInfo.date);
  const logoOne = dayOneInfo.logo;
  const tempOne = $("<p>").html("Temperature (°F):</br>" + dayOneInfo.temp);
  const humidityOne = $("<p>").html("Humidity:</br>" + dayOneInfo.humidity);
  const windSpdOne = $("<p>").html("Wind Speed:</br>" + dayOneInfo.windSpd);
  fiveDayWeather[0].append(dateOne);
  fiveDayWeather[0].append(logoOne);
  fiveDayWeather[0].append(tempOne);
  fiveDayWeather[0].append(humidityOne);
  fiveDayWeather[0].append(windSpdOne);

  let dayTwoInfo = {
      date: dataTwo.dt_txt.substr(5, 5).replaceAll("-", "/") + "/" + dataTwo.dt_txt.substr(0, 4),
      logo: $("<img>").attr("src", "http://openweathermap.org/img/w/" + dataTwo.weather[0].icon + ".png"),
      temp: Math.round(dataTwo.main.temp) + "°",
      humidity: dataTwo.main.humidity + "%",
      windSpd: dataTwo.wind.speed + "mph"
  }

  const dateTwo = $("<p>").html(dayTwoInfo.date);
  const logoTwo = dayTwoInfo.logo;
  const tempTwo = $("<p>").html("Temperature (°F):</br>" + dayTwoInfo.temp);
  const humidityTwo = $("<p>").html("Humidity:</br>" + dayTwoInfo.humidity);
  const windSpdTwo = $("<p>").html("Wind Speed:</br>" + dayTwoInfo.windSpd);
  fiveDayWeather[1].append(dateTwo);
  fiveDayWeather[1].append(logoTwo);
  fiveDayWeather[1].append(tempTwo);
  fiveDayWeather[1].append(humidityTwo);
  fiveDayWeather[1].append(windSpdTwo);

  let dayThreeInfo = {
      date: dataThree.dt_txt.substr(5, 5).replaceAll("-", "/") + "/" + dataThree.dt_txt.substr(0, 4),
      logo: $("<img>").attr("src", "http://openweathermap.org/img/w/" + dataThree.weather[0].icon + ".png"),
      temp: Math.round(dataThree.main.temp) + "°",
      humidity: dataThree.main.humidity + "%",
      windSpd: dataThree.wind.speed + "mph"
  }

  const dateThree = $("<p>").html(dayThreeInfo.date);
  const logoThree = dayThreeInfo.logo;
  const tempThree = $("<p>").html("Temperature (°F):</br>" + dayThreeInfo.temp);
  const humidityThree = $("<p>").html("Humidity:</br>" + dayThreeInfo.humidity);
  const windSpdThree = $("<p>").html("Wind Speed:</br>" + dayThreeInfo.windSpd);
  fiveDayWeather[2].append(dateThree);
  fiveDayWeather[2].append(logoThree);
  fiveDayWeather[2].append(tempThree);
  fiveDayWeather[2].append(humidityThree);
  fiveDayWeather[2].append(windSpdThree);

  let dayFourInfo = {
      date: dataFour.dt_txt.substr(5, 5).replaceAll("-", "/") + "/" + dataFour.dt_txt.substr(0, 4),
      logo: $("<img>").attr("src", "http://openweathermap.org/img/w/" + dataFour.weather[0].icon + ".png"),
      temp: Math.round(dataFour.main.temp) + "°",
      humidity: dataFour.main.humidity + "%",
      windSpd: dataFour.wind.speed + "mph"
  }

  const dateFour = $("<p>").html(dayFourInfo.date);
  const logoFour = dayFourInfo.logo;
  const tempFour = $("<p>").html("Temperature (°F):</br>" + dayFourInfo.temp);
  const humidityFour = $("<p>").html("Humidity:</br>" + dayFourInfo.humidity);
  const windSpdFour = $("<p>").html("Wind Speed:</br>" + dayFourInfo.windSpd);
  fiveDayWeather[3].append(dateFour);
  fiveDayWeather[3].append(logoFour);
  fiveDayWeather[3].append(tempFour);
  fiveDayWeather[3].append(humidityFour);
  fiveDayWeather[3].append(windSpdFour);

  let dayFiveInfo = {
      date: dataFive.dt_txt.substr(5, 5).replaceAll("-", "/") + "/" + dataFive.dt_txt.substr(0, 4),
      logo: $("<img>").attr("src", "http://openweathermap.org/img/w/" + dataFive.weather[0].icon + ".png"),
      temp: Math.round(dataFive.main.temp) + "°",
      humidity: dataFive.main.humidity + "%",
      windSpd: dataFive.wind.speed + "mph"
  }

  const dateFive = $("<p>").html(dayFiveInfo.date);
  const logoFive = dayFiveInfo.logo;
  const tempFive = $("<p>").html("Temperature (°F):</br>" + dayFiveInfo.temp);
  const humidityFive = $("<p>").html("Humidity:</br>" + dayFiveInfo.humidity);
  const windSpdFive = $("<p>").html("Wind Speed:</br>" + dayFiveInfo.windSpd);
  fiveDayWeather[4].append(dateFive);
  fiveDayWeather[4].append(logoFive);
  fiveDayWeather[4].append(tempFive);
  fiveDayWeather[4].append(humidityFive);
  fiveDayWeather[4].append(windSpdFive);
}

searchBtn.on("click", function buttonClick() {
  currentWeather.empty();
  for (let i = 0; i < fiveDayWeather.length; i++) {
    fiveDayWeather[i].empty();
  }
  organizeSearchTerm($("input").val());
  console.log("Search Item: " + $("input").val());
});

$(".history-item").on("click", function historyItemClick() {
  currentWeather.empty();
  for (let i = 0; i < fiveDayWeather.length; i++) {
    fiveDayWeather[i].empty();
  }
  organizeSearchTerm($(this).html());
  console.log("Search Item: " + $(this).html());
});

clearBtn.on("click", function removeHistory() {
  localStorage.clear(), $("li").remove();
});
