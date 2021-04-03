const apiKey = "8df2a6f60b13333188f598a84ecd3bf3";



let uvEl = $("#UV-index");

let card = $(".card").clone();


let cities = "";

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
            $("#city-name").append(cityName + " ");
            // Date in City
            let date_ob = new Date((data.dt) * 1000);
            let year = date_ob.getFullYear();
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let date = ("0" + date_ob.getDate()).slice(-2);
            $("#date").append("(" + date + "/" + month + "/" + year + ")");

            let weatherIcon = data.weather[0].icon;
            let iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
            $("#weather-icon").attr("src", iconUrl);
            $("#weather-icon").addClass("iconSize");
            let celsiusTemp = convertTemp(data.main.temp).toFixed(1);
            $("#temperature").append("Temperature: " + celsiusTemp + String.fromCharCode(176) + "C");
            $("#humidity").append("Humidity: " + data.main.humidity + "%");
            let speedMph = convertSpeed(data.wind.speed).toFixed(1);
            $("#wind-speed").append("Wind-speed: " + speedMph + "mph");
            $("#current-weather").addClass("container-style");

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

                });

        }).then(function (data) {
            console.log(data);
         //        City's forecast for the next 5 days
            let forecastTitleEl = document.getElementById("forecast-title");
            $("#forecast-title").append("5-Day Forecast:");
            $(".card").remove();

            for (let i = 1; i < 5; i++) {
                let forecastCard = card.clone();
                let forecast = data.daily[i];
                let date = new Date((forecast.dt) * 1000);
                let forecastDate = date.toDateString();
                forecastCard.find(".forecast-date").append(forecastDate);
                forecastCard.appendTo(".forecast-container");




            }


        }).catch(function (error) {
            console.log("catch");
            console.log(error);
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

$("#searchBtn").click(function () {
    let city = document.getElementById("search-city").value;
    getWeather(city);
    // searchHistory.push(city);
    // localStorage.setItem(STORAGE_CITY_KEY, JSON.stringify(searchHistory));

});