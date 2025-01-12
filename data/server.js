import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirname ni aniqlash (ES Module uchun)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

// uploads papkasini avtomatik yaratish
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));  // Rasmga ochiq yo'l

// Multer rasm yuklashni sozlash
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Rasm formatini tekshirish
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    cb(null, true);
  } else {
    cb(new Error('Faqat rasm fayllarini yuklash mumkin!'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter 
});

// Rasm yuklash va db.json ga yozish
app.post('/upload', upload.single('image'), (req, res) => {
  const { title, price } = req.body;

  if (!title || !price || !req.file) {
    return res.status(400).json({ error: 'Barcha maydonlarni to‘ldiring va rasm yuklang!' });
  }

  const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;

  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'db.json o‘qishda xatolik' });
    }

    let db;
    try {
      db = JSON.parse(data);
    } catch (parseError) {
      return res.status(500).json({ error: 'db.json ni tahlil qilishda xatolik' });
    }

    // Oxirgi mahsulotning id sini olish
    let newId = 1; // Agar bo‘sh bo‘lsa, id 1 bo‘ladi
    if (db.products.length > 0) {
      const lastProduct = db.products[db.products.length - 1];
      newId = parseInt(lastProduct.id) + 1; // Oxirgi id ga 1 qo‘shamiz
    }

    const newProduct = {
      id: newId.toString(),
      title,
      price,
      image: imageUrl
    };

    db.products.push(newProduct);

    fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'db.json ga yozishda xatolik' });
      }

      res.status(201).json({ message: 'Mahsulot muvaffaqiyatli qo‘shildi!', product: newProduct });
    });
  });
});

// Serverni ishga tushirish
app.listen(port, () => {
  console.log(`Server ${port}-portda ishga tushdi`);
});
