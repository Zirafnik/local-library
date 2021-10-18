let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let GenreSchema = new Schema({
    name: {type: String, required: true, minLength: 3, maxLength: 100}
});

// Virtual for genre URL
GenreSchema
.virtual('url')
.get(function() {
    return '/catalog/genre/' + this.name;
});

module.exports = mongoose.model('Genre', GenreSchema);