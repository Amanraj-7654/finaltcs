import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';

describe('API Interceptor', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn()
    });
  });

  it('should not add Authorization header if no token is present', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    const config: any = { headers: {} };
    // @ts-ignore
    const result = await api.interceptors.request.handlers[0].fulfilled(config);
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should add Authorization header if token is present', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue('fake-jwt-token');
    const config: any = { headers: {} };
    // @ts-ignore
    const result = await api.interceptors.request.handlers[0].fulfilled(config);
    expect(result.headers.Authorization).toBe('Bearer fake-jwt-token');
  });
});
