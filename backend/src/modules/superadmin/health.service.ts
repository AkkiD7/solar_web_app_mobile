import mongoose from 'mongoose';
import os from 'os';

export const getSystemHealth = async () => {
  const dbState = mongoose.connection.readyState;
  const dbStatus: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  // Collection stats
  const db = mongoose.connection.db;
  let collectionStats: Record<string, number> = {};
  if (db) {
    const collections = await db.listCollections().toArray();
    const counts = await Promise.all(
      collections.map(async (col) => {
        const count = await db.collection(col.name).countDocuments();
        return [col.name, count] as [string, number];
      })
    );
    collectionStats = Object.fromEntries(counts);
  }

  return {
    status: dbState === 1 ? 'healthy' : 'degraded',
    database: {
      status: dbStatus[dbState] ?? 'unknown',
      collections: collectionStats,
    },
    server: {
      uptime: Math.floor(process.uptime()),
      memoryUsage: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      platform: os.platform(),
      nodeVersion: process.version,
      cpuCount: os.cpus().length,
      freeMemoryMB: Math.round(os.freemem() / 1024 / 1024),
      totalMemoryMB: Math.round(os.totalmem() / 1024 / 1024),
    },
    timestamp: new Date().toISOString(),
  };
};
