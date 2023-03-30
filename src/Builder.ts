export class Builder {
	/**
	 * Runs provided function (with current builder instance as argument)
	 *
	 * Returns function result instead of current builder
	 * instance if function result is not null and not undefined,
	 * otherwise returns current builder instance
	 */
	run(func: (builder: this) => undefined | null): this;
	run<TResult extends NonNullable<{}>>(func: (builder: this) => TResult): NonNullable<TResult>;
	run<TResult>(func: (builder: this) => TResult): this | NonNullable<TResult>;
	run<TResult>(func: (builder: this) => TResult): this | NonNullable<TResult> {
		const result = func(this);
		// eslint-disable-next-line no-null/no-null
		if (result === undefined || result === null) {
			return this;
		}
		return result as NonNullable<TResult>;
	}

	/**
	 * Runs provided function (with current builder instance as argument) only if provided condition holds
	 * Handles function result the same way `run` method
	 */
	runIf<TResult>(condition: boolean, func: (builder: this) => TResult) {
		if (condition) {
			return this.run<TResult>(func);
		}
		return this;
	}

	/**
	 * Extends provided object with builder capabilities
	 */
	static extend<T extends object>(obj: T): T & Builder {
		return Object.assign(obj, new Builder());
	}
}
