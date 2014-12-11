/**
 * Created by laodao on 14/10/28.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 *
 *  bookmarkLike Schema
 *
 **/

var bookmarkLikeSchema = Schema({
    channelId :{
        type: Schema.ObjectId,
        required: true
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
    //未通知为0 通知后为1
    remind :{
        type: Number,
        default: 0
    },
    likeTime :{
        type: Date,
        default: Date.now
    }
});


mongoose.model('BookmarkLike', bookmarkLikeSchema);