let Book = require('../models/book');
let Author = require('../models/author');
let Genre = require('../models/genre');
let BookInstance = require('../models/bookinstance');

index = function(req, res, next) {
    let bookCount = Book.countDocuments({});
    let authorCount = Author.countDocuments({});
    let genreCount = Genre.countDocuments({});
    let bookInstanceCount = BookInstance.countDocuments({});
    let bookInstanceAvailableCount = BookInstance.countDocuments({status: "Available"});

    let counts = Promise.all([bookCount, authorCount, genreCount, bookInstanceCount, bookInstanceAvailableCount]);
    counts
        .then(results => {
            res.render('index', {title: 'Local Library Home', data: results});
        })
        .catch(err => {
            console.error(err);
            res.send('There was an error');
        });
};

// Display list of all books.
book_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Book list');
};

// Display detail page for a specific book.
book_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

// Display book create form on GET.
book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

// Display book delete form on GET.
book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};

module.exports = {
    index,
    book_list,
    book_detail,
    book_create_get,
    book_create_post,
    book_delete_get,
    book_delete_post,
    book_update_get,
    book_update_post
}