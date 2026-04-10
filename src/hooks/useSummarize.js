import { useMutation } from '@tanstack/react-query';
import { createSummaryJob } from '../services/openai';

export function useSummarize() {
  return useMutation({
    mutationFn: ({ videoUrl, forceRefresh = false }) =>
      createSummaryJob({ videoUrl, forceRefresh }),
  });
}
