const router = require('express').Router();

const { Post } = require('../db/models');

router.post('/add-post', async (req, res)=>{
  // console.log('-----------',req.body);
  try{
      const {title, text, picture} = req.body
      const post = await Post.create({
        title, text, picture,
      })
      return res.status(201).json({ link: '/' })
      // return res.status(200).json(post);
  }catch(err){
      console.log(err);
  }
})

router.get('/', async (req, res)=>{
  try{
    const posts = await Post.findAll()
    // console.log(posts);
    res.json(posts)
  }catch(err){
    console.log(err);
  }
})

router.get('/:id', async(req, res)=>{
  try{
    const{id}= req.params
    const post = await Post.findByPk(id)
    res.json(post)
    // console.log(post);
  }catch(err){
    console.log(err);
  }
})


router.delete('/remove', async(req, res)=>{
  try{
    const{id}= req.body
    await Post.destroy({ where: { id } });
    return res.status(201).json({ link: '/' })
  }catch(err){
    console.log(err);
  }
})

module.exports = router;
