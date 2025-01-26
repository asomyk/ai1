const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.currentWeatherLink = "https://api.openweathermap.org/data/2.5/weather?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.forecastLink = "https://api.openweathermap.org/data/2.5/forecast?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.iconLink = "https://openweathermap.org/img/wn/{iconName}@2x.png";

        this.currentWeatherLink = this.currentWeatherLink.replace("{apiKey}", this.apiKey);
        this.forecastLink = this.forecastLink.replace("{apiKey}", this.apiKey);

        this.currentWeather = undefined;
        this.forecast = undefined;

        this.resultsBlock = document.querySelector(resultsBlockSelector);
    }

    getCurrentWeather(query) {
        let url = this.currentWeatherLink.replace("{query}", query);
        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", () => {
            this.currentWeather = JSON.parse(req.responseText);
            console.log(this.currentWeather);
            this.drawWeather();
        });
        req.send();
    }

    getForecast(query) {
        let url = this.forecastLink.replace("{query}", query);
        fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            this.forecast = data.list;
            this.drawWeather();
        });
    }

    getWeather(query) {
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather() {
        const currentWeatherContainer = document.querySelector("#current-weather .weather-block");
        currentWeatherContainer.innerHTML = `
        <div class="weather-date">Teraz</div>
        <div class="weather-temperature">${this.currentWeather.main.temp} &deg;C</div>
        <div class="weather-temperature-feels-like">Odczuwalna: ${this.currentWeather.main.feels_like} &deg;C</div>
        <img class="weather-icon" src="https://openweathermap.org/img/wn/${this.currentWeather.weather[0].icon}@2x.png" alt="Weather Icon">
        <div class="weather-description">${this.currentWeather.weather[0].description}</div>
    `;

        const forecastContainer = document.querySelector("#forecast-container");
        forecastContainer.innerHTML = "";

        const forecastByDay = {};
        this.forecast.forEach((item) => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!forecastByDay[date]) {
                forecastByDay[date] = [];
            }
            forecastByDay[date].push(item);
        });

        Object.keys(forecastByDay).forEach((day) => {
            const dayBlock = document.createElement("div");
            dayBlock.classList.add("forecast-day");
            dayBlock.innerHTML = `<h3>${day}</h3>`;

            forecastByDay[day].forEach((item) => {
                const weatherBlock = document.createElement("div");
                weatherBlock.classList.add("weather-block");
                weatherBlock.innerHTML = `
                <div class="weather-date">${new Date(item.dt * 1000).toLocaleTimeString()}</div>
                <div class="weather-temperature">${item.main.temp} &deg;C</div>
                <div class="weather-temperature-feels-like">Odczuwalna: ${item.main.feels_like} &deg;C</div>
                <img class="weather-icon" src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather Icon">
                <div class="weather-description">${item.weather[0].description}</div>
            `;
                dayBlock.appendChild(weatherBlock);
            });
            forecastContainer.appendChild(dayBlock);
        });
    }



    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        let weatherBlock = document.createElement("div");
        weatherBlock.className = "weather-block";

        let dateBlock = document.createElement("div");
        dateBlock.className = "weather-date";
        dateBlock.innerText = dateString;
        weatherBlock.appendChild(dateBlock);

        let temperatureBlock = document.createElement("div");
        temperatureBlock.className = "weather-temperature";
        temperatureBlock.innerHTML = `${temperature} &deg;C`;
        weatherBlock.appendChild(temperatureBlock);

        let feelsLikeBlock = document.createElement("div");
        feelsLikeBlock.className = "weather-temperature-feels-like";
        feelsLikeBlock.innerHTML = `Odczuwalna: ${feelsLikeTemperature} &deg;C`;
        weatherBlock.appendChild(feelsLikeBlock);

        let weatherIcon = document.createElement("img");
        weatherIcon.className = "weather-icon";
        weatherIcon.src = this.iconLink.replace("{iconName}", iconName);
        weatherBlock.appendChild(weatherIcon);

        let weatherDescription = document.createElement("div");
        weatherDescription.className = "weather-description";
        weatherDescription.innerText = description;
        weatherBlock.appendChild(weatherDescription);

        return weatherBlock;
    }
}

document.weatherApp = new WeatherApp("341442fedb175d228649134f46dc13da", "#weather-results-container");

document.querySelector("#checkButton").addEventListener("click", function() {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});