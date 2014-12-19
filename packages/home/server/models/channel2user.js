/**
 * Created by laodao on 14-10-15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Channel2UserSchema = new Schema({
    //
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        require: true
    },
    userLogo: {
        type: String,
        require: true
    },
    //频道Id
    channelId:{
        type: Schema.Types.ObjectId,
        required: true
    },
    //频道名
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    //最后一次登录时间
    lastTime:{
        type: Date,
        default: Date.now
    },
    //关注时间
    followerTime:{
        type: Date,
        default: Date.now
    },
    //
    news: {
        type: Number,
        default: 0
    },
    //关注着类型 creator admin follower
    type:{
        type:String,
        default:"creator"
    },
    //是否已经提醒 0表示未提醒
    remind: {
        type: Number,
        default: 0
    }
});

mongoose.model('Channel2User', Channel2UserSchema);
