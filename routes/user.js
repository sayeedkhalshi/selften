const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

const {getUserById, profileUpdate, gerAllAdmins, userById, read, update, purchaseHistory, getMessagesByUser, getMessagesByPair, sendMessagesByPair, getUnseenMessagesByReceiver } = require('../controllers/user');

router.get('/secret', requireSignin, (req, res) => {
    res.json({
        user: 'got here yay'
    });
});

router.get('/user/profile/:userId', requireSignin, isAuth, getUserById);
router.get('/user/admins/:userId', requireSignin, isAuth, isAdmin, gerAllAdmins);
router.get('/user/:userId', requireSignin, isAuth, read);
router.put('/user/:userId', requireSignin, isAuth, update);
router.post('/user/update/:userId', requireSignin, isAuth, profileUpdate)
router.get('/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory);
router.get('/user/messages/:userId', requireSignin, isAuth, getMessagesByUser);
router.post('/user/get-unseen-messages/receiver/:userId',requireSignin, isAuth, getUnseenMessagesByReceiver);
router.get('/user/:userId/message-pair/:pairId', requireSignin, isAuth, getMessagesByPair);
router.post('/user/:userId/message/:receiverId/pair/:pairId', requireSignin, isAuth, sendMessagesByPair);

router.param('userId', userById);

module.exports = router;
