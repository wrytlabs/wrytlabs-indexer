import { ponder } from '@/generated';
import { MembershipFactory } from '../ponder.schema';

ponder.on('MembershipFactory:Created', async ({ event, context }) => {
	await context.db.insert(MembershipFactory).values({
		address: event.args.membership,
		createdAt: parseInt(event.block.timestamp.toString()),
		creator: event.transaction.from,
		txHash: event.transaction.hash,
	});
});
