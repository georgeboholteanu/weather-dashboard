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
        <div class="weatherCard my-2 col border">
            <p id="cardDate"><strong>${cardDate}</strong></p>
            <img id="cardIcon" src='${cardIcon}'/>
            <p id="cardTemperature">Temp: ${cardTemperature} °C</p>
            <p id="cardWind">Wind: ${cardWind} km/h</p>
            <p id="cardHumidity">Humidity: ${cardHumidity} %</p>
        </div>
        `;

    $(card).appendTo(container);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getWeather (city) {
    
    queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=90236eb36222bea0f6da79197481db9c`

    $.ajax({
        url: queryURL,
        method: "GET"
        })
        .then(function(response) {            
            console.log(response);

            if (response.cod == 200 && response) { 

                let country = response.sys.country;
                let date = capitalizeFirstLetter(city) + " | " + country + " ( " + moment().format('dddd, MMMM Do YYYY') + " ) ";
                let iconCode = response.weather[0].icon;
                let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                let temperature = ((response.main.temp - 273.15)).toFixed(2);                
                let wind = (response.wind.speed * 3.6).toFixed(2); // convert meter/sec => km/h
                let humidity = response.main.humidity;
                

                createWeatherCard(date, iconUrl, temperature, wind, humidity, $("#today")) 

                // set custom image background based on search location
                // let imageLink = selectImage(response.weather[0].id);
                // $("#today").css({
                //     "background-image": "url(" + imageLink + ")",

                // });  
                
            } else {
                console.log("server error")
            }
        });
}

function getForecast (city) {
    queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=5&appid=90236eb36222bea0f6da79197481db9c&cnt=5`
    
    $.ajax({
        url: queryURL,
        method: "GET"
        })
        .then(function(response) {            
            console.log(response.list);         

            if (response.cod == 200 && response.list) {  

                let forecastArr = response.list;
                let count = 1;  
                forecastArr.forEach(element => {
                    
                    let date = moment().add(count, 'days').format('dddd, MMMM Do YYYY');
                    let iconCode = element.weather[0].icon;
                    let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
                    let temperature = ((element.main.temp - 273.15)).toFixed(2);                
                    let wind = (element.wind.speed * 3.6).toFixed(2); // convert meter/sec => km/h
                    let humidity = element.main.humidity;

                    count++;

                    createWeatherCard(date, iconUrl, temperature, wind, humidity, $("#forecast"))
                });
                $("#forecastTitle").removeClass("d-none");
            } else {
                console.log ("server error")
            }
        });
}

function quickWeatherCheck (clicked_id) {

    getWeather(clicked_id);
    getForecast(clicked_id);
    getHistory() 
}

function getHistory () {
    // clear weather cards
    document.querySelectorAll(".weatherCard").forEach(el => el.remove());
    // clear existing search history buttons
    document.querySelectorAll(".history-button").forEach(el => el.remove());

    if (JSON.parse(localStorage.getItem("cities")) !== null) {

        // filter only x amount of the recent history
        let newCities = JSON.parse(localStorage.getItem("cities")).filter(x => x !== "").slice(-4).reverse(); 
    
        // write buttons to div history
        newCities.forEach(element => {

            $(`<button class='history-button btn btn-secondary my-1' id='${element}' onclick='quickWeatherCheck(this.id)'/>`).html(element).appendTo($("#history"));
        });
        
    } else {        
        console.log("history cities is empty");
    }    
}

// search weather button event
$("#search-button").on("click", function(){   

    // store input values to local storage
    if (JSON.parse(localStorage.getItem("cities")) !== null) {

        cities = JSON.parse(localStorage.getItem("cities")).filter(x => x !== "");

        if (!cities.includes($("#search-input").val())) {

            cities.push($("#search-input").val());
        }

        localStorage.setItem("cities", JSON.stringify(cities));  
        
    } else {
        localStorage.setItem("cities", JSON.stringify(cities));       
 
        console.log("this object does not exist in local storage")
    }


    if ($("#search-input").val() !== "") {

        // get data
        getWeather($("#search-input").val());
        getForecast($("#search-input").val());
        getHistory();  
    } else {
        console.log("modal error")
    }

});

getHistory();
