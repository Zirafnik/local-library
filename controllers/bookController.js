let Book = require('../models/book');
let Author = require('../models/author');
let Genre = require('../models/genre');
let BookInstance = require('../models/bookinstance');

let index = function(req, res, next) {
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
            console.error('This is the error: ' + err);
            res.render('error');
        });
};

// Display list of all books.
let book_list = function(req, res, next) {
    Book.find({}, 'title author', {sort: {title: 1}})
        .populate('author')
        .then(list => res.render('book_list', {title: 'Book List', book_list: list}))
        .catch(err => next(err));
};

// Display detail page for a specific book.
let book_detail = async function(req, res, next) {
    try{
        let bookPromise = Book.findById(req.params.id)
        .populate('author')
        .populate('genre')

        let bookInstancesPromise = BookInstance.find({book: req.params.id})
        
        let [book, bookInstances] = await Promise.all([bookPromise, bookInstancesPromise]);

        if(book === null) {
            let err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }

        res.render('book_detail', {title: book.title, book, book_instances: bookInstances});
    }
    catch(err) {
        next(err);
    }
};

// Display book create form on GET.
book_create_get = function(req, res) {
};

// Handle book create on POST.
book_create_post = function(req, res) {
};

// Display book delete form on GET.
book_delete_get = function(req, res) {
};

// Handle book delete on POST.
book_delete_post = function(req, res) {
};

// Display book update form on GET.
book_update_get = function(req, res) {
};

// Handle book update on POST.
book_update_post = function(req, res) {
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