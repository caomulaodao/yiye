/**
 * Created by laodao on 14-10-16.
 */

var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var BugsSchema = Schema({
    email: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Bugs',BugsSchema);