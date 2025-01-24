const { middlewareHere } = require('../middleware/index.js');

module.exports = (app) => {
    const cUser = require('../controllers/user.js');
    const cCategories = require('../controllers/category.js');
    const cAds = require('../controllers/ads.js');
    const cNews = require('../controllers/news.js');

    app.get('/users', middlewareHere, cUser.list);
    app.post('/users', middlewareHere, cUser.create);
    app.patch('/users', middlewareHere, cUser.update);
    app.delete('/users', middlewareHere, cUser.delete);
    app.post('/users/login/goole', middlewareHere, cUser.loginbygoogle);

    app.get('/categories', middlewareHere, cCategories.list);
    app.post('/categories', middlewareHere, cCategories.create);
    app.patch('/categories', middlewareHere, cCategories.update);
    app.delete('/categories', middlewareHere, cCategories.delete);

    app.get('/ads', middlewareHere, cAds.list);
    app.post('/ads', middlewareHere, cAds.create);
    app.patch('/ads', middlewareHere, cAds.update);
    app.delete('/ads', middlewareHere, cAds.delete);

    app.get('/news', middlewareHere, cNews.list);
    app.post('/news', middlewareHere, cNews.create);
    app.patch('/news', middlewareHere, cNews.update);
    app.delete('/news', middlewareHere, cNews.delete);
}