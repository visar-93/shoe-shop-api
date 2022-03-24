const { validationResult } = require("express-validator/check");
const Product = require("../models/product");
const User = require("../models/user");
const fs = require('fs');
const path = require('path');

exports.getPosts = (req, res, next) => {
  Product
  .find()
  .then(products => {
    res.status(200).json({message: 'Fetched products successfully.', products: products})
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  if(!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  
  const imageUrl = req.file.path;
  const title = req.body.title;
  const price = req.body.price;
  const code = req.body.code;
  // const imageUrl = req.body.imageUrl;
  const sizes = req.body.sizes;
  let creator;

  const product = new Product({
    title: title,
    price: price,
    colors: {
      code: code,
      imageUrl: imageUrl,
      sizes: sizes,
    },
    creator: req.userId
  });
  product
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then(user => {
      creator = user;
      user.products.push(product)
      return user.save();
    })
    .then(result  => {
      res.status(201).json({
        message: "Product created successfully!",
        product: product,
        creator: {
          _id: creator._id,
        }
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, rext) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      if(!product) {
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({message: 'Product fetched.', product: product})
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const productId = req.params.productId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const price = req.body.price;
  const code = req.body.code;
  const imageUrl = req.body.imageUrl; // imageUrl should be as in frontend
  const sizes = req.body.sizes;

  if(req.file) {
    imageUrl = req.file.path;
  }
  if(!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  Product.findById(productId)
  .then(product => {
    if(!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }

    if(product.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    if(imageUrl !== product.imageUrl) {
        clearImage(product.imageUrl);
    }

    product.title = title;
      product.price = price;
      product.code = code;
      product.sizes = sizes;
      product.imageUrl = imageUrl;
      return product.save();
  })
  .then((result) => {
    res.status(200).json({ message: "Product updated!", product: result });
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.deletePost = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        const error = new Error("Could not find product.");
        error.statusCode = 404;
        throw error;
      }
      // Check logged user
      if(product.creator.toString() !== req.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }
      clearImage(product.imageUrl);
      return Product.findByIdAndRemove(productId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then(user => {
      user.products.pull(productId)
      return user.save();
    })
    .then(result => {
      res.status(200).json({ message: "Deleted product." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => {
    console.log(err);
  });
};
