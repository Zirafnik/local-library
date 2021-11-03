let BookInstance = require('../models/bookinstance');

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
bookinstance_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// Handle BookInstance create on POST.
bookinstance_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create POST');
};

// Display BookInstance delete form on GET.
bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
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