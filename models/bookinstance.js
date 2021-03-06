let mongoose = require('mongoose');
let {DateTime} = require('luxon');

let Schema = mongoose.Schema;

let BookInstanceSchema = new Schema({
    book: {type: Schema.Types.ObjectId, ref: 'Book', required: true},
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
});

// Virtual for bookinstance's URL
BookInstanceSchema
.virtual('url')
.get(function() {
    return '/catalog/bookinstance/' + this._id;
});

// Virtual for formatted dates
BookInstanceSchema
.virtual('due_back_formatted')
.get(function() {
    return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

BookInstanceSchema.virtual('due_back_form').get(function(){
    if(this.due_back){
      return this.due_back.toISOString().split('T')[0];
    }
});

module.exports = mongoose.model('BookInstance', BookInstanceSchema);