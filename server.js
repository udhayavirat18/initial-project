const express = require('express');
const mongoose = require('mongoose');

const Product = require('../initial-project/models/productModule');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes
app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});
// Create a route to fetch all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
// Route to fetch a particular product by ID
app.get('/products/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.put('/products/:productId', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Route to delete a product by ID
app.delete('/products/:productId', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.patch('/products/:productId/:property', async (req, res) => {
    try {
        const { productId, property } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete the property from the product object
        delete product[property];
        
        // Save the updated product back to the database
        await product.save();

        res.status(200).json(product);
    } catch (error) {
        console.error('Error deleting property from product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/products', async(req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product);
    } catch (error) {
        console.error('Error adding products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
mongoose.connect('mongodb+srv://udhayavirat12:12345@initialapi.qerlzde.mongodb.net/')
    .then(function() {
        console.log('Connected to MongoDB!');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(function(err) {
        console.error('Error connecting to MongoDB:', err);
    });

