<div align="center">
<h1>builder 💪</h1>

<p>Builder building blocks to prevent breaking chaining</p>
</div>

---
[![CircleCI](https://circleci.com/gh/pallad-ts/builder/tree/master.svg?style=svg)](https://circleci.com/gh/pallad-ts/builder/tree/master)
[![npm version](https://badge.fury.io/js/@pallad%2Fbuilder.svg)](https://badge.fury.io/js/@pallad%2Fbuilder)
[![Coverage Status](https://coveralls.io/repos/github/pallad-ts/builder/badge.svg?branch=master)](https://coveralls.io/github/pallad-ts/builder?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
---

# Installation

```shell
npm install @pallad/builder
```

# Problem

Whenever you use a builder pattern, sometimes certain methods needs be called conditionally.
For those cases you need to break the chaining.

```typescript

const queryBuilder = createQueryBuilder();
if (hasFilter) {
	queryBuilder.where() // do filters
}
return queryBuilder.where() // work on builder again
```

# Solution

That is very annoying and many times unnecessary complicates the code. `@pallad/builder` provides `Builder` class that
has `runIf` and `run` helper methods. The most useful is defeinitely `runIf`.

```typescript
return createQueryBuilder()
	.runIf(hasFilter, () => {
		queryBuilder.where() // do filters 
	})
	.where() // keep working on builder
```

Much cleaner.

# Usage and how it works

In order to use `Builder` in your builder patterns you need to either extend it.

```typescript
import {Builder} from '@pallad/builder';

class YourCustomBuilder extends Builder {

}
```

Or apply on existing object

```typescript
import {Builder} from '@pallad/builder';

const existingBuilder = Builder.extend(someBuilderInstance);
```

## `runIf`

`runIf` executes provided function only if `condition` is truthy.
If it is not, then returns current instance.

```typescript
new CustomBuilder()
	.runIf(hasEnabledSorting, (builder) => {
		builder.setupSorting(); // ran if `hasEnabledSorting` is truthy
	})
```

## `run`

`run` just always executes provided function.
Very handy when you need to setup huge builder but want to split it into several other functions.

```typescript
new CustomBuilder()
	.run(setupFilters)
	.run(setupSorting)
	.run(setupPagination)
	.run(setupTenancy)
```

## Returned result

Both `run` and `runIf` might return some result.
If that result is not `undefined` or `null` then that result is being returned back.

```typescript
const builder = new CustomBuilder();
const result = builder.runIf(true, () => {
	return new CustomBuilder(); // return new instance
});
result === builder // false
```

Otherwise current instance gets returned

```typescript
const builder = new CustomBuilder();
const result = builder.runIf(false, () => {
	// do nothing
});
result === builder // true
```

