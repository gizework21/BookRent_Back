const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/owners-with-books
router.get('/', async (req, res) => {
  try {
    const ownersWithBooks = await prisma.user.findMany({
      where: {
        role: "owner",
        books: {
          some: {}, // Ensure the user has posted at least one book
        },
      },
      include: {
        books: true, // Include the books related to the owner
      },
    });
    
    res.json(ownersWithBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
