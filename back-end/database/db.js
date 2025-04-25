import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: 'notonfr0y',

        });
        console.log('MongoDB connected');
    }catch (error) {
        console.error('Error connecting to MongoDB:', error);

    }
}