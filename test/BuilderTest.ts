import {Builder} from "@src/Builder";
import * as sinon from 'sinon';

describe('Builder', () => {
	let builder: Builder;

	beforeEach(() => {
		builder = new Builder();
	});

	describe('run', () => {
		it('runs provided function on current instance', () => {
			const stub = sinon.stub();

			const result = builder.run(stub);

			expect(result)
				.toStrictEqual(builder);

			sinon.assert.calledWith(stub, sinon.match.same(builder));
		});
	});

	describe('runIf', () => {

		it('runs a func if condition is true', () => {
			const stub = sinon.stub();
			const result = builder.runIf(true, stub);

			expect(result)
				.toStrictEqual(builder);

			sinon.assert.calledWith(stub, sinon.match.same(builder));
		});

		it('does not run a func if condition is false', () => {
			const stub = sinon.stub();
			const result = builder.runIf(false, stub);

			expect(result)
				.toStrictEqual(builder);

			sinon.assert.notCalled(stub);
		});
	});
});