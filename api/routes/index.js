const { middlewareHere } = require('../middleware/index.js');

module.exports = (app) => {
    const cUser = require('../controllers/user.js');
    const cBanner = require('../controllers/banner.js');
    const cMailer = require('../controllers/mailer.js');
    const cCategory = require('../controllers/category.js');
    const cCampaign = require('../controllers/campaign.js');

    app.get('/users', middlewareHere, cUser.list);
    app.post('/users', middlewareHere, cUser.create);
    app.patch('/users', middlewareHere, cUser.update);
    app.delete('/users', middlewareHere, cUser.delete);
    app.post('/users/login', middlewareHere, cUser.login);
    app.post('/users/login/goole', middlewareHere, cUser.loginbygoogle);
    app.post('/users/verification/otp', middlewareHere, cUser.verificationOTP);

    app.get('/banners', middlewareHere, cBanner.list);
    app.post('/banners', middlewareHere, cBanner.create);
    app.patch('/banners', middlewareHere, cBanner.update);
    app.delete('/banners', middlewareHere, cBanner.delete);

    app.get('/categories', middlewareHere, cCategory.list);
    app.post('/categories', middlewareHere, cCategory.create);
    app.patch('/categories', middlewareHere, cCategory.update);
    app.delete('/categories', middlewareHere, cCategory.delete);

    app.get('/campaigns', middlewareHere, cCampaign.list);
    app.post('/campaigns', middlewareHere, cCampaign.create);
    app.patch('/campaigns', middlewareHere, cCampaign.update);
    app.delete('/campaigns', middlewareHere, cCampaign.delete);

    app.post('/sendmail', middlewareHere, cMailer.sendEmail);
}