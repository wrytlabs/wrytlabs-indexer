import { onchainTable } from '@ponder/core';

export const LeverageMorphoFactory = onchainTable('LeverageMorphoFactory', (t) => ({
	address: t.text().primaryKey(),
	createdAt: t.integer().notNull(),
	creator: t.text().notNull(),
	txHash: t.text().notNull(),
	owner: t.text().notNull(),
	marketId: t.text().notNull(),
	loan: t.text().notNull(),
	loanDecimals: t.integer().notNull(),
	loanName: t.text().notNull(),
	loanSymbol: t.text().notNull(),
	collateral: t.text().notNull(),
	collateralDecimals: t.integer().notNull(),
	collateralName: t.text().notNull(),
	collateralSymbol: t.text().notNull(),
	oracle: t.text().notNull(),
	irm: t.text().notNull(),
	lltv: t.bigint().notNull().notNull(),
}));

export const LeverageMorphoCollateralFlat = onchainTable('LeverageMorphoCollateralFlat', (t) => ({
	id: t.text().primaryKey(),
	address: t.text(),
	createdAt: t.integer(),
	txHash: t.text(),
	amount: t.bigint(),
	direction: t.boolean(),
}));

export const LeverageMorphoLoanFlat = onchainTable('LeverageMorphoLoanFlat', (t) => ({
	id: t.text().primaryKey(),
	address: t.text(),
	createdAt: t.integer(),
	txHash: t.text(),
	amount: t.bigint(),
	direction: t.boolean(),
}));

export const LeverageMorphoExecuteFlat = onchainTable('LeverageMorphoExecuteFlat', (t) => ({
	id: t.text().primaryKey(),
	address: t.text(),
	createdAt: t.integer(),
	txHash: t.text(),
	opcode: t.integer(),
	inputCollateral: t.bigint(),
	inputLoan: t.bigint(),
	flash: t.bigint(),
	swapIn: t.bigint(),
	swapOut: t.bigint(),
	provided: t.bigint(),
	price: t.bigint(),
}));

export const LeverageMorphoBalance = onchainTable('LeverageMorphoBalance', (t) => ({
	address: t.text().primaryKey(),
	updatedAt: t.integer(),
	txHash: t.text(),
	inputCollateral: t.bigint(),
	inputLoan: t.bigint(),
	borrowed: t.bigint(),
	repaid: t.bigint(),
}));
