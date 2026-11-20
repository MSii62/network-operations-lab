import { Worker } from '@temporalio/worker';
import { NativeConnection } from '@temporalio/worker';
import * as activities from './activities';
import { config } from './config';

async function main() {
  const connection = await NativeConnection.connect({ address: config.temporalAddress });
  const worker = await Worker.create({ connection, workflowsPath: require.resolve('./workflows'), activities, taskQueue: 'hotel-offers' });
  console.log(`Temporal worker listening on hotel-offers (${config.temporalAddress})`);
  await worker.run();
}
main().catch(error => { console.error(error); process.exit(1); });
