/**
 * Created by bface007 on 30/04/2017.
 */
const homeController = require('../controllers/home');

module.exports = (app, express) => {
  let router = express.Router();
  
  router.get('/', homeController.index);
  
  return router;
};