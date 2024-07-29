const express = require('express');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello lop it!');
});
app.get('/post', (req, res) => {
  res.send('Return posts successfully');
});

app.post('/post', (req, res) => {
  const { title, content, author } = req.body;
  const data = {
    data: {
      title,
      content,
      author
    },
    message: 'Post created successfully'
  };
  res.json(data);
});

app.put('/post/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;
  const data = {
    data: {
      title,
      content,
      author
    },
    message: `Post update ${id} successfully`
  };
  res.json(data);
});

app.patch('/post/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;
  const data = {
    data: {
      title,
      content,
      author
    },
    message: `Post update ${id} successfully`
  };
  res.json(data);
});

app.delete('/post/:id', (req, res) => {
  const { id } = req.params;
  res.send(`Delete post successfully ${id}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
