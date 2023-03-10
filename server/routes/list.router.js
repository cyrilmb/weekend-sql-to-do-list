const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

//PUT to edit task
router.put('/edit/:id', (req, res) => {
  const queryText = `
    UPDATE "list"
    SET task=$2,deadline=$3
    WHERE id=$1;
    `;
  const queryParams = [req.params.id, req.body.task, req.body.deadline];
  console.log('put edit queryParams', req.body);
  pool
    .query(queryText, queryParams)
    .then((dbRes) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log('PUT /list/edit/:id failed', err);
      res.sendStatus(500);
    });
});

//PUT to mark complete
router.put('/:id', (req, res) => {
  const queryText = `
  UPDATE "list" 
  SET "complete"=$1, "comptime"=$2
  WHERE id=$3;
  `;
  const queryParams = [req.body.complete, req.body.comptime, req.params.id];
  pool
    .query(queryText, queryParams)
    .then((dbRes) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('PUT complete error', error);
      res.sendStatus(500);
    });
});

// DELETE
router.delete('/:id', (req, res) => {
  const queryText = `
    DELETE FROM "list"
    WHERE "id"=$1`;

  const queryParams = [req.params.id];

  pool
    .query(queryText, queryParams)
    .then((dbRes) => {
      res.sendStatus(204);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

//GET table from server
router.get('/', (req, res) => {
  console.log('in /list GET');

  const queryText = `SELECT * from "list" ORDER by deadline ASC;`;

  pool
    .query(queryText)
    .then((results) => {
      res.send(results.rows);
    })
    .catch((err) => {
      console.log('Error in /list GET', err);
      res.sendStatus(500);
    });
});

//POST
router.post('/', (req, res) => {
  console.log('in /list POST:', req.body);

  const queryText = `
    INSERT INTO list ("task", "deadline", "complete", "comptime") 
    VALUES ($1, $2, $3, $4);
  `;
  const queryParams = [
    req.body.task,
    req.body.deadline,
    req.body.complete,
    req.body.comptime,
  ];

  pool
    .query(queryText, queryParams)
    .then((results) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('ERROR in INSERT', err);
      res.sendStatus(500);
    });
});

module.exports = router;
