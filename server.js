require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*', 
}));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log('   error:', err));

const Service = mongoose.model('Service', new mongoose.Schema({ name: String, price: String }));
const Feed = mongoose.model('Feed', new mongoose.Schema({ imageUrl: String, caption: String, createdAt: { type: Date, default: Date.now } }));

app.get('/api/services', async (req, res) => res.json(await Service.find()));
app.post('/api/services', async (req, res) => { const s = new Service(req.body); await s.save(); res.json(s); });

app.get('/api/feed', async (req, res) => res.json(await Feed.find().sort({ createdAt: -1 })));
app.post('/api/feed', async (req, res) => { const f = new Feed(req.body); await f.save(); res.json(f); });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Chạy tại port ${PORT}`));
