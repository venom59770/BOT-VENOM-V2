const google = require("./google.js");

fun = {
    replyToMessageWith: function(replyMessage, message) {
        message.reply(replyMessage);
    }
}
exports.googleSearch = function(searchQuery, message) {

    google.resultsPerPage = 3
    var counter = 0
    google(searchQuery, function(err, res) {
        if (err)
            console.error(err)
        var link = res.links[counter];
        console.log(link.title);
        console.log(link.href);
        fun.replyToMessageWith(link.title + ' - ' + link.href, message);
        // Uncoment this line if you want the description of the web page
        //  fun.replyToMessageWith(link.description + "\n",message);
        counter += 1
        if (counter <= 2) {
            // run the function again aka do the search again
            res.next()
        } else {
            // else if counter if greater than 2 return. I dont want more google results
            return;
        }

    });

}