const { validationResult } = require("express-validator/check");
const Product = require("../models/product");


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

  const product = new Product({
    title: title,
    price: price,
    colors: {
      code: code,
      imageUrl: imageUrl,
      sizes: sizes,
    },
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Product created successfully!",
        product: result,
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
