import prisma from '../prisma/client.js';

const connectToDatabase = async () => {
    try {
      await prisma.$connect();
      console.log('Connected to the database.');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      process.exit(1);
    }
};

export default connectToDatabase;