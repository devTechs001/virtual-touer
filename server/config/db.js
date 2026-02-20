import mongoose from 'mongoose';

/**
 * Database Connection with Fallback Logic
 * Primary: MongoDB Atlas
 * Fallback: Local MongoDB (Compass)
 */

const connectDB = async () => {
  try {
    // Try Atlas first (Primary)
    if (process.env.MONGODB_URI && process.env.USE_LOCAL_DB !== 'true') {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds
      });
      
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      return;
    }
  } catch (error) {
    console.warn('⚠️  Atlas connection failed, trying local MongoDB...');
    console.warn(`   Error: ${error.message}`);
  }

  try {
    // Fallback to local MongoDB
    const localUri = process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/virtual-tourist';
    const conn = await mongoose.connect(localUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Local Connected: ${conn.connection.host}`);
    console.log('📝 Using local database (MongoDB Compass)');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('');
    console.error('📖 Setup Instructions:');
    console.error('   1. MongoDB Atlas: https://cloud.mongodb.com');
    console.error('   2. MongoDB Compass: https://www.mongodb.com/products/compass');
    console.error('   3. Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
    console.error('');
    process.exit(1);
  }
};

export default connectDB;
