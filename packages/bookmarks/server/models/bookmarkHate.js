/**
 * Created by laodao on 14/10/28.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 *
 *  bookmarkHate Schema
 *
 **/

var bookmarkHateSchema = Schema({
    bookmarkId :{
        type: Schema.ObjectId,
        required: true
    },
    userId :{
        type: Schema.ObjectId,
        required: true
    },
    username :{
        type: String,
        required: true
    }
});


mongoose.model('BookmarkHate', bookmarkHateSchema);