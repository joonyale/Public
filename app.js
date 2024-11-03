
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Multer setup for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.get('/api/figures', (req, res) => {
    const page = parseInt(req.query.page);
    const figuresPerPage = 100;
    const figures = Array.from({ length: figuresPerPage }, (_, i) => ({
        id: i + 1 + (page - 1) * figuresPerPage,
        imageUrl: `https://example.com/figure${i + 1}.jpg`
    }));
    res.json({ figures });
});

app.post('/api/cart', (req, res) => {
    res.json({ message: "Item added to cart" });
});

app.post('/api/order', (req, res) => {
    res.json({ message: "Order placed successfully" });
});

app.get('/api/admin/orders', (req, res) => {
    const orders = [
        { figureId: 1, customerName: "John Doe", address: "123 Street", contact: "123-456-7890", paid: true }
    ];
    res.json({ orders });
});

// New API route for image upload
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ message: "Image uploaded successfully!", filePath: `/uploads/${req.file.filename}` });
    } else {
        res.status(400).json({ message: "Image upload failed." });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
