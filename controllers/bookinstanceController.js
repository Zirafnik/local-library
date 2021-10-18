var BookInstance = require('../models/bookinstance');

// Display list of all BookInstances.
bookinstance_list = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance list');
};

// Display detail page for a specific BookInstance.
bookinstance_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance detail: ' + req.params.id);
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