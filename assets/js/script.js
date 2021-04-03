const apiKey = "8df2a6f60b13333188f598a84ecd3bf3";

let searchBtnEl = document.getElementById("searchBtn");
let cityNameEl = document.getElementById("city-name");
let cityDateEl = document.getElementById("date");
let weatherIconEl = document.getElementById("weather-icon")
let temptEl = document.getElementById("temperature");
let humidityEl = document.getElementById("humidity");
let windEl = document.getElementById("wind-speed");
let uvEl = document.getElementById("UV-index");


let cities = "";
let date = moment().format("L")

// Storage
let STORAGE_CITY_KEY = "city-list";
let storedCities = localStorage.getItem(STORAGE_CITY_KEY);
if (storedCities !== null) {
    cities = JSON.parse(storedCities);
}


// API

function getWeather(cityName) {
    let weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&APPID=" + apiKey;

    fetch(weatherApiUrl)
        .then(function (response) {
            console.log("First promise");
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject("Failed to retrieve weather data for: '" + cityName + "'");
            }
        }).then(function (data) {
            console.log("Got our JSON data");
            console.log(data);
            // City's forecast for the day
            cityNameEl.innerHTML = cityName + " ";
            let cityDate = new Date((data.dt) * 1000);
            cityDateEl.innerHTML = cityDate.toDateString();
            let weatherIcon = data.weather[0].icon;
            let iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
            weatherIconEl.setAttribute("src", iconUrl);
            weatherIconEl.classList.add("iconSize");
            let celsiusTemp = convertTemp(data.main.temp).toFixed(1);
            temptEl.innerHTML = "Temperature: " + celsiusTemp + String.fromCharCode(176) + "C";
            humidityEl.innerHTML = "Humidity: " + data.main.humidity + "%";
            let speedMph = convertSpeed(data.wind.speed).toFixed(1);
            windEl.innerHTML = "Wind-speed: " + speedMph + "mph";
            let currentWeatherStyle = document.getElementById("current-weather");
            currentWeatherStyle.classList.add("container-style");

            let lon = data.coord.lon;
            let lat = data.coord.lat;
            let forecastApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly,alert&APPID=" + apiKey;
            return fetch(forecastApiUrl)
                .then(function (response) {
                    console.log("forecast promise")
                    if (response.ok) {
                        return response.json();
                    } else {
                        return Promise.reject("Failed to retrive forecast data for: '" + cityName + "'");
                    }

                }).then(function (data) {
                    console.log(data);
            //        City's forecast for the next 5 days


                });

        }).catch(function () {
            console.log("catch");
        })
        .finally(function () {
            console.log("Promise is done");
        });

    console.log("Fetch queued");
}

// function searchHistory() {

// }

function convertTemp (kelvin) {
    return kelvin - 273.15;
}
function convertSpeed (speedMs) {
    return speedMs * 2.237;
}

// Search Button

searchBtnEl.addEventListener("click", function () {
    let city = document.getElementById("search-city").value;
    getWeather(city);
    // searchHistory.push(city);
    // localStorage.setItem(STORAGE_CITY_KEY, JSON.stringify(searchHistory));

});