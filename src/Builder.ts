export class Builder {
	run(func: (builder: this) => void): this {
		func(this);
		return this;
	}

	runIf(condition: boolean, func: (builder: this) => void): this {
		if (condition) {
			func(this);
		}
		return this;
	}
}