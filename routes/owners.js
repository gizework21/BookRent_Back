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

router.put('/updateOwner/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Expecting status to be passed in the request body
  
    try {
      // Update the owner's status
      const updatedOwner = await prisma.user.update({
        where: { id: parseInt(id, 10) },
        data: {
          status: status, // Update the owner's status based on the input
        },
        include: {
          books: true, // Optionally include related books
        },
      });
  
      res.json(updatedOwner);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.delete('/delete-user/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Delete the user by ID
      const deletedUser = await prisma.user.delete({
        where: { id: parseInt(id, 10) },
      });
  
      res.json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
      console.error(error);
  
      // Check if the error is due to the user not being found
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  });
  

module.exports = router;
