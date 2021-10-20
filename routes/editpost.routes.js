const router = require('express').Router();

const { Post } = require('../db/models');
/// отобразить для редактирования
router.get('/:id', async(req, res)=>{
  try{
    const{id}= req.params
    const post = await Post.findByPk(id)
    res.json(post)
    console.log(post);
  }catch(err){
    console.log(err);
  }
})

module.exports = router;

router.put('/:id', async (req, res)=>{
  console.log('-----------',req.body);
  try{
      const {id, title, text, picture} = req.body
      const post = await Post.update({
        title, 
        text, 
        picture,
      },
        {where: {id},
      })
      return res.status(201).json({ link: '/' })
      // return res.status(200).json(post);
  }catch(err){
      console.log(err);
  }
})
