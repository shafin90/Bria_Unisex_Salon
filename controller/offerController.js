const Offer = require("../model/offerSchema");
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary Config
cloudinary.config({
    cloud_name: 'drjlwkesp',
    api_key: '424161371495428',
    api_secret: 'QnfSUs909OsnbJWJbq2bmfIi61k'
});
// Set up Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'offers',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 } // 1MB limit
}).single('offerImg');

const offerController = {
    addOffer: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.json({ errorMessage: err });
            }
            try {
                const { offerName, startDate, endDate, usageLimit } = req.body;
                const offerImgUrl = req.file ? req.file.path : '';

                const newOffer = new Offer({
                    offerName,
                    offerImg: offerImgUrl,
                    startDate,
                    endDate,
                    usageLimit
                });

                const addedOffer = await newOffer.save();
                if (!addedOffer) {
                    return res.json({ errorMessage: "Something went wrong" });
                }
                res.json({ message: "Offer added", success: true });
            } catch (error) {
                res.json({ errorMessage: "Something went wrong", error });
            }
        });
    },

    getAllOffer: async (req, res) => {
        try {
            const allOffer = await Offer.find();
            res.json(allOffer);
        } catch (error) {
            res.json({ errorMessage: "Something went wrong", error });
        }
    },

    getAllActiveOffer: async (req, res) => {
        try {
            const allOffer = await Offer.find();
            const allActiveOffer = allOffer.filter(item => item.status === "Active");
            res.json(allActiveOffer);
        } catch (error) {
            res.json({ errorMessage: "Something went wrong", error });
        }
    },

    getAllInactiveOffer: async (req, res) => {
        try {
            const allOffer = await Offer.find();
            const allInactiveOffer = allOffer.filter(item => item.status === "Inactive");
            res.json(allInactiveOffer);
        } catch (error) {
            res.json({ errorMessage: "Something went wrong", error });
        }
    },

    getParticularOfferById: async (req, res) => {
        try {
            const { id } = req.params;
            const offerDetails = await Offer.findById(id);
            if (!offerDetails) {
                return res.json({ message: "Offer is missing" });
            }
            res.json(offerDetails);
        } catch (error) {
            res.json({ errorMessage: "Something went wrong", error });
        }
    },

    editOffer: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.json({ errorMessage: err });
            }
            try {
                const { id } = req.params;
                const { offerName, startDate, endDate, usageLimit, status } = req.body;
                const offerImgUrl = req.file ? req.file.path : '';

                const updatedFields = { offerName, startDate, endDate, usageLimit, status };
                if (offerImgUrl) updatedFields.offerImg = offerImgUrl;

                const editedOffer = await Offer.findByIdAndUpdate(id, updatedFields, { new: true });

                if (!editedOffer) {
                    return res.json({ message: "Something went wrong. Please try again" });
                }
                res.json({ message: "Edited", success: true });
            } catch (error) {
                res.json({ errorMessage: "Something went wrong", error });
            }
        });
    }
};

module.exports = offerController;
