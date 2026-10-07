import 'dotenv/config';
import { app } from './app';
import { disconnectDatabase } from './repositories/database';
import { startOverdueScheduler } from './jobs/overdue-scheduler';

const port = Number(process.env.PORT || 4000);
const server = app.listen(port, () => console.log(`API listening on ${port} port`));
const stopOverdueScheduler = startOverdueScheduler();

function shutdown() {
  stopOverdueScheduler();
  server.close(() => {
    void disconnectDatabase().finally(() => process.exit(0));
  });
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
