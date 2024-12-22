import { ponder } from '@/generated';

ponder.on('Membership:RoleGranted', async ({ event, context }) => {
	console.log('RoleGranted');
	console.log(event);
});

ponder.on('Membership:RoleAdminChanged', async ({ event, context }) => {
	console.log('RoleAdminChanged');
	console.log(event);
});

ponder.on('Membership:RoleRevoked', async ({ event, context }) => {
	console.log('RoleRevoked');
	console.log(event);
});
