const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');

const {body, validationResult} = require('express-validator');

// Display list of all BookInstances.
let bookinstance_list = function(req, res, next) {
    BookInstance.find()
    .populate('book')
    .then(list => {
        res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list});
    })
    .catch(err => {
        return next(err);
    })
};

// Display detail page for a specific BookInstance.
let bookinstance_detail = function(req, res, next) {
    BookInstance.findById(req.params.id)
        .populate('book')
        .then(bookinstance => {
            if(bookinstance === null) {
                let err = new Error('Book copy not found');
                err.status = 404;
                return next(err);
            }
            res.render('bookinstance_detail', {title: 'Copy: ' + bookinstance.book.title, bookinstance});
        })
        .catch(err => next(err));
};

// Display BookInstance create form on GET.
let bookinstance_create_get = function(req, res) {
    Book.find({}, 'title')
        .then(books => {
            res.render('bookinstance_form', {title: 'Create Bookinstance', book_list: books});
        })
        .catch(err => next(err));
};

// Handle BookInstance create on POST.
let bookinstance_create_post = [
    // Validate and sanitize
    body('book', 'Book must be specified').trim().isLength({min: 1}).escape(),
    body('imprint', 'Imprint must be specified').trim().isLength({min: 1}).escape(),
    body('status').escape(),
    body('due_back', 'Invalid date').optional({checkFalsy: true}).isISO8601().toDate(),

    // Process request
    (req, res, next) => {
        const errors = validationResult(req);

        //errors
        if(!errors.isEmpty()) {
            Book.find({}, 'title')
                .then(books => {
                    res.render('bookinstance_form', {title: 'Create Bookinstance', book_list: books, errors: errors.array(), bookinstance: req.body})
                })
                .catch(err => next(err));
            return;
        } else {
            let bookinstance = new BookInstance({
                book: req.body.book,
                imprint: req.body.imprint,
                status: req.body.status,
                due_back: req.body.due_back
            });

            bookinstance.save()
                .then(val => {
                    res.redirect(bookinstance.url);
                })
                .catch(err => next(err));
        }
    }
];

// Display BookInstance delete form on GET.
let bookinstance_delete_get = async function(req, res, next) {
    let bookinstance = await BookInstance.findById(req.params.id).populate('book').catch(err => next(err));

    //no match
    if(bookinstance === null) {
        res.redirect('/catalog/bookinstances');
    }

    res.render('bookinstance_delete', {title: 'Delete Copy', bookinstance});
};

// Handle BookInstance delete on POST.
let bookinstance_delete_post = function(req, res, next) {
    //assume valid id
    BookInstance.findByIdAndRemove(req.body.id)
        .then(val => {
            res.redirect('/catalog/bookinstances');
        })
        .catch(err => next(err));
};

// Display BookInstance update form on GET.
bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};

module.exports = {
    bookinstance_list,
    bookinstance_detail,
    bookinstance_create_get,
    bookinstance_create_post,
    bookinstance_delete_get,
    bookinstance_delete_post,
    bookinstance_update_get,
    bookinstance_update_post
}