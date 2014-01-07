var request = require('request'),
    HueApi = require('node-hue-api').HueApi,
    LightState = require('node-hue-api').lightState;

// Build states onces
var states = {
    rainy: LightState.create().on().rgb(0, 0, 255).brightness(80),
    cold: LightState.create().on().rgb(255,0,0).brightness(80),
    sunny: LightState.create().on().white(500, 80),
    off: LightState.create().off()
};

// Get the weather data from forecast.io at 7:45am
job('get weather', function(done) {
    var url = 'https://api.forecast.io/forecast/' + this.config.tokens.forecastio + '/' + this.config.weather.latitude + ',' + this.config.weather.longitude;

    request({ url: url, json:true}, function(err, data) {
        done(data.body);
    });
}).at('15 7 * * *').defer();

// Determine if it will rain
job('will rain?', function(done, forecast) {
    if (forecast.daily.data[0].icon === 'rain') {
        done(true);
    } else {
        done(false);
    }
}).after('get weather');

//Determine if will be very cold
job('is cold?', function(done, forecast) {
    if (forecast.currently.temperature < 32){
        done(true);
    } else {
        done(false);
    }
}).after('get weather');

// Turn the light on based on if it will rain
job(function(done, rainy) {
    var api = new HueApi(this.config.hue.hostname, this.config.hue.username);

    if (rainy) {
        api.setLightState(this.config.hue.rainLightId, states.rainy, done);
    } else {
        api.setLightState(this.config.hue.rainLightId, states.sunny, done);
    }
}).after('will rain?');

// Turn the light on based on if it is very cold
job(function(done, cold) {
    var api = new HueApi(this.config.hue.hostname, this.config.hue.username);

    if (cold) {
        api.setLightState(this.config.hue.coldLightId, states.cold, done);
    } else {
        api.setLightState(this.config.hue.coldLightId, states.sunny, done);
    }
}).after('is cold?');

// Turn the lights off at 8:45am
job(function(done) {
    var api = new HueApi(this.config.hue.hostname, this.config.hue.username);

    api.setLightState(this.config.hue.lightId, states.off);

    done();
}).at('45 8 * * *').defer();