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

app.get('/post/:id', (req, res) => {
  const id = req.params.id;
  res.send(
    `This is post with id: ${id}". Trong đó ${id} là id của bài post lấy từ url params`
  );
});

app.post('/post/:id', (req, res) => {
  res.send('Create new post successfully');
});

app.put('/post/:id', (req, res) => {
  res.send('Update  post successfully');
});

app.patch('/post/:id', (req, res) => {
  res.send('Update  post successfully');
});

app.delete('/post/:id', (req, res) => {
  res.send('Delete post successfully');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
