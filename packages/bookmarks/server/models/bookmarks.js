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
    channelInfo: {
        channelId:Schema.ObjectId,
        channelName:String,
        channelLogo:String
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
    },
    checked: {
        type:Number,//0：未审核，1：审核通过，并且未通知，2：审核未通过，并且没通知，3：审核通过，并且已经通知， 4：审核没通过，并且已经通知， 5:管理员提交的，不需要审核， 6：用户留底书签
        default:0
    },
    deleteInfo:{
        type:String
    },
    checkUser:{
        userId:Schema.ObjectId,
        username:String
    }
});


mongoose.model('Bookmarks', bookmarksSchema);