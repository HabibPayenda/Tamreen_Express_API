const express = require('express');
const requireAuth = require('../middlewares/requireAuth');

const {
    createUser,
    getAllUsers,
    updateUser, 
    deleteUser,
    getUser,
    getCurrentUser,
    uploadUserPhoto,
    photoUpload,
    updateCurrentUser,
    updateCurrentLocation, 
    followStudio,
    getFollowedStudios,
    getFollowedStudiosDetails,
    updateCurrentUserSavedPost
    } = require('../controllers/userControllers');

    const router = express.Router();

   





router.route('/')
.get(getAllUsers)
.post(createUser);

router.route('/me')
.get(requireAuth, getCurrentUser)
.patch(requireAuth, updateCurrentUser);

router.route('/savepost/:id')
.patch(updateCurrentUserSavedPost)

router.route('/location')
.patch(requireAuth, updateCurrentLocation);

router.route('/photo')
.patch( requireAuth,uploadUserPhoto, photoUpload );

router.route('/followStudio/:id')
.get(getFollowedStudios)
.patch(followStudio);

router.route('/getFollowedStudios')
.post(getFollowedStudiosDetails);

router.route('/:id')
.get(getUser)
.delete(deleteUser)
.patch(updateUser);



module.exports = router;