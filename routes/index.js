var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/recipe/:id', function(req, res, next) {
//   res.render('recipeindex', { title: 'Express' });
// });

module.exports = router;
