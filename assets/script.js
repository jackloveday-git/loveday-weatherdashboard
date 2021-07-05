
//Declare universals:
let input = "";
let currentSearch = "";
let currentWeather = "";
let cName = "";
let lat = "";
let long = "";

//Array to hold button/history in local storage
let historyArray = [];
let localHolder = [];

//Local Storage:
let local = window.localStorage;

//API Keys:
const mqKey = "mBIL6J4uNlPYLUR5ziz6RElDExda8NGz";
const owKey = "256755075c821e588d27d87c502e4e99";


//Init Commands
hideAssets();
checkLocal();

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

//Function to input *USER* data into city search
function citySearch(city) {

    //Take user input, fetch from Map Quest API to find Lat/Long & City Name
    //Create mqFetchURL for easy fetch of MQ API!
    let mqFetchURL = "https://open.mapquestapi.com/geocoding/v1/address?key=" + mqKey + "&location=" + city;

    //Commence Fetch Map Quest req
    fetch(mqFetchURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            //Save Obj to Universal (We only need one city at a time)
            currentSearch = data;

            //Pull city name, city lat, city lng and save in our universals
            let tName = currentSearch.results[0].locations[0].adminArea5;

            //If city name under adminArea5 comes up blank, use the user input
            if (tName == "") {
                cName = input;
            } else {
                cName = tName;
            };

            //Let's add this button to our history tracker
            historyBtn(cName);

            //Grab the Lat/Lon values and send them to be displayed
            let cLat = currentSearch.results[0].locations[0].latLng.lat;
            lat = cLat;
            let cLong = currentSearch.results[0].locations[0].latLng.lng;
            long = cLong;

            setDisplay(lat, long);
        });
}

//Function to input *HISTORY* data into city search (processed slightly differently)
function citySearchHistory(city) {

    //Take user input, fetch from Map Quest API to find Lat/Long & City Name
    //Create mqFetchURL for easy fetch of MQ API!
    let mqFetchURL = "https://open.mapquestapi.com/geocoding/v1/address?key=" + mqKey + "&location=" + city;

    //Commence Fetch Req
    fetch(mqFetchURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            //Save Obj to Universal (We only need one city at a time)
            currentSearch = data;

            //Pull city name, city lat, city lng and save in our universals
            let tName = currentSearch.results[0].locations[0].adminArea5;

            if (tName == "") {
                cName = city;
            } else {
                cName = tName;
            };

            let cLat = currentSearch.results[0].locations[0].latLng.lat;
            lat = cLat;
            let cLong = currentSearch.results[0].locations[0].latLng.lng;
            long = cLong;

            setDisplay(lat, long);
        });
}

//Add a button to our history buttons with the given label
function historyBtn(label) {
    //Create the local button
    var tBtn = document.createElement("BUTTON");
    $(tBtn).html(label);
    $(tBtn).addClass("btn btn-secondary");
    $("#btn-container").prepend(tBtn);

    //When the button is clicked:
    $(tBtn).click(() => {
        //Bring up the values again and make sure it shows!
        citySearchHistory(label);
        showAssets();
    });

    //Add button label text to our array
    historyArray.push(label);

    //Then let's save the updated array to local storage
    local.setItem('history', JSON.stringify(historyArray));
}

//A function to check our local storage
function checkLocal() {

    //If our storage isn't empty:
    if (local.length > 1) {
        localHolder = JSON.parse(local.getItem('history'));

        for (var i = 0; i < localHolder.length; i++) {
            historyBtn(localHolder[i]);
        }
    } else {    //Otherwise let's make sure its clear!
        local.clear();
    }
}

//Set Display info
function setDisplay(lat, lon) {
    let cLat = lat;
    let cLon = lon;

    //Get Weather info:
    let owFetchURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cLat + "&lon=" + cLon + "&exclude=minutely,hourly,alerts&units=metric&appid=" + owKey;

    fetch(owFetchURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            currentWeather = data;

            //Set Date based on search!!!!
            const tzOffset = currentWeather.timezone_offset;
            const tzOffsetMins = tzOffset / 60;
            const dateObj = moment().utcOffset(tzOffsetMins);
            const currDate = dateObj.format("L");

            //Set City Name & Date
            $("#city").html("<h3>" + cName + " (" + currDate + ")</h3>");

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
            let d1Date = forecastDate(dateObj, 1);
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
            let d2Date = forecastDate(dateObj, 2);
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
            let d3Date = forecastDate(dateObj, 3);
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
            let d4Date = forecastDate(dateObj, 4);
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
            let d5Date = forecastDate(dateObj, 5);
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
function forecastDate(sDate, added) {
    let lDate = sDate;
    let nDate = moment(lDate).add(added, "days");
    let fDate = moment(nDate).format("L");
    return fDate;
}


//On Search Button Press:
$("#search-btn").click(() => {
    //Take value from search bar and save as universal
    input = $("#search-bar").val();
    $("#search-bar").val("");
    if (input == null) {
        console.log("Invalid Entry.");
    } else if (input == "") {
        console.log("Invalid Entry.");
    } else if (input == " ") {
        console.log("Invalid Entry.");
    } else if (input.length < 3) {
        console.log("Invalid Entry.");
    } else {
        //Input the value into citySearch Function
        citySearch(input);
        showAssets();
    }
});