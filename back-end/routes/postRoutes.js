import express from 'express';  

const router = express.Router();


router.get('/', (req, res) => {
    res.send('Post route base path is working!');

  });



export default router;
