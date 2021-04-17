export class Builder {
	run(func: (builder: this) => this): this {
		func(this);
		return this;
	}

	runIf(condition: boolean, func: (builder: this) => this): this {
		if (condition) {
			func(this);
		}
		return this;
	}
}