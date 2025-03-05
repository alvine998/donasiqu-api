const { middlewareHere } = require('../middleware/index.js');

module.exports = (app) => {
    const cUser = require('../controllers/user.js');
    const cBanner = require('../controllers/banner.js');

    app.get('/users', middlewareHere, cUser.list);
    app.post('/users', middlewareHere, cUser.create);
    app.patch('/users', middlewareHere, cUser.update);
    app.delete('/users', middlewareHere, cUser.delete);
    app.post('/users/login', middlewareHere, cUser.login);
    app.post('/users/login/goole', middlewareHere, cUser.loginbygoogle);

    app.get('/banners', middlewareHere, cBanner.list);
    app.post('/banners', middlewareHere, cBanner.create);
    app.patch('/banners', middlewareHere, cBanner.update);
    app.delete('/banners', middlewareHere, cBanner.delete);
}