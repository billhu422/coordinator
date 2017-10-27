const router = require('koa-router')()
const mysql = require('mysql')
const request = require('request')
var config = require("../config");
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

asyncQuery= async (client)=>{
    let bd = await new Promise(function(resolve, reject) {
        client.query('select PRODUCT_ORDER.ID,PRODUCT_ORDER.STATE_,NOTE.TEXT from PRODUCT_ORDER,NOTE WHERE PRODUCT_ORDER.ID = NOTE.NOTE_PRODUCT_ORDER_ID and PRODUCT_ORDER.STATE_=\'InProgress\' and NOTE.TEXT =  \'unpaid\'',
        function(err,  results, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
    return bd;
}

asyncUpdate= async (client,order_id,note_text)=>{
    let bd = await new Promise(function(resolve, reject) {
        client.query('update NOTE set TEXT=' + '\''+note_text+'\'' + 'where NOTE.NOTE_PRODUCT_ORDER_ID=' + order_id +';',
        function(err,  results, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
    return bd;
}

asyncRequest= async (opts)=>{
    let bd = await new Promise(function(resolve, reject) {
        request(opts, function(err,r, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    return bd;
}

router.post('/whip',async(ctx,next) =>{
    //ctx.body = 'I am whipping :)'
    //1.read from mysql
    //2.update note to paying
    //3.update note to paied or ''
    //4.exit

    var TEST_DATABASE = 'DSPRODUCTORDERING';
    var TEST_TABLE = 'PRODUCT_ORDER';
    var client = mysql.createConnection({
        host:config.db.host,
        port:config.db.port,
        user:config.db.user,
        password: config.db.password,
    });
    client.connect();
    client.query("use " + TEST_DATABASE);
    var data = await asyncQuery(client)
    //read order & update note.text to Paid
    if(data.length == 0){
        //console.log('nothing');
        return;
    }else{
        for(var i = 0; i < data.length; i++) {
            console.log("%s--%s\t%s\t%s",new Date().toLocaleString(),data[i].ID,data[i].STATE_,data[i].TEXT);
            var x = await asyncUpdate(client,data[i].ID,'Paid');
        }
    }
    client.end();

    //fetch adminAccessToken
    var key = config.oauth.client_id + ':' + config.oauth.client_secret;
    var base64 = (new Buffer(key)).toString('base64');

    var opts_fechadminAccessToken = {
         method: "POST",
         url: config.oauth.account_server + '/oauth2/token',
         headers: {
            'Authorization' : 'Basic ' + base64,
            'Content-Type' : 'application/x-www-form-urlencoded'
         },
         form: {'grant_type':config.oauth.grant_type,'username':config.oauth.username,'password':config.oauth.password}
    }
    var tokenData = await asyncRequest(opts_fechadminAccessToken)
    var adminAccessToken = JSON.parse(tokenData).access_token
    //console.log(adminAccessToken)

    //delivery cvm
    for (var j = 0; j < data.length; j++){
        var opts_deliverycvm = {
            method: "POST",
            headers: {'content-type' : 'application/x-www-form-urlencoded','Authorization':'Bearer '+ adminAccessToken},
            url:     config.delivery.service_endpoint,
            form:    {'orderId':data[j].ID}
        }
        //console.log(opts_deliverycvm)
        cvmdata = await asyncRequest(opts_deliverycvm)
        console.log("%s--%s",new Date().toLocaleString(),cvmdata);
    }
})

module.exports = router
