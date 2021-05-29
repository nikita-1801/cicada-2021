const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
require('dotenv').config()

mongoose.connect(
  `mongodb+srv://admin-deva:${process.env.PASSWORD}@cluster0.uu6ve.mongodb.net/PostsData?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
)

const postSchema = {
  title: String,
  content: String,
  name: String,
  mobile: String,
}

const Post = mongoose.model('Post', postSchema)

app.get('/', function (req, res) {
  Post.find({}, function (err, posts) {
    res.render('home')
  })
})
app.get('/blog', function (req, res) {
  Post.find({}, function (err, posts) {
    res.render('blog')
  })
})
app.get('/requests', function (req, res) {
  Post.find({}, function (err, posts) {
    res.render('request', {
      posts: posts,
    })
  })
})
app.get('/quiz', function (req, res) {
  Post.find({}, function (err) {
    res.render('quiz')
  })
})

app.get('/compose', function (req, res) {
  res.render('compose')
})

app.post('/compose', function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    name: req.body.postName,
    mobile: req.body.postMobile,
  })

  post.save(function (err) {
    if (!err) {
      res.redirect('/requests')
    }
  })
})

app.get('/posts/:postId', function (req, res) {
  const requestedPostId = req.params.postId

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render('post', {
      title: post.title,
      content: post.content,
      name: post.name,
      mobile: post.mobile,
    })
  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Server started on port 3000')
})
