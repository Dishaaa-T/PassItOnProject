import dns from 'dns';
import mongoose from 'mongoose';

dns.setServers(['8.8.8.8', '1.1.1.1']);

export async function connectDB() {
    const uri =
        process.env.MONGO_URI ||
        'mongodb://127.0.0.1:27017/passiton';

    try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}