import { createSchema } from '@ponder/core';

export default createSchema((p) => ({
	ActiveUser: p.createTable({
		id: p.string(),
		lastActiveTime: p.bigint(),
	}),
}));
