# Request Manager

[![Publish to npm](https://github.com/xianweics/seq-request/actions/workflows/publish-npm.yml/badge.svg)](https://github.com/xianweics/seq-request/actions/workflows/publish-npm.yml)
[![codecov](https://codecov.io/github/xianweics/seq-request/graph/badge.svg?token=WT0T2S3TKT)](https://codecov.io/github/xianweics/seq-request)

## Overview

A lightweight TypeScript library for handling request deduplication. Only the latest request's result will be returned, previous requests' results will be ignored. Note that this does not actually cancel the underlying requests - they continue to execute in the background.

## Features

- **Request Deduplication**: Automatically ignores results from superseded requests when a new one is made
- **Error Handling**: Properly handles errors from the latest request while ignoring errors from superseded requests
- **TypeScript Support**: Full TypeScript type definitions
- **Lightweight**: Minimal overhead with no external dependencies
- **Easy to Use**: Simple API that wraps any async function

## Installation

```bash
npm install seq-request
```

## Usage

### Basic Usage

```typescript
import { RequestManager } from 'seq-request';

const requestManager = new RequestManager();

// Wrap your async function
const wrappedRequest = requestManager.wrap(async (id: string) => {
  const response = await fetch(`/api/data/${id}`);
  return response.json();
});

// Use the wrapped function
const result = await wrappedRequest('123');
```

### Handling Multiple Requests

```typescript
const requestManager = new RequestManager();
const wrappedRequest = requestManager.wrap(async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate slow request
  return `Result for ${id}`;
});

// First request (result will be ignored)
const promise1 = wrappedRequest('1');
// Second request (result will be ignored)
const promise2 = wrappedRequest('2');
// Third request (result will be returned)
const promise3 = wrappedRequest('3');

const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3]);
console.log(result1); // null (superseded)
console.log(result2); // null (superseded)
console.log(result3); // "Result for 3" (latest request)
```

### Error Handling

```typescript
const requestManager = new RequestManager();
const wrappedRequest = requestManager.wrap(async () => {
  throw new Error('Request failed');
});

try {
  await wrappedRequest();
} catch (error) {
  console.error('Latest request failed:', error.message);
}
```

## API Reference

### RequestManager

#### Constructor

```typescript
new RequestManager()
```

Creates a new RequestManager instance.

#### Methods

##### `wrap(requestFn: Function)`

Wraps a function to add request deduplication functionality.

**Parameters:**
- `requestFn` - The function to wrap (can be async or sync)

**Returns:**
- A wrapped function that ignores results from superseded requests

**Behavior:**
- Only the most recent call to the wrapped function will return its result
- Previous calls will return `null` (for successful requests) or be ignored (for failed requests)
- Errors from the latest request are properly thrown
- Errors from superseded requests are ignored
- **Important**: The underlying requests are not actually cancelled - they continue to execute in the background

## Examples

### Search Input with Debouncing

```typescript
const requestManager = new RequestManager();
const searchAPI = requestManager.wrap(async (query: string) => {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  return response.json();
});

// User types quickly
searchAPI('a');     // Result ignored
searchAPI('ab');    // Result ignored
searchAPI('abc');   // Only this result is returned
```

### Form Submission

```typescript
const requestManager = new RequestManager();
const submitForm = requestManager.wrap(async (formData: FormData) => {
  const response = await fetch('/api/submit', {
    method: 'POST',
    body: formData
  });
  return response.json();
});

// Prevent multiple submissions from returning results
const result = await submitForm(formData);
```

## Important Notes

- **No Actual Cancellation**: This library does not cancel the underlying requests. They continue to execute in the background, which means:
  - Network requests will still complete
  - Server-side operations will still run
  - Resources may still be consumed
- **Result Filtering**: The library only filters which results are returned to your application
- **Use Cases**: Best suited for scenarios where you want to ignore stale results, not for resource management

## Development

### Install Dependencies

```bash
pnpm install
```

### Run Tests

```bash
npm run test
```

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

## Feature improve

- [ ] Enable to cancel older request
- [ ] Add request timeout support
- [ ] Add request retry mechanism
- [ ] Add request caching support

## License

MIT
