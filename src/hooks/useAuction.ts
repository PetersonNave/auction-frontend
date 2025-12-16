import useSWR from 'swr';
import api from '@/lib/api';
import { AuctionState } from '@/types';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useAuctionState(auctionId: string) {
  const { data, error, mutate } = useSWR<AuctionState>(
    `/auction/${auctionId}/state`,
    fetcher,
    {
      refreshInterval: 1000, 
      revalidateOnFocus: true,
    }
  );

  return {
    auctionState: data,
    isLoading: !error && !data,
    isError: error,
    mutate, 
  };
}