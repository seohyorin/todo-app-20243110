require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB 연결 성공');
  } catch (err) {
    console.error('MongoDB 연결 실패:', err);
    throw err;
  }
}

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);

app.get('/api/todos', async (req, res) => {
  try {
    await connectDB();
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '조회 실패' });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    await connectDB();
    const newTodo = new Todo({ title: req.body.title });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '추가 실패' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    await connectDB();

    const updateData = {};

    if (req.body.completed !== undefined) {
      updateData.completed = req.body.completed;
    }

    if (req.body.title !== undefined) {
      updateData.title = req.body.title;
    }

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '수정 실패' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    await connectDB();
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: '삭제 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '삭제 실패' });
  }
});

module.exports = app;