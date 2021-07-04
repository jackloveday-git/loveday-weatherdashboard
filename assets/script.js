console.log("Boot init");

//Declare universals:
let input = "";
let currentSearch = "";
let currentWeather = "";
let cName = "";
let lat = "";
let long = "";
let localDate = "";

//Local Storage:
let local = window.localStorage;

//API Keys:
const mqKey = "mBIL6J4uNlPYLUR5ziz6RElDExda8NGz";
const owKey = "256755075c821e588d27d87c502e4e99";


//Init Commands
getDate();
hideAssets();

//Hide what we dont have populated yet:
function hideAssets() {
    $("#main-row").hide();
    $("#5day-row").hide();
    $("#content-row").hide();
}

//Show content when we are done:
function showAssets() {
    $("#main-row").show();
    $("#5day-row").show();
    $("#content-row").show();
}


//Function to input user data into city search
function citySearch(city) {

    //Take user input, fetch from Map Quest API to find Lat/Long & City Name
    //Create mqFetchURL for easy fetch of MQ API!
    let mqFetchURL = "https://open.mapquestapi.com/geocoding/v1/address?key=" + mqKey + "&location=" + city;
    
    //Commence Fetch Req
    fetch(mqFetchURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        //Save Obj to Universal (We only need one city at a time)
        currentSearch = data;
        //console.log(currentSearch);

        //Pull city name, city lat, city lng and save in our universals
        let tName = currentSearch.results[0].locations[0].adminArea5;
        cName = tName;
        let cLat = currentSearch.results[0].locations[0].latLng.lat;
        lat = cLat;
        let cLong = currentSearch.results[0].locations[0].latLng.lng;
        long = cLong;

        setDisplay(lat, long);
    });
}

//Get Today's date to be compared to city for timezone
function getDate() {
    let tempDate = moment().toDate();
    let convDate = moment(tempDate).format("L");
    localDate = convDate;
    //console.log(localDate);
}

//Set Display info
function setDisplay(lat, lon) {
    let cLat = lat;
    let cLon = lon;

    $("#city").html("<h3>" + cName + " (" + localDate + ")</h3>");

    //Get Weather info:
    let owFetchURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cLat + "&lon=" + cLon + "&exclude=minutely,hourly,alerts&units=metric&appid=" + owKey;
    
    fetch(owFetchURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        currentWeather = data;
        console.log(currentWeather);

        //Take current values and assign them through holder values
        let cTemp = currentWeather.current.feels_like + " °C";
        let cWind = currentWeather.current.wind_speed + " KPH";
        let cHumidity = currentWeather.current.humidity + " %";
        let cUVI = currentWeather.current.uvi;

        //Display main info for current 
        $("#temp").html("Temp: " + cTemp);
        $("#wind").html("Wind: " + cWind);
        $("#humidity").html("Humidity: " + cHumidity);
        $("#uv").html(cUVI);

        //Assign colour for UV Index depending on value
        if (cUVI < 3) {
            $("#uv").addClass("bg-success");
        } else if (cUVI >= 3 && cUVI < 6) {
            $("#uv").addClass("bg-warning");
        } else {
            $("#uv").addClass("bg-danger");
        }

        //Set Daily Values:
        //Day 1
        let d1Date = forecastDate(1);
        let d1Img = currentWeather.daily[0].weather[0].icon;
        let d1Temp = "Temp: " + currentWeather.daily[0].feels_like.day + " °C";
        let d1Wind = "Wind: " + currentWeather.daily[0].wind_speed + " KPH";
        let d1Humiditiy = "Humiditiy: " + currentWeather.daily[0].humidity + " %";

        $("#date1").html(d1Date);
        $("#img1").html("<img src='http://openweathermap.org/img/wn/" + d1Img + "@2x.png'>");
        $("#temp1").html(d1Temp);
        $("#wind1").html(d1Wind);
        $("#humidity1").html(d1Humiditiy);

        //Day 2
        let d2Date = forecastDate(2);
        let d2Img = currentWeather.daily[1].weather[0].icon;
        let d2Temp = "Temp: " + currentWeather.daily[1].feels_like.day + " °C";
        let d2Wind = "Wind: " + currentWeather.daily[1].wind_speed + " KPH";
        let d2Humiditiy = "Humiditiy: " + currentWeather.daily[1].humidity + " %";

        $("#date2").html(d2Date);
        $("#img2").html("<img src='http://openweathermap.org/img/wn/" + d2Img + "@2x.png'>");
        $("#temp2").html(d2Temp);
        $("#wind2").html(d2Wind);
        $("#humidity2").html(d2Humiditiy);

        //Day 3
        let d3Date = forecastDate(3);
        let d3Img = currentWeather.daily[2].weather[0].icon;
        let d3Temp = "Temp: " + currentWeather.daily[2].feels_like.day + " °C";
        let d3Wind = "Wind: " + currentWeather.daily[2].wind_speed + " KPH";
        let d3Humiditiy = "Humiditiy: " + currentWeather.daily[2].humidity + " %";

        $("#date3").html(d3Date);
        $("#img3").html("<img src='http://openweathermap.org/img/wn/" + d3Img + "@2x.png'>");
        $("#temp3").html(d3Temp);
        $("#wind3").html(d3Wind);
        $("#humidity3").html(d3Humiditiy);

        //Day 4
        let d4Date = forecastDate(4);
        let d4Img = currentWeather.daily[3].weather[0].icon;
        let d4Temp = "Temp: " + currentWeather.daily[3].feels_like.day + " °C";
        let d4Wind = "Wind: " + currentWeather.daily[3].wind_speed + " KPH";
        let d4Humiditiy = "Humiditiy: " + currentWeather.daily[3].humidity + " %";

        $("#date4").html(d4Date);
        $("#img4").html("<img src='http://openweathermap.org/img/wn/" + d4Img + "@2x.png'>");
        $("#temp4").html(d4Temp);
        $("#wind4").html(d4Wind);
        $("#humidity4").html(d4Humiditiy);

        //Day 5
        let d5Date = forecastDate(5);
        let d5Img = currentWeather.daily[4].weather[0].icon;
        let d5Temp = "Temp: " + currentWeather.daily[4].feels_like.day + " °C";
        let d5Wind = "Wind: " + currentWeather.daily[4].wind_speed + " KPH";
        let d5Humiditiy = "Humiditiy: " + currentWeather.daily[4].humidity + " %";

        $("#date5").html(d5Date);
        $("#img5").html("<img src='http://openweathermap.org/img/wn/" + d5Img + "@2x.png'>");
        $("#temp5").html(d5Temp);
        $("#wind5").html(d5Wind);
        $("#humidity5").html(d5Humiditiy);


    });
}


//Return date text based on local date and 'days' added:
function forecastDate(added) {
    let lDate = moment().toDate();
    let nDate = moment(lDate).add(added, "days");
    let fDate = moment(nDate).format("L");
    return fDate;
}


//On Search Button Press:
$("#search-btn").click( () => {
    //console.log("search btn clicked.");

    //Take value from search bar and save as universal
    input = $("#search-bar").val();
    //console.log("Bar Content: " + input);

    //Input the value into citySearch Function
    citySearch(input);
    
    //Show Content:
    showAssets();
});