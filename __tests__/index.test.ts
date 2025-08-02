import { RequestManager } from '../src/index';

describe('RequestManager', () => {
  let requestManager: RequestManager;

  beforeEach(() => {
    requestManager = new RequestManager();
  });

  describe('Basic functionality', () => {
    it('should successfully wrap async function and return result', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');
      const wrappedRequest = requestManager.wrap(mockRequest);

      const result = await wrappedRequest('test');

      expect(result).toBe('success');
      expect(mockRequest).toHaveBeenCalledWith('test');
    });

    it('should handle synchronous functions', async () => {
      const mockRequest = jest.fn().mockReturnValue('sync result');
      const wrappedRequest = requestManager.wrap(mockRequest);

      const result = await wrappedRequest();

      expect(result).toBe('sync result');
    });

    it('should pass multiple arguments to the original function', async () => {
      const mockRequest = jest.fn().mockResolvedValue('multi args');
      const wrappedRequest = requestManager.wrap(mockRequest);

      const result = await wrappedRequest('arg1', 'arg2', { key: 'value' });

      expect(result).toBe('multi args');
      expect(mockRequest).toHaveBeenCalledWith('arg1', 'arg2', {
        key: 'value',
      });
    });
  });

  describe('Error handling', () => {
    it('should correctly handle errors thrown by async functions', async () => {
      const error = new Error('Request failed');
      const mockRequest = jest.fn().mockRejectedValue(error);
      const wrappedRequest = requestManager.wrap(mockRequest);

      await expect(wrappedRequest()).rejects.toThrow('Request failed');
    });

    it('errors from old requests should be ignored and return null', async () => {
      const error = new Error('Request failed');
      const mockRequest = jest
        .fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce('success');

      const wrappedRequest = requestManager.wrap(mockRequest);

      const promise1 = wrappedRequest();
      const promise2 = wrappedRequest();

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1).toBeNull();
      expect(result2).toBe('success');
    });

    it('should throw error when the latest request fails', async () => {
      const error = new Error('Request failed');
      const mockRequest = jest
        .fn()
        .mockResolvedValueOnce('success')
        .mockRejectedValueOnce(error);

      const wrappedRequest = requestManager.wrap(mockRequest);

      const promise1 = wrappedRequest();
      const promise2 = wrappedRequest();

      await expect(Promise.all([promise1, promise2])).rejects.toThrow(
        'Request failed'
      );
    });
  });

  describe('Concurrent request scenarios', () => {
    it('should correctly handle multiple concurrent requests, only the last one returns result', async () => {
      const mockRequest = jest
        .fn()
        .mockImplementation(
          id =>
            new Promise(resolve =>
              setTimeout(() => resolve(`result-${id}`), 50)
            )
        );
      const wrappedRequest = requestManager.wrap(mockRequest);

      const promises = [
        wrappedRequest(1),
        wrappedRequest(2),
        wrappedRequest(3),
      ];

      const results = await Promise.all(promises);

      expect(results).toEqual([null, null, 'result-3']);
      expect(mockRequest).toHaveBeenCalledTimes(3);
    });
  });

  describe('Edge cases', () => {
    it('should correctly handle functions that return null', async () => {
      const mockRequest = jest.fn().mockResolvedValue(null);
      const wrappedRequest = requestManager.wrap(mockRequest);

      const result = await wrappedRequest();

      expect(result).toBeNull();
    });

    it('should correctly handle functions that return undefined', async () => {
      const mockRequest = jest.fn().mockResolvedValue(undefined);
      const wrappedRequest = requestManager.wrap(mockRequest);

      const result = await wrappedRequest();

      expect(result).toBeUndefined();
    });

    it('should correctly handle functions that throw non-Error objects', async () => {
      const mockRequest = jest.fn().mockRejectedValue('string error');
      const wrappedRequest = requestManager.wrap(mockRequest);

      await expect(wrappedRequest()).rejects.toBe('string error');
    });

    it('should correctly handle single requests', async () => {
      const mockRequest = jest.fn().mockResolvedValue('single result');
      const wrappedRequest = requestManager.wrap(mockRequest);

      const result = await wrappedRequest();

      expect(result).toBe('single result');
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('Request ID management', () => {
    it('should correctly increment request IDs', async () => {
      const mockRequest = jest.fn().mockResolvedValue('result');
      const wrappedRequest = requestManager.wrap(mockRequest);

      // First request
      const result1 = await wrappedRequest();
      expect(result1).toBe('result');

      // Second request
      const result2 = await wrappedRequest();
      expect(result2).toBe('result');

      expect(mockRequest).toHaveBeenCalledTimes(2);
    });

    it('should correctly handle multiple RequestManager instances', async () => {
      const manager1 = new RequestManager();
      const manager2 = new RequestManager();

      const mockRequest = jest.fn().mockResolvedValue('result');
      const wrappedRequest1 = manager1.wrap(mockRequest);
      const wrappedRequest2 = manager2.wrap(mockRequest);

      const result1 = await wrappedRequest1();
      const result2 = await wrappedRequest2();

      expect(result1).toBe('result');
      expect(result2).toBe('result');
      expect(mockRequest).toHaveBeenCalledTimes(2);
    });
  });
});
