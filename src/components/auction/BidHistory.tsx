'use client';

import useSWR from 'swr';
import api from '@/lib/api';
import { Bid } from '@/types';
import { History, Clock, User, TrendingUp, Trophy } from 'lucide-react';

interface BidHistoryProps {
  auctionId: string;
}

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function BidHistory({ auctionId }: BidHistoryProps) {
  const { data: bids } = useSWR<Bid[]>(`/auction/${auctionId}/history`, fetcher, {
    refreshInterval: 1000,
  });

  const sortedBids = bids ? [...bids] : []; 

  return (
    <div className="mt-6 bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          <h4 className="font-bold text-gray-800">Histórico de Lances</h4>
        </div>
        {bids && bids.length > 0 && (
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
            {bids.length} lances
          </span>
        )}
      </div>

      <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {!sortedBids || sortedBids.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-3">
            <TrendingUp className="w-10 h-10 opacity-20" />
            <p className="text-sm font-medium">Nenhum lance registrado ainda.</p>
            <p className="text-xs">Seja o primeiro a participar!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {sortedBids.map((bid, index) => {
              const isTopBid = index === 0;
              
              return (
                <li 
                  key={bid._id} 
                  className={`flex items-center justify-between p-4 transition-colors hover:bg-gray-50 ${isTopBid ? 'bg-yellow-50/50 hover:bg-yellow-50' : ''}`}
                >
                  <div className="flex items-center gap-3">

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isTopBid ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>
                      {isTopBid ? <Trophy className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    
                    <div className="flex flex-col">
                      <span className={`text-sm font-semibold ${isTopBid ? 'text-gray-900' : 'text-gray-700'}`}>
                        {bid.bidder}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(bid.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`block font-bold ${isTopBid ? 'text-green-600 text-lg' : 'text-gray-600 text-sm'}`}>
                      R$ {bid.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    {isTopBid && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-600">
                        Líder
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}