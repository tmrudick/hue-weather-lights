var request = require('request'),
    HueApi = require('node-hue-api').HueApi,
    LightState = require('node-hue-api').lightState;

// Get the weather data from darksky.net at 7:15am
job('get weather', function(done) {
    var url = 'https://api.darksky.net/forecast/' + this.config.tokens.forecastio + '/' + this.config.weather.latitude + ',' + this.config.weather.longitude;

    request({ url: url, json:true}, function(err, data) {
        done({
            color: {
                red: 0,
                green: 0,
                blue: 0
            },
            forecast: data.body
        });
    });
}).at('15 7 * * *'); //.defer();

// Determine if it will rain
job('will rain?', function(done, data) {
    if (data.forecast.daily.data[0].icon === 'rain') {
        data.color.blue += 255;
    }

    done(data);
}).after('get weather');

//Determine if will be very cold
job('is cold?', function(done, data) {
    if (data.forecast.currently.temperature < 32) {
        data.color.red += 255;
    }

    done(data.color);
}).after('will rain?');

// Change the color of the light based on the output of is cold
job(function(done, color) {
    console.log(color);
    var api = new HueApi(this.config.hue.hostname, this.config.hue.username),
        state = LightState.create().on().rgb(color.red, color.green, color.blue).brightness(80);

    api.setLightState(this.config.hue.lightId, state);
}).after('is cold?');

// Turn the lights off at 8:45am
job(function(done) {
    var api = new HueApi(this.config.hue.hostname, this.config.hue.username),
        state = LightState.create().off();

    api.setLightState(this.config.hue.lightId, state);

    done();
}).at('45 8 * * *').defer();
