import { renderHook } from '@testing-library/react-hooks';
import { useGetCalls } from '../useGetCalls';
import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';

jest.mock('@clerk/nextjs');
jest.mock('@stream-io/video-react-sdk');

describe('useGetCalls', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
    (useStreamVideoClient as jest.Mock).mockReturnValue({
      queryCalls: jest.fn().mockResolvedValue({
        calls: [
          { id: 'call1', state: { startsAt: '2023-01-01T00:00:00Z' } },
          { id: 'call2', state: { startsAt: '2023-01-02T00:00:00Z' } },
        ],
      }),
    });
  });

  test('fetches calls', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useGetCalls());
    await waitForNextUpdate();
    expect(result.current.endedCalls).toHaveLength(2);
    expect(result.current.endedCalls).toBeDefined();
    expect(result.current.endedCalls![0].id).toBe('call1');
  });

  test('handles loading state', () => {
    const { result } = renderHook(() => useGetCalls());
    expect(result.current.isLoading).toBe(true);
  });
});