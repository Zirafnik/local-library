let Author = require('../models/author');
let Book = require('../models/book');

// Display list of all Authors.
let author_list = function(req, res, next) {
    Author.find()
    .sort({family_name: 'asc'})
    .then(list => {
        res.render('author_list', {title: 'Author List', author_list: list});
    })
    .catch(err => {
        return next(err);
    })   
};

// Display detail page for a specific Author.
let author_detail = async function(req, res, next) {
    try{
        let authorProm = Author.findById(req.params.id);
        let bookProm = Book.find({author: req.params.id}, 'title summary');

        let [author, books] = await Promise.all([authorProm, bookProm]);

        if(author === null) {
            let err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        
        res.render('author_detail', {title: 'Author Detail', author, author_books: books});
    }
    catch(err) {
        return next(err);
    }
};

// Display Author create form on GET.
author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
author_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET.
author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};

module.exports = {
    author_list,
    author_detail,
    author_create_get,
    author_create_post,
    author_delete_get,
    author_delete_post,
    author_update_get,
    author_update_post
}
