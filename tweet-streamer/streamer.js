const Twit = require('twit');
const keys = require('./keys');
let BBB = require('./participantes');
var fs = require('fs')

var T = new Twit(keys);


let stream = T.stream('statuses/filter', { track: ['#bbb','#bbb21'] });


stream.on('tweet', function (tweet) {
    let TweetObject = getTweetObject(tweet);
    let text = TweetObject.text.toLowerCase();
    BBB.forEach(elem => {
        elem.queries.forEach(query => {
            if(text.includes(query)){
                elem.tweets++;
                return;
            }
        })
    })

    console.log(BBB[0].tweets)
});

setTimeout(() => {
    stream.stop();
    console.log('foi de berço');
    fs.writeFile("BBB.json", JSON.stringify(BBB), function(err, result) {
        if(err) console.log('error', err);
    })
}, 1000 * 5)

stream.on('error', function(err){
    console.log(err)
})



function getTweetObject(tweet) {
    let tweetText = (tweet.extended_tweet) ? tweet.extended_tweet.full_text : tweet.text;

    // check for retweets
    if (tweet.text.includes('RT @') && tweet.retweeted_status) {
        tweetText = (tweet.retweeted_status.extended_tweet) ? tweet.retweeted_status.extended_tweet.full_text : tweet.retweeted_status.text;
    }

    let TweetObject = {
        text: tweetText,
        user: tweet.user.name,
        location: (tweet.user.location !== null) ? tweet.user.location : '',
        followers: tweet.user.followers_count,
        userImage: tweet.user.profile_image_url,
        timestamp: tweet.timestamp_ms,
    };

    return TweetObject;
}


let isStreamStopped = false;
