const express = require('express');
const multer = require('multer');
const path = require('path');
const Service = require('../model/serviceSchema');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: 'drjlwkesp',
    api_key: '424161371495428',
    api_secret: 'QnfSUs909OsnbJWJbq2bmfIi61k'
});

// Set up multer for file storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'services', // Cloudinary folder where images will be stored
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional: Resize or transform images
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 } // 1MB file size limit
}).single('img');






const serviceController = {
    addService: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.json({ errorMessage: err });
            }
            try {
                const { serviceName, serviceDescription, price, category, serviceType } = req.body;
                console.log(1)
                console.log(1)
                const imgUrl = req.file ? req.file.path : '';

                const newService = new Service({
                    serviceName,
                    serviceDescription,
                    img: imgUrl,
                    price,
                    category,
                    serviceType
                });
                console.log(4)
                const addedNewService = await newService.save();
                console.log(5)
                if (!addedNewService) {
                    return res.json({ errorMessage: "Something went wrong" });
                }
                console.log(6)
                res.json({ message: "Service added", success: true });
            } catch (error) {
                res.json({ errorMessage: "Something went wrong", error });
            }
        });
    },
    getAllService: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const allTheServices = await Service.find()
                .skip(skip)
                .limit(limit);

            const totalServices = await Service.countDocuments();

            res.json({
                totalPages: Math.ceil(totalServices / limit),
                currentPage: page,
                services: allTheServices
            });
        } catch (error) {
            res.json({ errorMessage: "Something went wrong", error });
        }
    },
    getTopServices: async (req, res) => {
        try {
            const topServices = await Service.find().sort({ bookingCount: -1 });
            res.json(topServices);
        } catch (error) {
            res.json({ errorMessage: "Something went wrong", error });
        }
    },
    deleteService: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await Service.deleteOne({ _id: id });
            if (!deleted) {
                return res.json({ errorMessage: "Something went wrong. Please try again" });
            }
            res.json({ message: "Deleted" });
        } catch (error) {
            res.json({ errorMessage: "Something went wrong. Try again", error });
        }
    },
    getParticularServiceById: async (req, res) => {
        try {
            const { id } = req.params;
            const serviceDetails = await Service.findById(id);
            if (!serviceDetails) {
                return res.json({ message: "Service is missing" });
            }
            res.json(serviceDetails);
        } catch (error) {
            res.json({ errorMessage: "Something went wrong", error });
        }
    },
    editService: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.json({ errorMessage: err });
            }
            try {
                const { id } = req.params;
                const { serviceName, serviceDescription, price, category, serviceType } = req.body;
                const imgUrl = req.file ? req.file.path : '';
                const updatedFields = { serviceName, serviceDescription, price, category, serviceType };
                if (imgUrl) updatedFields.img = imgUrl;


                const edited = await Service.findByIdAndUpdate(id, updatedFields, { new: true });

                if (!edited) {
                    return res.json({ message: "Something went wrong" });
                }
                res.json({ message: "Edited", success: true });
            } catch (error) {
                res.json({ errorMessage: "Something went wrong", error });
            }
        });
    }
};

module.exports = serviceController;







