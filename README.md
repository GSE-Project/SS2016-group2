|Branch|Build status|Test coverage|
|---|---|---|
|Develop|[![Build Status](https://travis-ci.org/GSE-Project/SS2016-group2.svg?branch=develop)](https://travis-ci.org/GSE-Project/SS2016-group2)|[![Coverage Status](https://coveralls.io/repos/GSE-Project/SS2016-group2/badge.svg?branch=master)](https://coveralls.io/r/GSE-Project/SS2016-group2?branch=develop)|
|Master|[![Build Status](https://travis-ci.org/GSE-Project/SS2016-group2.svg?branch=master)](https://travis-ci.org/GSE-Project/SS2016-group2)|[![Coverage Status](https://coveralls.io/repos/GSE-Project/SS2016-group2/badge.svg?branch=master)](https://coveralls.io/r/GSE-Project/SS2016-group2?branch=master)|

# Digitale Dörfer - mobile people’s bus system

This project deals with the development of a mobile people’s bus system. The system consists of a mobile app that serves as the people’s bus host system and another mobile app for citizens to use the different people’s busses. It is intended, that the system will be used within the project [Digitale Dörfer](http://www.digitale-doerfer.de)

Citizen Mobile APP
------------------

This repository contains the source code of the CitizenApplication, used by the citizens of the rural areas.

This app is used to get information of buses, like current location and potential delay times, in a given town/village and provide this information to the user of the app. Location of a bus is used to precisely calculate the time of arrival at a given stop.

The application is written in [TypeScript](https://github.com/Microsoft/TypeScript) utilizes the beta version of the cross-platform development framework [Ionic](https://github.com/driftyco/ionic/tree/2.0).

Can I build this application myself?
---------------------------------------

Sure, feel free to clone this repository and try to build it locally. To achieve this, you need to do following:

1) Install the Node.js, the LTS version is fine.

2) Open a command-line (or shell).

3) Install the Ionic CLI tools:

    `npm install -g ionic@beta (on the Mac OSX use sudo)`

4) Go to the CitizenApp directory.

5) Install the NPM dependencies:

    `npm install`

6) Start the integrated web server:

    `ionic serve`

7) You might get a warning to install/upgrade some tools.
	Use the shown command/s to continue.
	
8) The app will open in a browser.

In order to see some data in the application, you'll need to start our mock server. Please follow these steps:

1) Go to RestServer directory.

2) Install the NPM dependencies:

    `npm install`

3) Start the server:

    `node index.js`

4) **Have fun!**