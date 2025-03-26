import { ponder } from '@/generated';
import { LeverageMorphoBalance, LeverageMorphoCollateralFlat, LeverageMorphoExecuteFlat, LeverageMorphoLoanFlat } from '../ponder.schema';
import { parseEther, parseUnits } from 'viem';

ponder.on('LeverageMorpho:Collateral', async ({ event, context }) => {
	console.log(event.args);

	await context.db.insert(LeverageMorphoCollateralFlat).values({
		id: `${event.log.address}-${event.block.number}`,
		address: event.log.address,
		createdAt: parseInt(event.block.timestamp.toString()),
		txHash: event.transaction.hash,
		amount: event.args.amount,
		direction: event.args.direction,
	});

	await context.db
		.insert(LeverageMorphoBalance)
		.values({
			id: `${event.log.address}-${event.block.number}`,
			address: event.log.address,
			updatedAt: parseInt(event.block.timestamp.toString()),
			txHash: event.transaction.hash,
			inputCollateral: event.args.direction ? -event.args.amount : event.args.amount,
			inputLoan: 0n,
		})
		.onConflictDoUpdate((row) => ({
			updatedAt: parseInt(event.block.timestamp.toString()),
			txHash: event.transaction.hash,
			inputCollateral: (row.inputCollateral ?? 0n) + (event.args.direction ? -event.args.amount : event.args.amount),
		}));
});
ponder.on('LeverageMorpho:Loan', async ({ event, context }) => {
	console.log(event.args);

	await context.db.insert(LeverageMorphoLoanFlat).values({
		id: `${event.log.address}-${event.block.number}`,
		address: event.log.address,
		createdAt: parseInt(event.block.timestamp.toString()),
		txHash: event.transaction.hash,
		amount: event.args.amount,
		direction: event.args.direction,
	});

	await context.db
		.insert(LeverageMorphoBalance)
		.values({
			address: event.log.address,
			updatedAt: parseInt(event.block.timestamp.toString()),
			txHash: event.transaction.hash,
			inputCollateral: 0n,
			inputLoan: 0n,
		})
		.onConflictDoUpdate((row) => ({
			updatedAt: parseInt(event.block.timestamp.toString()),
			txHash: event.transaction.hash,
			inputCollateral: (row.inputCollateral ?? 0n) + (event.args.direction ? -event.args.amount : event.args.amount),
		}));
});
ponder.on('LeverageMorpho:Executed', async ({ event, context }) => {
	console.log(event.args);

	if (event.args.opcode == 0) {
		// flash: loan
		// swap: loan -> collateral
		await context.db.insert(LeverageMorphoExecuteFlat).values({
			id: `${event.log.address}-${event.block.number}`,
			address: event.log.address,
			createdAt: parseInt(event.block.timestamp.toString()),
			txHash: event.transaction.hash,
			opcode: event.args.opcode,
			inputLoan: event.args.swapIn - event.args.flash,
			inputCollateral: event.args.provided - event.args.swapOut,
			flash: event.args.flash,
			swapIn: event.args.swapIn,
			swapOut: event.args.swapOut,
			provided: event.args.provided,
			price: (event.args.swapIn * parseUnits('1', 8)) / event.args.swapOut,
		});
	} else if (event.args.opcode == 1) {
		// flash: collateral
		// swap: collateral --> loan
		await context.db.insert(LeverageMorphoExecuteFlat).values({
			id: `${event.log.address}-${event.block.number}`,
			address: event.log.address,
			createdAt: parseInt(event.block.timestamp.toString()),
			txHash: event.transaction.hash,
			opcode: event.args.opcode,
			inputLoan: event.args.swapIn - event.args.flash,
			inputCollateral: event.args.provided - event.args.swapOut,
			flash: event.args.flash,
			swapIn: event.args.swapIn,
			swapOut: event.args.swapOut,
			provided: event.args.provided,
			price: (event.args.swapOut * parseUnits('1', 8)) / event.args.swapIn,
		});
	} else {
		// flash: loan
		// swap: collateral --> loan
		await context.db.insert(LeverageMorphoExecuteFlat).values({
			id: `${event.log.address}-${event.block.number}`,
			address: event.log.address,
			createdAt: parseInt(event.block.timestamp.toString()),
			txHash: event.transaction.hash,
			opcode: event.args.opcode,
			inputLoan: 0n,
			inputCollateral: 0n,
			flash: event.args.flash,
			swapIn: event.args.swapIn,
			swapOut: event.args.swapOut,
			provided: event.args.provided,
			price: (event.args.swapOut * parseUnits('1', 8)) / event.args.swapIn,
		});
	}
});
