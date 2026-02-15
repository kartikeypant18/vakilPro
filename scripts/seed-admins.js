

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const admins = [
  { name: 'Kartikey Admin', email: 'kartikey+1@gmail.com', password: 'Pass@123', role: 'admin' },
  { name: 'Adarsh Admin', email: 'adarsh+1@gmail.com', password: 'Pass@123', role: 'admin' },
];

async function seed() {
  if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI in environment');
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  for (const admin of admins) {
    const existing = await User.findOne({ email: admin.email });
    if (existing) {
      console.log(`Admin already exists: ${admin.email}`);
      continue;
    }
    const hashed = await bcrypt.hash(admin.password, 10);
    await User.create({
      name: admin.name,
      email: admin.email,
      password: hashed,
      role: 'admin',
    });
    console.log(`Admin created: ${admin.email}`);
  }
  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
