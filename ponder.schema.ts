import { onchainTable } from '@ponder/core';

export const MembershipFactory = onchainTable('MembershipFactory', (t) => ({
	address: t.text().primaryKey(),
	createdAt: t.integer(),
	creator: t.text(),
	txHash: t.text(),
}));

export const MembershipRoleAdminChanged = onchainTable('MembershipRoleAdminChanged', (t) => ({
	id: t.text().primaryKey(),
	address: t.text(),
	createdAt: t.integer(),
	creator: t.text(),
	txHash: t.text(),
	role: t.text(),
	previousAdminRole: t.text(),
	newAdminRole: t.text(),
}));

export const MembershipRoleGranted = onchainTable('MembershipRoleGranted', (t) => ({
	id: t.text().primaryKey(),
	address: t.text(),
	createdAt: t.integer(),
	creator: t.text(),
	txHash: t.text(),
	role: t.text(),
	account: t.text(),
	sender: t.text(),
}));

export const MembershipRoleRevoked = onchainTable('MembershipRoleRevoked', (t) => ({
	id: t.text().primaryKey(),
	address: t.text(),
	createdAt: t.integer(),
	creator: t.text(),
	txHash: t.text(),
	role: t.text(),
	account: t.text(),
	sender: t.text(),
}));

export const MembershipRolePermission = onchainTable('MembershipRolePermission', (t) => ({
	id: t.text().primaryKey(),
	address: t.text(),
	createdAt: t.integer(),
	updatedAt: t.integer(),
	txHash: t.text().notNull(),
	role: t.text().notNull(),
	account: t.text().notNull(),
	permission: t.boolean().notNull(),
}));
