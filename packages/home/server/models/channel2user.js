/**
 * Created by laodao on 14-10-15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Channel2UserSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    channelId:{
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    lastTime:{
        type: Date,
        default: Date.now
    },
    followerTime:{
        type: Date,
        default: Date.now
    },
    news: {
        type: Number,
        default: 0
    },
    type:{
        type:String,
        default:"creator"
    }
});

mongoose.model('Channel2User', Channel2UserSchema);
