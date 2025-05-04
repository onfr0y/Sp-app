import express from 'express';  

const router = express.Router();

router.get('/', (req, res) => {
    res.send('user route base path is working!');

  });
export default router;