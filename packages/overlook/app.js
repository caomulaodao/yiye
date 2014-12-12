'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Overlook = new Module('overlook');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Overlook.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Overlook.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Overlook.menus.add({
    title: 'overlook example page',
    link: 'overlook example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Overlook.aggregateAsset('css', 'overlook.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Overlook.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Overlook.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Overlook.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Overlook;
});
