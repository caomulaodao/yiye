'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Person = new Module('person');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Person.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Person.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Person.menus.add({
        title: 'person example page',
        link: 'person example page',
        roles: ['authenticated'],
        menu: 'main'
    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Person.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Person.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Person.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    return Person;
});
