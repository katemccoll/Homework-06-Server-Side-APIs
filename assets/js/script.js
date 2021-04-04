const apiKey = "8df2a6f60b13333188f598a84ecd3bf3";



let uvEl = $("#UV-index");

let card = $("#forecast-card").clone();


let cities = "";

// Storage
let STORAGE_CITY_KEY = "city-list";
let storedCities = localStorage.getItem(STORAGE_CITY_KEY);
if (storedCities !== null) {
    cities = JSON.parse(storedCities);
}


function convertDtToString(dt) {
    let date_ob = new Date(dt * 1000);
    let year = date_ob.getFullYear();
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let date = ("0" + date_ob.getDate()).slice(-2);
    return "(" + date + "/" + month + "/" + year + ")";    
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
            $("#date").append(convertDtToString(data.dt));

            let weatherIcon = data.weather[0].icon;
            let iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
            $("#weather-icon").attr("src", iconUrl);
            $("#weather-icon").addClass("iconSize");
            let celsiusTemperature = convertTemp(data.main.temp).toFixed(1);
            $("#temperature").append("Temperature: " + celsiusTemperature + " " + String.fromCharCode(176) + "C");
            $("#humidity").append("Humidity: " + data.main.humidity + "%");
            let speedMph = convertSpeed(data.wind.speed).toFixed(1);
            $("#wind-speed").append("Wind-speed: " + speedMph + " km/h");
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
            $("#UV-index-title").prepend("UV Index: ");
            let uvIndex = data.daily[0].uvi;
            $("#UV-index-number").removeClass();
            $("#UV-index-number").append( uvIndex);
            if (uvIndex <= 2.5) {
                $("#UV-index-number").addClass("favorable");
            } else if (uvIndex >= 5.5) {
                $("#UV-index-number").addClass("severe");
            } else {
                $("#UV-index-number").addClass("moderate");
            }
         //        City's forecast for the next 5 days

            $("#forecast-title").append("5-Day Forecast:");

            $("#forecast-card").remove();

            for (let i = 1; i < 6; i++) {
                let forecastCard = card.clone();
                let forecast = data.daily[i];
                forecastCard.find(".forecast-date").append(convertDtToString(forecast.dt));
                forecastCard.addClass("card")
                let forecastIcon = forecast.weather[0].icon;
                let forecastIconUrl = "https://openweathermap.org/img/wn/" + forecastIcon + ".png";
                forecastCard.find("#forecast-icon").attr("src", forecastIconUrl);
                forecastCard.find("#forecast-icon").addClass("iconSize");

                let celsiusTemp = convertTemp(forecast.temp.max).toFixed(1);
                forecastCard.find("#forecast-temp").append("Temp: " + celsiusTemp + " " + String.fromCharCode(176) + "C");
                forecastCard.find("#forecast-humidity").append("Humidity: " + forecast.humidity + "%");



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
    return speedMs * 3.6;
}

// Search Button

$("#searchBtn").click(function () {
    let city = document.getElementById("search-city").value;
    getWeather(city);
    // searchHistory.push(city);
    // localStorage.setItem(STORAGE_CITY_KEY, JSON.stringify(searchHistory));

});