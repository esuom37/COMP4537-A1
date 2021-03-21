const express = require('express');
const app = express();
const { json } = require('body-parser');

// mysql://bed5cae79672fc:1c4d1336@us-cdbr-east-03.cleardb.com/heroku_386417eb1891288?reconnect=true

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'us-cdbr-east-03.cleardb.com',
      user : 'bed5cae79672fc',
      password : '1c4d1336',
      database : 'heroku_386417eb1891288'
    }
});

async function setupDb() {
    await knex.schema.createTable('questions', function(table) {
        table.increments('id').primary();
        table.string('text');
    }).catch(e => { if (e.errno != 1050) console.log(e)});

    await knex.schema.createTable('options', function(table) {
        table.increments('id').primary();
        table.integer('question_id').unsigned();
        table.string('text');
        table.boolean('is_correct');

        table.foreign('question_id').references('id').inTable('questions');
    }).catch(e => { if (e.errno != 1050) console.log(e)});
}

setupDb();
app.use(json());

app.get('/questions', async (req, res) => {
    let questions = await knex('questions').select('*');
    let response = []
    for (q of questions) {
        let options = await knex('options').where({question_id: q.id}).select('*');
        response.push({text: q.text, id: q.id, answers: options});
    }
    res.send(response, 200);
});

app.post('/questions', async (req, res) => {
    const question = req.body;
    const q_id = await knex('questions').insert({text: question.text}).returning('id');

    const options = question.answers.map((a) => {
        console.log(a);
        return { question_id: q_id, text: a.text, is_correct: a.is_correct }
    });

    await knex('options').insert(options);
    res.send("OK", 200);
});

app.put('/questions', async (req, res) => {
    let question = req.body;
    await knex('questions').where({ id: question.id }).update({text: question.text});
    await knex('options').where({ question_id: question.id }).del();
    await knex('options').insert(question.answers);
    res.send("OK", 200);
});

app.use(express.static('public'));
app.use("*", express.static('./public/404.html'));

app.listen(3000);
