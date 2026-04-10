import { useQuery } from '@tanstack/react-query';
import { fetchVideoMetadata } from '../services/youtube';

export function useVideoMetadata(urlOrId) {
  return useQuery({
    queryKey: ['yt-metadata', urlOrId],
    queryFn: () => fetchVideoMetadata(urlOrId),
    enabled: !!urlOrId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
