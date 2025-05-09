import { onchainTable } from '@ponder/core';

export const Counter = onchainTable('Counter', (t) => ({
	id: t.text().primaryKey(),
	amount: t.bigint().notNull(),
}));

export const LeverageMorphoFactory = onchainTable('LeverageMorphoFactory', (t) => ({
	address: t.text().primaryKey(),
	createdAt: t.bigint().notNull(),
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

export const LeverageMorphoLoanFlat = onchainTable('LeverageMorphoLoanFlat', (t) => ({
	id: t.text().primaryKey(),
	count: t.bigint().notNull(),
	address: t.text().notNull(),
	createdAt: t.bigint().notNull(),
	txHash: t.text().notNull(),
	amount: t.bigint().notNull(),
	direction: t.boolean().notNull(),
	oracle: t.bigint().notNull(),
}));

export const LeverageMorphoCollateralFlat = onchainTable('LeverageMorphoCollateralFlat', (t) => ({
	id: t.text().primaryKey(),
	count: t.bigint().notNull(),
	address: t.text().notNull(),
	createdAt: t.bigint().notNull(),
	txHash: t.text().notNull(),
	amount: t.bigint().notNull(),
	direction: t.boolean().notNull(),
	oracle: t.bigint().notNull(),
}));

export const LeverageMorphoExecuteFlat = onchainTable('LeverageMorphoExecuteFlat', (t) => ({
	id: t.text().primaryKey(),
	count: t.bigint().notNull(),
	address: t.text().notNull(),
	createdAt: t.bigint().notNull(),
	txHash: t.text().notNull(),
	opcode: t.integer().notNull(),
	inputCollateral: t.bigint().notNull(),
	inputLoan: t.bigint().notNull(),
	flash: t.bigint().notNull(),
	swapIn: t.bigint().notNull(),
	swapOut: t.bigint().notNull(),
	provided: t.bigint().notNull(),
	price: t.bigint().notNull(),
	// oracle: t.bigint().notNull(),
}));

export const LeverageMorphoBalance = onchainTable('LeverageMorphoBalance', (t) => ({
	address: t.text().primaryKey(),
	updatedAt: t.bigint().notNull(),
	txHash: t.text().notNull(),
	inputCollateral: t.bigint().notNull(),
	inputLoan: t.bigint().notNull(),
	borrowed: t.bigint().notNull(),
	repaid: t.bigint().notNull(),
}));
