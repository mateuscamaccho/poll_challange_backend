import cron from 'node-cron';
import { prisma } from '../lib/prisma';

/**
 * Scheduler that runs hourly to activate polls that reached start_date
 * and close polls that reached end_date.
 */
export async function runPollJobsNow() {
  const now = new Date();
  try {
    const activated = await prisma.poll.updateMany({
      where: {
        start_date: { lte: now },
        status: 'inactive'
      },
      data: {
        status: 'running'
      }
    });

    const closed = await prisma.poll.updateMany({
      where: {
        end_date: { lte: now },
        NOT: { status: 'closed' }
      },
      data: {
        status: 'closed'
      }
    });

    console.log(`[pollScheduler] ${activated.count} polls activated, ${closed.count} polls closed at ${now.toISOString()}`);
    return { activated: activated.count, closed: closed.count, when: now.toISOString() };
  } catch (err) {
    console.error('[pollScheduler] Error running scheduled job:', err);
    throw err;
  }
}

export function startPollScheduler() {
  // Run at minute 0 of every hour
  cron.schedule('0 * * * *', async () => {
    try {
      await runPollJobsNow();
    } catch (err) {
      // already logged in runPollJobsNow
    }
  });

  console.log('[pollScheduler] Scheduler started — will run at the top of every hour');
}

// Optional: start automatically when this module is imported (but better to
// explicitly call startPollScheduler from server initialization). Do not auto-start here.
