import { ponder } from '@/generated';
import { MembershipRoleAdminChanged, MembershipRoleGranted, MembershipRolePermission, MembershipRoleRevoked } from '../ponder.schema';

ponder.on('Membership:RoleAdminChanged', async ({ event, context }) => {
	await context.db.insert(MembershipRoleAdminChanged).values({
		id: event.block.number + '-' + event.log.address + '-' + event.args.role + '-' + event.args.newAdminRole,
		address: event.log.address,
		createdAt: parseInt(event.block.timestamp.toString()),
		creator: event.transaction.from,
		txHash: event.transaction.hash,
		role: event.args.role,
		previousAdminRole: event.args.previousAdminRole,
		newAdminRole: event.args.newAdminRole,
	});
});

ponder.on('Membership:RoleGranted', async ({ event, context }) => {
	await context.db.insert(MembershipRoleGranted).values({
		id: event.block.number + '-' + event.log.address + '-' + event.args.role + '-' + event.args.account,
		address: event.log.address,
		createdAt: parseInt(event.block.timestamp.toString()),
		creator: event.transaction.from,
		txHash: event.transaction.hash,
		role: event.args.role,
		account: event.args.account,
		sender: event.args.sender,
	});

	await context.db
		.insert(MembershipRolePermission)
		.values({
			id: event.log.address + '-' + event.args.account + '-' + event.args.role,
			address: event.log.address,
			createdAt: parseInt(event.block.timestamp.toString()),
			updatedAt: parseInt(event.block.timestamp.toString()),
			txHash: event.transaction.hash,
			role: event.args.role,
			account: event.args.account,
			permission: true,
		})
		.onConflictDoUpdate((row) => ({
			updatedAt: parseInt(event.block.timestamp.toString()),
			txHash: event.transaction.hash,
			permission: true,
		}));
});

ponder.on('Membership:RoleRevoked', async ({ event, context }) => {
	await context.db.insert(MembershipRoleRevoked).values({
		id: event.block.number + '-' + event.log.address + '-' + event.args.role + '-' + event.args.account,
		address: event.log.address,
		createdAt: parseInt(event.block.timestamp.toString()),
		creator: event.transaction.from,
		txHash: event.transaction.hash,
		role: event.args.role,
		account: event.args.account,
		sender: event.args.sender,
	});

	await context.db
		.insert(MembershipRolePermission)
		.values({
			id: event.log.address + '-' + event.args.account + '-' + event.args.role,
			address: event.log.address,
			createdAt: parseInt(event.block.timestamp.toString()),
			updatedAt: parseInt(event.block.timestamp.toString()),
			txHash: event.transaction.hash,
			role: event.args.role,
			account: event.args.account,
			permission: false,
		})
		.onConflictDoUpdate((row) => ({
			updatedAt: parseInt(event.block.timestamp.toString()),
			txHash: event.transaction.hash,
			permission: false,
		}));
});
