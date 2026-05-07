export interface SystemHealth {
  status: string;
  database: {
    status: string;
    collections: Record<string, number>;
  };
  server: {
    uptime: number;
    memoryUsage: {
      rss: number;
      heapUsed: number;
      heapTotal: number;
    };
    platform: string;
    nodeVersion: string;
    cpuCount: number;
    freeMemoryMB: number;
    totalMemoryMB: number;
  };
  timestamp: string;
}
