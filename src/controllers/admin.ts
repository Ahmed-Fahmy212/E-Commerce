
import prisma from '../util/prisma';

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
