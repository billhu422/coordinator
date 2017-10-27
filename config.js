var config = {}
config.db = {
    host:'124.251.62.215',
    port:'3306',
    user: 'root',
    password: 'my-secret-pw',
}

config.oauth = {
    account_server: 'http://124.251.62.217:8000',
    client_id: '9c9bca6d26234ff98fb93df3e3d065c5',
    client_secret: 'e1396a545ace426a941c0edfd3403d0f',
    grant_type : 'password',
    username : 'laoguo.cn@gmail.com',
    password: '12345',
};

config.delivery = {
    service_endpoint:'http://124.251.62.216:3002/v1/hybrid/qcloud/cvm',
}

module.exports = config;