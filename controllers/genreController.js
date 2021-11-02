let Genre = require('../models/genre');
let Book = require('../models/book');

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
    let genre = await Genre.find({name: req.params.id});
    if(genre === null) {
        let err = new Error('Genre not found');
        err.status = 404;
        return next(err);
    }

    let genreBooks = Book.find({genre: genre[0]._id});
    
    genreBooks
        .then(books => {
            res.render('genre_detail', {title: 'Genre Detail', genre, genre_books: books});
        })
        .catch(err => {
            next(err);
        });
};

// Display Genre create form on GET.
genre_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre create GET');
};

// Handle Genre create on POST.
genre_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre create POST');
};

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