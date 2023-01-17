const express = require('express');
const {
    getAllStudios,
    getStudio,
    createStudio,
    updateStudio,
    deleteStudio,
    getStudioMinDetail,
    profileUpload,
    uploadStudioProfile,
    uploadStudioBackground,
    backgroundUpload,
    updateStudioCategory
} = require('../controllers/studiosControllers');
const requireAuth = require('../middlewares/requireAuth');


const router = express.Router();

router.route('/profile').patch( requireAuth,uploadStudioProfile, profileUpload );
router.route('/background').patch( requireAuth,uploadStudioBackground, backgroundUpload );


router.route('/')
.get(getAllStudios)
.post(createStudio);

router.route('/category/:id')
.patch(updateStudioCategory);


router.route('/:id')
.get(getStudio)
.patch(updateStudio)
.delete(deleteStudio);

router.route('/:id/details')
.get(getStudioMinDetail);

module.exports = router;