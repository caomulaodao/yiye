/**
 * Created by laodao on 14-10-16.
 */

var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var ChannelsSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    tags: {
        type: [],
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    banner: {
        type: String,
    },
    creator: {
        type: String,
        required: true
    },
    subNum: {
        type: Number,
        default: 1
    },
    bmkNum: {
        type: Number,
        default: 0
    },
    time: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Channels',ChannelsSchema);