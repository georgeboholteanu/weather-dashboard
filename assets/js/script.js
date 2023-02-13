let cities = [];
let imagePhoto = {

    thunderstorm: "./assets/images/thunderstorm.jpg",
    drizzle: "./assets/images/drizzle.jpg",
    rain: "./assets/images/rain.jpg",
    snow: "./assets/images/snow.jpg",
    mist: "./assets/images/mist.jpg",
    smoke: "./assets/images/smoke.jpg",
    haze: "./assets/images/haze.jpg",
    dust: "./assets/images/dust.jpg",
    fog: "./assets/images/fog.jpg",
    sand: "./assets/images/sand.jpg",
    dust: "./assets/images/dust.jpg",
    ash: "./assets/images/ash.jpg",
    squall: "./assets/images/squall.jpg",
    clear: "./assets/images/clear.jpg",
    clouds: "./assets/images/clouds.jpg"
};
// localStorage.clear()
function selectImage (id) {
    var weatherImage = "";

    if (id >= 200 && id <= 232){
        weatherImage = imagePhoto.thunderstorm;
    }else if(id >= 300 && id <= 321){
        weatherImage = imagePhoto.drizzle;
    }else if (id >= 500 && id <= 531){
        weatherImage = imagePhoto.rain;
    }else if (id >= 600 && id <= 622){
        weatherImage = imagePhoto.snow;
    }else if (id === 701 ){
        weatherImage = imagePhoto.mist;
    }else if (id === 711 ){
        weatherImage = imagePhoto.smoke;
    }else if (id === 721 ){
        weatherImage = imagePhoto.haze;
    }else if (id === 731 ){
        weatherImage = imagePhoto.dust;//sand/ dust whirls
    }else if (id === 741 ){
        weatherImage = imagePhoto.fog;
    }else if (id === 751 ){
        weatherImage = imagePhoto.sand;
    }else if (id === 761 ){
        weatherImage = imagePhoto.dust;
    }else if (id === 771 ){
        weatherImage = imagePhoto.squall;
    }else if (id === 781 ){
        weatherImage = imagePhoto.tornado;
    }else if (id === 800){
        weatherImage = imagePhoto.clear;
    }else if (id >= 801 && id <= 804){
        weatherImage = imagePhoto.clouds;
    }
    return weatherImage;

}

function createWeatherCard (cardDate, cardIcon, cardTemperature, cardWind, cardHumidity, container) {
    let card = 
        `
        <div class="weatherCard col bg-info">
            <p id="cardDate">${cardDate}</p>
            <img id="cardIcon" src='${cardIcon}'/>
            <p id="cardTemperature">Temperature: ${cardTemperature}°C</p>
            <p id="cardWind">Wind: ${cardWind} meter/sec</p>
            <p id="cardHumidity">Humidity: ${cardHumidity}%</p>
        </div>
        `;

    $(card).appendTo(container);
}


function getCurentWeather (city) {
    
    queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=90236eb36222bea0f6da79197481db9c`
    
    $.ajax({
        url: queryURL,
        method: "GET"
        })
        .then(function(response) {            
            console.log(response);
            
            let date = city + " ( " + moment() + " ) ";
            let iconCode = response.weather[0].icon;
            let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
            let temperature = ((response.main.temp - 273.15)).toFixed(2);                
            let wind = response.wind.speed;
            let humidity = response.main.humidity;
            let country = response.sys.country;
            
            if ($("#search-input").val() !== "") {
                $("#location").html($("#search-input").val().toUpperCase() + ", " + country);
            } else {
                $("#location").html(city.toUpperCase() + " | " + country);
            }


            createWeatherCard(date, iconUrl, temperature, wind, humidity, $("#today"))
        });
}

getCurentWeather("london")


