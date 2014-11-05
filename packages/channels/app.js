'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Channels = new Module('channels');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Channels.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Channels.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Channels.menus.add({
        title: 'channels example page',
        link: 'channels example page',
        roles: ['authenticated'],
        menu: 'main'
    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Channels.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Channels.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Channels.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    return Channels;
});
