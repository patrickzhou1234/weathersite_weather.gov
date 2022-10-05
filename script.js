body = document.body;
weatherimg = document.getElementById("weatherimg");
temperature = document.getElementById("temp");
shortcast = document.getElementById("shortcast");
favicon = document.getElementById("favicon");
windspeed = document.getElementById("windspeed");
loc = document.getElementById("location");
timest = document.getElementById("time");
uvind = document.getElementById("uvind");
uv_max = document.getElementById("uvmax");
ozone = document.getElementById("ozone");
sunrise = document.getElementById("sunrise");
sunset = document.getElementById("sunset");

window.onload = function() {
    $("#weatherimg").animate({
        left: window.innerWidth/2-weatherimg.offsetWidth/2+'px'
    }, 2000);
    $("#temp").animate({
        opacity: 1
    }, 3000);
    $("#shortcast").animate({
        opacity: 1
    }, 3000);
    $("#credits").animate({
        right: 0+"vw", opacity: 1
    }, 4000);
}

$.getJSON('https://json.geoiplookup.io/?callback=?', function(data) {
    objify = data;
    latitude = objify['latitude'];
    longitude = objify['longitude'];
    city = objify['city'];
    region = objify['region'];
    loc.innerHTML = city+", "+region;
    weatherln = `https://api.weather.gov/points/${latitude},${longitude}`;
    $.getJSON(weatherln, function(data) {
        objweath = data;
        $.getJSON(objweath['properties']['forecastHourly'], function(data) {
            weatherobj = data;
            shortcast.innerHTML = weatherobj['properties']['periods'][0]['shortForecast'];
            temperature.innerHTML = weatherobj['properties']['periods'][0]['temperature']+"° "+weatherobj['properties']['periods'][0]['temperatureUnit'];
            windspeed.innerHTML = weatherobj['properties']['periods'][0]['windSpeed']+" "+weatherobj['properties']['periods'][0]['windDirection'];
            if (weatherobj['properties']['periods'][0]['shortForecast'] == "Sunny" || weatherobj['properties']['periods'][0]['shortForecast'] == "Mostly Sunny" || weatherobj['properties']['periods'][0]['shortForecast'] == "Partly Sunny") {
                body.style.backgroundColor = "#508CC2";
                weatherimg.src = "sunny.png";
                favicon.href = "sunny.png";
            } else if (weatherobj['properties']['periods'][0]['shortForecast']=="Cloudy" || weatherobj['properties']['periods'][0]['shortForecast']=="Partly Cloudy") {
                body.style.backgroundColor = "gray";
                weatherimg.src = "cloudy.png";
                favicon.href = "cloudy.png";
            } else if (weatherobj['properties']['periods'][0]['shortForecast']=="Mostly Clear") {
                body.style.backgroundColor = "#1e2c4b";
                weatherimg.src = "moon.png";
                favicon.href = "moon.png";
            }
        });
    });
    $.ajax({
        type: 'GET',
        dataType: 'json',
        beforeSend: function(request) {
          request.setRequestHeader('x-access-token', '2d1da72bd71e2a05c16c1487c538d9f5');
        },
        url: 'https://api.openuv.io/api/v1/uv?lat=' + latitude + '&lng=' + longitude,
        success: function(response) {
            uvind.innerHTML = response["result"]["uv"];
            uvmax.innerHTML = response["result"]["uv_max"];
            ozone.innerHTML = response["result"]["ozone"];
            dt = new Date(response["result"]["sun_info"]["sun_times"]["sunrise"]).toLocaleTimeString();
            sunrise.innerHTML = dt;
            dt = new Date(response["result"]["sun_info"]["sun_times"]["sunset"]).toLocaleTimeString();
            sunset.innerHTML = dt;
        },
        error: function(response) {
          
        }
    });
    
});

setInterval(() => {
    d = new Date();
    timest.innerHTML = d.toLocaleTimeString();
}, 1000);