import { renderHook } from '@testing-library/react-hooks';
import useS3Files from './useS3Files';
import config from '../../config';

// Mock the global fetch function
global.fetch = jest.fn();

describe('useS3Files hook', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch files successfully', async () => {
    const mockFiles = [
      { key: 'file1.js', size: 123, lastModified: '2023-05-01' },
      { key: 'file2.js', size: 456, lastModified: '2023-05-02' }
    ];
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ files: mockFiles })
    });

    const { result } = renderHook(() => useS3Files('mock-token'));
    const files = await result.current.fetchFiles();
    
    expect(global.fetch).toHaveBeenCalledWith(
      `${config.apiUrl}/api/s3-files`,
      {
        method: 'GET',
        headers: { Authorization: 'mock-token' }
      }
    );
    
    expect(files).toEqual(mockFiles);
  });

  it('should return empty array when response is not ok', async () => {
    // Mock a failed API response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    });

    const { result } = renderHook(() => useS3Files('invalid-token'));
    const files = await result.current.fetchFiles();
    
    expect(files).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });

  it('should return empty array when data.files is not an array', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ files: 'not an array' })
    });

    const { result } = renderHook(() => useS3Files('mock-token'));
    const files = await result.current.fetchFiles();
    
    expect(files).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      'Fetched data is not an array:',
      { files: 'not an array' }
    );
  });

  it('should return empty array when fetch throws an error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useS3Files('mock-token'));
    const files = await result.current.fetchFiles();
    
    expect(files).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching files:',
      expect.any(Error)
    );
  });

  it('should return empty array when json parsing fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => { throw new Error('Invalid JSON'); }
    });

    const { result } = renderHook(() => useS3Files('mock-token'));
    const files = await result.current.fetchFiles();
    
    expect(files).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });
});
