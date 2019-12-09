const express = require('express');

// database access using knex
const knex = require('../data/db-config.js');

const router = express.Router();

// return a list of posts from the database
router.get('/', (req, res) => {
    // select * from posts
    knex
        .select('*')
        .from('posts')
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'error getting the posts' })
        })
});

router.get('/:id', (req, res) => {
    knex
        .select('*')
        .from('posts')
        .where({ id: req.params.id })
        .first()
        .then(post => {
            res.status(200).json(post)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'error getting the post' })
        })
});

router.post('/', (req, res) => {
    // validate req.body before calling the dB
    const postData = req.body;
    knex('posts')
        .insert(postData, 'id')
        .then(ids => {
            const id = ids[0];
            return knex('posts')
                .select('id', 'title', 'contents')
                .where({ id })
                .then(post => {
                    res.status(201).json(post)
                });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'error adding the post' })
        })

});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    knex('posts')
        .where({ id })
        .update(changes)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: `${count} record(s) updated` })
            } else {
                res.status(404).json({ message: 'record not found'})
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'error updating the post' })
        })
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    knex('posts')
        .where({ id })
        .del()
        .then(count => {
            res.status(200).json({ message: `${count} record(s) deleted` })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'error deleting the post' })
        })
});

module.exports = router;