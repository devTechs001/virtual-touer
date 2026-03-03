import mongoose from 'mongoose';

/**
 * MongoDB Connection Manager with Intelligent Fallback
 * 
 * Connection Priority:
 * 1. MongoDB Atlas (Primary/Production)
 * 2. MongoDB Local via Docker (Development)
 * 3. MongoDB Compass/Local Installation (Fallback)
 * 
 * Features:
 * - Automatic failover
 * - Connection health monitoring
 * - Reconnection logic
 * - Connection pooling
 * - Graceful shutdown
 */

class DatabaseManager {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.connectionMode = null; // 'atlas', 'docker', 'local'
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.healthCheckInterval = null;
  }

  /**
   * Get connection string based on environment and availability
   */
  getConnectionStrings() {
    return {
      atlas: process.env.ATLAS_URI,
      docker: process.env.MONGODB_URI_DOCKER || 'mongodb://admin:admin123@localhost:27017/virtual-tourist?authSource=admin',
      local: process.env.MONGODB_URI || process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/virtual-tourist'
    };
  }

  /**
   * Test connection to a specific URI
   */
  async testConnection(uri, timeout = 5000) {
    try {
      const conn = await mongoose.createConnection(uri, {
        serverSelectionTimeoutMS: timeout,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 30000,
        retryWrites: true,
        w: 'majority'
      }).asPromise();

      await conn.db.command({ ping: 1 });
      return { success: true, connection: conn };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Connect with automatic fallback
   */
  async connect() {
    const uris = this.getConnectionStrings();
    const forceLocal = process.env.USE_LOCAL_DB === 'true' || process.env.NODE_ENV === 'test';

    console.log('🔌 Attempting database connection...');
    console.log('   Mode:', forceLocal ? 'Force Local' : 'Auto Fallback');
    console.log('');

    // If forced to use local, skip Atlas
    if (forceLocal) {
      return this.connectToLocal(uris);
    }

    // Try Atlas first (only if URI is provided and not empty)
    if (uris.atlas && uris.atlas.trim().startsWith('mongodb')) {
      console.log('📡 Attempting MongoDB Atlas connection...');
      const result = await this.testConnection(uris.atlas);

      if (result.success) {
        this.connection = result.connection;
        this.isConnected = true;
        this.connectionMode = 'atlas';
        this.startHealthCheck();
        console.log('✅ Connected to MongoDB Atlas');
        console.log(`   Host: ${this.connection.host}`);
        console.log(`   Database: ${this.connection.name}`);
        console.log('');
        return this.connection;
      } else {
        console.warn('⚠️  Atlas connection failed');
        console.warn(`   ${result.error}`);
        console.log('');
      }
    } else {
      console.log('ℹ️  No Atlas URI configured, skipping...');
      console.log('');
    }

    // Fallback to local
    return this.connectToLocal(uris);
  }

  /**
   * Connect to local MongoDB (Docker or Compass)
   */
  async connectToLocal(uris) {
    console.log('🏠 Attempting local MongoDB connection...');

    // Try Docker MongoDB first
    if (uris.docker) {
      console.log('   Trying Docker MongoDB...');
      const dockerResult = await this.testConnection(uris.docker);
      
      if (dockerResult.success) {
        this.connection = dockerResult.connection;
        this.isConnected = true;
        this.connectionMode = 'docker';
        this.startHealthCheck();
        console.log('✅ Connected to Docker MongoDB');
        console.log(`   Host: ${this.connection.host}`);
        console.log(`   Database: ${this.connection.name}`);
        console.log('');
        console.log('📝 Running in development mode with Docker MongoDB');
        console.log('');
        return this.connection;
      }
    }

    // Try local MongoDB (Compass/standalone)
    if (uris.local) {
      console.log('   Trying local MongoDB (Compass)...');
      const localResult = await this.testConnection(uris.local);
      
      if (localResult.success) {
        this.connection = localResult.connection;
        this.isConnected = true;
        this.connectionMode = 'local';
        this.startHealthCheck();
        console.log('✅ Connected to Local MongoDB');
        console.log(`   Host: ${this.connection.host}`);
        console.log(`   Database: ${this.connection.name}`);
        console.log('');
        console.log('📝 Running in development mode with MongoDB Compass');
        console.log('');
        return this.connection;
      }
    }

    // All connections failed
    this.handleConnectionFailure();
  }

  /**
   * Handle complete connection failure
   */
  handleConnectionFailure() {
    console.error('');
    console.error('❌ All database connection attempts failed!');
    console.error('');
    console.error('📖 Setup Options:');
    console.error('');
    console.error('   Option 1: MongoDB Atlas (Cloud)');
    console.error('   1. Visit https://cloud.mongodb.com');
    console.error('   2. Create a free cluster');
    console.error('   3. Get connection string');
    console.error('   4. Add to .env: MONGODB_URI=mongodb+srv://...');
    console.error('');
    console.error('   Option 2: Docker MongoDB (Recommended for Dev)');
    console.error('   1. Run: docker run -d -p 27017:27017 --name mongodb mongo:7');
    console.error('   2. Or use: docker-compose up mongodb');
    console.error('   3. Connection: mongodb://localhost:27017/virtual-tourist');
    console.error('');
    console.error('   Option 3: MongoDB Compass (Local Installation)');
    console.error('   1. Install: https://www.mongodb.com/products/compass');
    console.error('   2. Start MongoDB service');
    console.error('   3. Connect to: mongodb://localhost:27017');
    console.error('');
    console.error('   Quick Start Script:');
    console.error('   npm run setup:mongodb');
    console.error('');
    
    // Don't exit in development, allow app to run in limited mode
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  /**
   * Start connection health monitoring
   */
  startHealthCheck() {
    this.healthCheckInterval = setInterval(async () => {
      try {
        if (this.connection) {
          await this.connection.db.command({ ping: 1 });
          if (!this.isConnected) {
            console.log('✅ Database connection restored');
            this.isConnected = true;
          }
        }
      } catch (error) {
        console.warn('⚠️  Database health check failed:', error.message);
        this.isConnected = false;
        this.attemptReconnect();
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Attempt to reconnect
   */
  async attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);

    try {
      await this.connect();
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('Reconnection failed:', error.message);
    }
  }

  /**
   * Get current connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      mode: this.connectionMode,
      host: this.connection?.host || null,
      database: this.connection?.name || null,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  /**
   * Graceful shutdown
   */
  async disconnect() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    if (this.connection) {
      await this.connection.close();
      console.log('👋 Database connection closed');
    }

    this.isConnected = false;
    this.connection = null;
    this.connectionMode = null;
  }
}

// Export singleton instance
const dbManager = new DatabaseManager();

// Legacy function for backward compatibility
const connectDB = async () => {
  return dbManager.connect();
};

export { dbManager, DatabaseManager };
export default connectDB;
