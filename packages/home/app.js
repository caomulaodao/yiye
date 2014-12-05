'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Home = new Module('home');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Home.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Home.routes(app, auth, database);


    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Home.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Home.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Home.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    return Home;
});
