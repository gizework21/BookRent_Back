const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Add a new book
router.post('/', authMiddleware, async (req, res) => {
  const { title, author, description } = req.body;
  try {
    const book = await prisma.book.create({
      data: { title, author, description }
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: 'Error creating book' });
  }
});

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// Get a book by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching book' });
  }
});

// Update a book
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, author, description, available } = req.body;
  try {
    const book = await prisma.book.update({
      where: { id: parseInt(id) },
      data: { title, author, description, available }
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: 'Error updating book' });
  }
});

// Delete a book
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.book.delete({ where: { id: parseInt(id) } });
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: 'Error deleting book' });
  }
});

module.exports = router;
