const Twit = require('twit');
const keys = require('./keys');
let BBB = require('./participantes');
var fs = require('fs')
var emojiStrip = require('emoji-strip')
const http = require('http');
var T = new Twit(keys);

let writeStream = fs.createWriteStream("BBB.txt")
let stream = T.stream('statuses/filter', { track: ['#bbb','#bbb21','#redebbb', '#redebbb21'] });
console.log('getting...')

stream.on('tweet', function (tweet) {
    let TweetObject = getTweetObject(tweet);
    let text = TweetObject.text.toLowerCase();
    writeTxt(text);
    BBB.forEach(elem => {
        elem.queries.forEach(query => {
            if(text.includes(query)){
                elem.tweets++;
                return;
            }
        })
    })
});

function formatTweetResult(){
    BBB.sort((a, b) => {
        if(a.tweets > b.tweets)
            return -1;
        else return 1;
    })
    let BaseTextTweet = ""
    BBB.forEach(elem => {
        BaseTextTweet =BaseTextTweet + elem.nome + ": " + elem.tweets + "\n";
    })
    return BaseTextTweet;
}

setTimeout(() => {
    stream.stop();
    console.log('foi de berço');
    console.log(formatTweetResult());
    fs.writeFile("BBB.json", JSON.stringify(BBB), function(err, result) {
        if(err) console.log('error', err);
    })
    writeStream.end()
    http.get({
        hostname: 'localhost',
        port: 5000,
        path: '/createCloud'
    }, (res) => {
        console.log(res.statusCode)
        console.log("sent to cloud maker")
    })
}, 1000 * 60 * 50)

stream.on('error', function(err){
    console.log(err)
})


function writeTxt(text){
    text = text.replace("#bbb ", "")
    text = text.replace("#redebbb ", "")
    text = text.replace("#redebbb21 ", "")
    text = text.replace(/(https?:\/\/(www.)?[-a-zA-Z0-9@:%.+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&//=]*))/g, "")
    text = emojiStrip(text)
    writeStream.write(text + " ")
}



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
