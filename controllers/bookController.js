const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

const {body, validationResult} = require('express-validator');

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
let book_create_get = async function(req, res, next) {
    // Get all available authors and genres
    let authors = Author.find({});
    let genres = Genre.find({});

    let results = await Promise.all([authors, genres])
        .catch(err => next(err));

    res.render('book_form', {title: 'Create Book', authors: results[0], genres: results[1]});
};

// Handle book create on POST.
let book_create_post = [
    // turn genres into arr, if not arr already
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)) {
            if(!req.body.genre) {
                req.body.genre = [];
            } else {
                req.body.genre = [req.body.genre];
            }
        }
        
        next();
    },
    
    // Validation and sanitization
    body('title', 'Title must not be empty.').trim().isLength({min: 1}).escape(),
    body('author', 'Author must not be empty.').trim().isLength({min: 1}).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({min: 1}).escape(),
    body('isbn', 'ISBN must not be empty.').trim().isLength({min: 1}).escape(),
    body('genre.*').escape(),
    
    // Process request
    async (req, res, next) => {
        const errors = validationResult(req);
        
        //errors present
        if(!errors.isEmpty()) {
            //again get all authors and genres to re-render the form
            let authors = Author.find({});
            let genres = Genre.find({});
            
            let results = await Promise.all([authors, genres])
            .catch(err => next(err));

            //mark selected genres as checked
            for(let i = 0; i < results[1].length; i++) {
                if(req.body.genre.indexOf(results[1][i]._id) > -1) {
                    results[1][i].checked = 'true';
                }
            }
            
            res.render('book_form', {title: 'Create Book', authors: results[0], genres: results[1], book: req.body, errors: errors.array()});
            return;
        } 
        //no errors
        else {
            //create book
            let book = new Book({
                title: req.body.title,
                author: req.body.author,
                summary: req.body.summary,
                isbn: req.body.isbn,
                genre: req.body.genre
            });

            book.save()
                .then(val => {
                    //book successfully saved -> redirect to detail page
                    res.redirect(book.url);
                })
                .catch(err => next(err));
        }
    }
];

// Display book delete form on GET.
book_delete_get = function(req, res) {
};

// Handle book delete on POST.
book_delete_post = function(req, res) {
};

// Display book update form on GET.
let book_update_get = async function(req, res, next) {
    let [book, authors, genres] = await Promise.all([
        Book.findById(req.params.id).populate('author').populate('genre'),
        Author.find(),
        Genre.find()
    ]).catch(err => next(err));

    if(book === null) {
        let err = new Error('Book not found');
        err.status = 404;
        return next(err);
    }

    // Success
    // Mark selected genres
    for(let i = 0; i < genres.length; i++) {
        for(let j = 0; j < book.genre.length; j++) {
            if(genres[i]._id.toString() === book.genre[j]._id.toString()) {
                genres[i].checked = 'true';
            }
        }
    }

    res.render('book_form', {title: 'Update Book', authors, genres, book});
};

// Handle book update on POST.
let book_update_post = [
    //SAME AS CREATE POST (almost)
    //turn genres into arr
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)) {
            if(!req.body.genre) {
                req.body.genre = [];
            } else {
                req.body.genre = [req.body.genre];
            }
        }
        next();
    },

    // Validate and sanitize
    body('title', 'Title must not be empty.').trim().isLength({min: 1}).escape(),
    body('author', 'Author must not be empty.').trim().isLength({min: 1}).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({min: 1}).escape(),
    body('isbn', 'ISBN must not be empty.').trim().isLength({min: 1}).escape(),
    body('genre.*').escape(),

    // Process request
    async (req, res, next) => {
        const errors = validationResult(req);

        //errors present
        if(!errors.isEmpty()) {
            //again get all authors and genres to re-render the form
            let authors = Author.find({});
            let genres = Genre.find({});
            
            let results = await Promise.all([authors, genres])
            .catch(err => next(err));

            //mark selected genres as checked
            for(let i = 0; i < results[1].length; i++) {
                if(req.body.genre.indexOf(results[1][i]._id) > -1) {
                    results[1][i].checked = 'true';
                }
            }
            
            res.render('book_form', {title: 'Update Book', authors: results[0], genres: results[1], book: req.body, errors: errors.array()});
            return;
        } 
        //no errors
        else {
            //create book
            let book = new Book({
                title: req.body.title,
                author: req.body.author,
                summary: req.body.summary,
                isbn: req.body.isbn,
                genre: req.body.genre,
                _id: req.params.id //This is required, or a new ID will be assigned!
            });

            Book.findByIdAndUpdate(req.params.id, book, {})
                .then(thebook => {
                    res.redirect(thebook.url);
                })
                .catch(err => next(err));
        }
    }
];

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