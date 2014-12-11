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
    channelId :{
        type: Schema.ObjectId,
        require :true
    },
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
    },
    hateTime :{
        type: Date,
        default:Date.now
    }

});


mongoose.model('BookmarkHate', bookmarkHateSchema);