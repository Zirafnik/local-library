let Author = require('../models/author');
let Book = require('../models/book');

const {body, validationResult} = require('express-validator');

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
let author_create_get = function(req, res, next) {
    res.render('author_form', {title: 'Create Author'});
};

// Handle Author create on POST.
let author_create_post = [
    // Validation and sanitization
    body('first_name').trim().isLength({min: 1}).escape().withMessage('First name must be specified.').isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').trim().isLength({min: 1}).escape().withMessage('Family name must be specified.').isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).isISO8601().toDate(),

    // Process request
    (req, res, next) => {
        const errors = validationResult(req);

        // If there are errors
        if(!errors.isEmpty()) {
            res.render('author_form', {title: 'Create Author', author: req.body, errors: errors.array()});
            return;
        } else {
            let author = new Author({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            });

            author.save()
                .then(val => {
                    res.redirect(author.url);
                })
                .catch(err => next(err));
        }
    }
    
];

// Display Author delete form on GET.
let author_delete_get = async function(req, res) {
    let author = Author.findById(req.params.id);
    let author_books = Book.find({author: req.params.id});

    let results = await Promise.all([author, author_books]).catch(err => next(err));

    //no author found
    if(results[0] === null) {
        res.redirect('/catalog/authors');
    }

    res.render('author_delete', {title: 'Delete Author', author: results[0], author_books: results[1]});
};

// Handle Author delete on POST.
let author_delete_post = async function(req, res, next) {
    let [author, author_books] = await Promise.all([
        Author.findById(req.body.authorid),
        Book.find({author: req.body.authorid})
    ]).catch(err => next(err));

    //if author still has books tied to it -> render same as GET route
    if(author_books.length > 0) {
        res.render('author_delete', {title: 'Delete Author', author: author, author_books: author_books});
        return;
    }
    //author has no books
    else {
        //delete author and redirect to list of authors
        Author.findByIdAndRemove(req.body.authorid)
            .then(val => {
                res.redirect('/catalog/authors');
            })
            .catch(err => next(err));
    }
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
