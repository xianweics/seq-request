/**
 * RequestManager class for handling request deduplication.
 * Only the latest request's result will be returned, previous requests' results will be ignored.
 * Note: This does not actually cancel the underlying requests - they continue to execute.
 */
export class RequestManager {
  /** Tracks the ID of the latest request to determine which request's result should be returned */
  private latestRequestId: number;

  constructor() {
    this.latestRequestId = 0;
  }

  /**
   * Wraps a function to add request deduplication functionality.
   * Only the most recent call to the wrapped function will return its result.
   * Previous calls will return null (for successful requests) or be ignored (for failed requests).
   * Note: The underlying requests are not cancelled - they continue to execute in the background.
   * @param requestFn - The function to wrap
   * @returns A wrapped function that ignores results from superseded requests
   */
  wrap(requestFn: Function) {
    return async (...args: unknown[]) => {
      const currentRequestId = ++this.latestRequestId;
      try {
        const result = await requestFn(...args);
        // Only return result if this is still the latest request
        if (currentRequestId === this.latestRequestId) {
          return result;
        } else {
          // This request was superseded by a newer one, ignore the result
          return null;
        }
      } catch (error) {
        // Only throw error if this is still the latest request
        if (currentRequestId === this.latestRequestId) {
          throw error;
        } else {
          // This request was superseded by a newer one, ignore the error
          return null;
        }
      }
    };
  }
}
