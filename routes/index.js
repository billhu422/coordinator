const router = require('koa-router')()
var mysql = require('mysql');
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.post('/delivery',async(ctx,next) =>{
    ctx.body = 'I am delivering :)'
    //1.read from mysql
    //2.update note to paying
    //3.update note to paied or ''
    //4.exit


  var TEST_DATABASE = 'DSPRODUCTORDERING';
  var TEST_TABLE = 'PRODUCT_ORDER';
  var client = mysql.createConnection({
      host:'124.251.62.215',
      port:'3306',
    user: 'root',
    password: 'my-secret-pw',

  });
  client.connect();
  client.query("use " + TEST_DATABASE);
  client.query(
  'select PRODUCT_ORDER.ID,PRODUCT_ORDER.STATE_,NOTE.TEXT from PRODUCT_ORDER,NOTE WHERE PRODUCT_ORDER.ID = NOTE.NOTE_PRODUCT_ORDER_ID;',
  function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
       if(results)
      {
          for(var i = 0; i < results.length; i++)
          {
              if(results[i].STATE_ == 'Acknowledged' && results[i].TEXT != 'Paid') {
                  console.log("%s\t%s\t%s", results[i].ID, results[i].STATE_, results[i].TEXT);
              }
          }
      }
    client.end();
  }
);
})

module.exports = router
