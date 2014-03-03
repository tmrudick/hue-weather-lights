hue-weather-lights
=======

Turns on a light in my bedroom every morning at 7:45am. It will be blue if I should take an umbrella to work and white if it will be a non-rainy day. It will be red if it will be colder than 32 degree F. It will be purple if it will be both cold and rainy. The light will then turn itself off at 8:45am.

Requirements
-------

1. [Philips Hue Lights and Bridge](http://meethue.com)
2. [Forecast.io developer key](https://developer.forecast.io/)
3. [nodejs](http://nodejs.org)

Installation
-------

    git clone git@github.com:tmrudick/hue-weather-lights.git ; cd hue-weather-lights
    npm install
    mv config.json.sample config.json

Update the values in config.json with your Forecast.io developer key and Hue bridge settings.

Running
-------

    node app.js

I am currently running this on a Rasbian Raspberry Pi using upstart to keep the process going just in case. It sits in my closet and works really well for this type of thing.

Contributing
-------

Want to add more features? Should the light turn red if it is going to be really hot? Want to make the on and off times configurable? Just send a pull request.
