import { ponder } from '@/generated';

ponder.on('Membership:RoleGranted', async ({ event, context }) => {
	console.log('RoleGranted');
});

ponder.on('Membership:RoleAdminChanged', async ({ event, context }) => {
	console.log('RoleAdminChanged');
});

ponder.on('Membership:RoleRevoked', async ({ event, context }) => {
	console.log('RoleRevoked');
});
