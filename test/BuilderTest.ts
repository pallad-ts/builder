import {Builder} from "@src/Builder";
import * as sinon from 'sinon';
import {assert, IsExact} from 'conditional-type-checks';

describe('Builder', () => {
	let builder: Builder;

	beforeEach(() => {
		builder = new Builder();
	});

	describe('types', () => {
		describe('run', () => {
			it('func returns undefined', () => {
				const result = new Builder().run(() => undefined);

				assert<IsExact<typeof result, Builder>>(true);
			});

			it('func returns null', () => {
				const result = new Builder().run(() => null);

				assert<IsExact<typeof result, Builder>>(true);
			});

			it('func returns some type', () => {
				const result = new Builder().run(() => 'foo' as const);

				assert<IsExact<typeof result, "foo">>(true);
			});

			it('func returns undefined or some type', () => {
				const result = new Builder().run(() => {
					if (Math.random() > 0.5) {
						return 'foo' as const;
					}
					return undefined;
				});

				assert<IsExact<typeof result, "foo" | Builder>>(true);
			});

			it('func returns null or some type', () => {
				const result = new Builder().run(() => {
					if (Math.random() > 0.5) {
						return 'foo' as const;
					}
					return null;
				});

				assert<IsExact<typeof result, "foo" | Builder>>(true);
			});
		});

		it('runIf', () => {
			const target = {foo: 'bar'} as const;
			const result = new Builder().runIf(true, () => target);

			assert<IsExact<typeof result, typeof target | Builder>>(true);
		});

		it('extend', () => {
			const target = {foo: 'bar'} as const;
			const result = Builder.extend(target);

			assert<IsExact<typeof result, { foo: 'bar' } & Builder>>(true);
		});
	});

	describe('run provided function and', () => {
		it('returns builder instance if func returns undefined', () => {
			const stub = sinon.stub().returns(undefined);
			const result = builder.run(stub);
			expect(result)
				.toStrictEqual(builder);

			sinon.assert.calledWith(stub, sinon.match.same(builder));
		});

		it('returns builder instance if func returns null', () => {
			const stub = sinon.stub().returns(null);
			const result = builder.run(stub);
			expect(result)
				.toStrictEqual(builder);

			sinon.assert.calledWith(stub, sinon.match.same(builder));
		});

		it('returns returned result if func returns non null and non undefined value', () => {
			const stub = sinon.stub().returns(null);
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

		it('runs a func if condition is true and returns result if it is non-null and non-undefined', () => {
			const target = {foo: 'bar'};
			const stub = sinon.stub().returns(target);
			const result = builder.runIf(true, stub);

			expect(result)
				.toStrictEqual(target);

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
