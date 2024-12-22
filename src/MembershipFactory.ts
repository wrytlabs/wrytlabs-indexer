import { ponder } from '@/generated';

ponder.on('MembershipFactory:Created', async ({ event, context }) => {
	console.log('Created');
	console.log(event);
});
