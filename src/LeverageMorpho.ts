import { ponder } from 'ponder:registry';
import { Counter, LeverageMorphoCollateralFlat, LeverageMorphoExecuteFlat, LeverageMorphoLoanFlat } from 'ponder:schema';
import { parseUnits } from 'viem';
import { IERC20ABI, IOracleABI } from '@wrytlabs/frankencoin-utils';

ponder.on('LeverageMorpho:Collateral', async ({ event, context }) => {
	const counter = await context.db
		.insert(Counter)
		.values({
			id: 'LeverageMorpho:Collateral',
			amount: 1n,
		})
		.onConflictDoUpdate((row) => ({
			amount: row.amount + 1n,
		}));

	const market = await context.client.readContract({
		address: event.log.address,
		abi: context.contracts.LeverageMorpho.abi,
		functionName: 'market',
	});

	const oraclePrice = await context.client.readContract({
		address: market[2],
		abi: IOracleABI,
		functionName: 'price',
	});

	const decimals = await context.client.readContract({
		address: market[1],
		abi: IERC20ABI,
		functionName: 'decimals',
	});

	await context.db.insert(LeverageMorphoCollateralFlat).values({
		id: `${event.log.address}-${event.block.number}-${counter.amount}`,
		count: counter.amount,
		address: event.log.address,
		createdAt: event.block.timestamp,
		txHash: event.transaction.hash,
		amount: event.args.amount,
		direction: event.args.direction,
		oracle: oraclePrice / BigInt(10 ** (36 - decimals)),
	});

	// await context.db
	// 	.insert(LeverageMorphoBalance)
	// 	.values({
	// 		address: event.log.address,
	// 		updatedAt: event.block.timestamp,
	// 		txHash: event.transaction.hash,
	// 		inputCollateral: event.args.direction ? -event.args.amount : event.args.amount,
	// 		inputLoan: 0n,
	// 	})
	// 	.onConflictDoUpdate((row) => ({
	// 		updatedAt: parseInt(event.block.timestamp.toString()),
	// 		txHash: event.transaction.hash,
	// 		inputCollateral: (row.inputCollateral ?? 0n) + (event.args.direction ? -event.args.amount : event.args.amount),
	// 	}));
});
ponder.on('LeverageMorpho:Loan', async ({ event, context }) => {
	const counter = await context.db
		.insert(Counter)
		.values({
			id: 'LeverageMorpho:Loan',
			amount: 1n,
		})
		.onConflictDoUpdate((row) => ({
			amount: row.amount + 1n,
		}));

	const market = await context.client.readContract({
		address: event.log.address,
		abi: context.contracts.LeverageMorpho.abi,
		functionName: 'market',
	});

	const oraclePrice = await context.client.readContract({
		address: market[2],
		abi: IOracleABI,
		functionName: 'price',
	});

	const decimals = await context.client.readContract({
		address: market[1],
		abi: IERC20ABI,
		functionName: 'decimals',
	});

	await context.db.insert(LeverageMorphoLoanFlat).values({
		id: `${event.log.address}-${event.block.number}-${counter.amount}`,
		count: counter.amount,
		address: event.log.address,
		createdAt: event.block.timestamp,
		txHash: event.transaction.hash,
		amount: event.args.amount,
		direction: event.args.direction,
		oracle: oraclePrice / BigInt(10 ** (36 - decimals)),
	});

	// await context.db
	// 	.insert(LeverageMorphoBalance)
	// 	.values({
	// 		address: event.log.address,
	// 		updatedAt: event.block.timestamp,
	// 		txHash: event.transaction.hash,
	// 		inputCollateral: 0n,
	// 		inputLoan: 0n,
	// 	})
	// 	.onConflictDoUpdate((row) => ({
	// 		updatedAt: parseInt(event.block.timestamp.toString()),
	// 		txHash: event.transaction.hash,
	// 		inputCollateral: (row.inputCollateral ?? 0n) + (event.args.direction ? -event.args.amount : event.args.amount),
	// 	}));
});
ponder.on('LeverageMorpho:Executed', async ({ event, context }) => {
	// console.log(event.args);

	const counter = await context.db
		.insert(Counter)
		.values({
			id: 'LeverageMorpho:Executed',
			amount: 1n,
		})
		.onConflictDoUpdate((row) => ({
			amount: row.amount + 1n,
		}));

	const rowId: string = `${event.log.address}-${event.block.number}-${counter.amount}`;

	if (event.args.opcode == 0) {
		// flash: loan
		// swap: loan -> collateral
		await context.db.insert(LeverageMorphoExecuteFlat).values({
			id: rowId,
			count: counter.amount,
			address: event.log.address,
			createdAt: event.block.timestamp,
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
			id: rowId,
			count: counter.amount,
			address: event.log.address,
			createdAt: event.block.timestamp,
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
			id: rowId,
			count: counter.amount,
			address: event.log.address,
			createdAt: event.block.timestamp,
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
