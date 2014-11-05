/**
 * Created by laodao on 14-9-30.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 *
 *  bookmarks Schema
 *
 **/

var bookmarksSchema = Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: Array
    },
    image:{
        type: String,
        required: true
    },
    postTime: {
        type:Date,
        default:Date.now
    },
    postUser: {
        userId:Schema.ObjectId,
        username:String
    },
    channelId: {
        type:Schema.ObjectId
    },
    comments: {
        type: Array
    },
    likeNum: {
        type: Number,
        default:0
    },
    hateNum: {
        type: Number,
        default:0
    }
});


mongoose.model('Bookmarks', bookmarksSchema);