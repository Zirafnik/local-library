let Genre = require('../models/genre');
let Book = require('../models/book');

const {body, validationResult} = require('express-validator');

// Display list of all Genre.
let genre_list = function(req, res, next) {
    Genre.find()
    .sort({name: 'asc'})
    .then(list => {
        res.render('genre_list', {title: 'Genre List', genre_list: list});
    })
    .catch(err => next(err));
};

// Display detail page for a specific Genre.
let genre_detail = async function(req, res, next) {
    let genre = await Genre.findOne({name: req.params.id});
    if(genre === null) {
        let err = new Error('Genre not found');
        err.status = 404;
        return next(err);
    }

    let genreBooks = Book.find({genre: genre._id});
    
    genreBooks
        .then(books => {
            res.render('genre_detail', {title: 'Genre Detail', genre, genre_books: books});
        })
        .catch(err => {
            next(err);
        });
};

// Display Genre create form on GET.
let genre_create_get = function(req, res, next) {
    res.render('genre_form', {title: 'Create Genre'});
};

// Handle Genre create on POST.
let genre_create_post = [
    //Validate and sanitize name field
    body('name', 'Genre name required').trim().isLength({min: 1}).escape(),

    //Process request
    (req, res, next) => {
        //Extract validaton errors
        const errors = validationResult(req);

        //create genre obj
        let genre = new Genre({name: req.body.name});

        if(!errors.isEmpty()) {
            //Render form again with sanitizied values/errors
            res.render('genre_form', {title: 'Create Genre', genre: genre, errors: errors.array()});
            return;
        }

        // Data from form is valid
        // Check if genre already exists
        Genre.findOne({name: req.body.name})
            .then(foundGenre => {
                if(foundGenre) {
                    res.redirect(foundGenre.url);
                } else {
                    genre.save()
                    .then(savedGenre => {
                            //genre saved
                            res.redirect(genre.url);
                    })
                }
            })
            .catch(err => next(err));
    }
];

// Display Genre delete form on GET.
genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};


module.exports = {
    genre_list,
    genre_detail,
    genre_create_get,
    genre_create_post,
    genre_delete_get,
    genre_delete_post,
    genre_update_get,
    genre_update_post
}