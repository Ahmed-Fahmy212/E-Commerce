const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


//prisma and crud and authintication 
exports.postAddProduct =async (req, res, next) => {
  const {title , price , imageUrl , description } = req.body;
 try {
  const product = await prisma.product.create({title , price , imageUrl , description})
  res.status(201).json(product);
} catch(err){ 
  // an internal server error
  res.status(500).json({error:err.message})
}
};



exports.updateProduct = async (req, res, next) => {
  const { id, title, price, description } = req.body

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        title: title,
        price: price,
        description: description
      }
    })
    res.status(200).json(updatedProduct)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: parseInt(productId) },
    });
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// was in sequalize 

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect('/');
//   }
//   const prodId = req.params.productId;
//   req.user
//     .getProducts({ where: { id: prodId } })  //=>
//     // Product.findById(prodId)
//     .then(products => {
//       const product = products[0];
//       if (!product) {
//         return res.redirect('/');
//       }
//       res.render('admin/edit-product', {
//         pageTitle: 'Edit Product',
//         path: '/admin/edit-product',
//         editing: editMode,
//         product: product
//       });
//     })
//     .catch(err => console.log(err));
// };


// const Product = require('../models/product');

// exports.getAddProduct = (req, res, next) => {
//   res.render('admin/edit-product', {
//     pageTitle: 'Add Product',
//     path: '/admin/add-product',
//     editing: false
//   });
// };

// exports.getProducts = (req, res, next) => {
//   req.user
//     .getProducts()
//     .then(products => {
//       res.render('admin/products', {
//         prods: products,
//         pageTitle: 'Admin Products',
//         path: '/admin/products'
//       });
//     })
//     .catch(err => console.log(err));
// };