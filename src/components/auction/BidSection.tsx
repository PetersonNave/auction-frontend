'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuctionState } from '@/hooks/useAuction';
import api, { getCurrentUser } from '@/lib/api';
import { toast } from 'react-toastify';
import ConfirmModal from '../ui/ConfirmModal';
import InfoModal from '../ui/InfoModal';
import { Gavel, DollarSign, Trophy, Lock, AlertCircle } from 'lucide-react';

interface BidSectionProps {
  auctionId: string;
  initialPrice?: number;
  owner?: any;
}

export default function BidSection({ auctionId, owner }: BidSectionProps) {
  const { auctionState, mutate } = useAuctionState(auctionId);
  const [bidAmount, setBidAmount] = useState<number | ''>(''); 
  const [loading, setLoading] = useState(false);

  const currentPrice = auctionState?.price || 0;
  const currentVersion = auctionState?.__v || 0;
  const highestBidder = auctionState?.highestBidder || 'Ninguém';
  const isClosed = auctionState?.isClosed;

  const handleBid = async () => {
    const value = Number(bidAmount);
    if (!value || value <= currentPrice) {
      toast.error('O lance deve ser maior que o preço atual!');
      return;
    }

    try {
      setLoading(true);
      
      await api.post(`/auction/${auctionId}/bid`, {
        amount: value,
        currentVersion: currentVersion,
      });

      toast.success('Lance registrado com sucesso!');
      setBidAmount(''); 
      mutate();

    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.warn('Alguém deu um lance antes de você! Atualizando...');
        mutate();
      } else {
        toast.error(error.response?.data?.message || 'Erro ao dar lance');
      }
    } finally {
      setLoading(false);
    }
  };

  const currentUser = getCurrentUser();
  const ownerId = typeof owner === 'string' ? owner : owner?._id || owner?.id;
  const isOwner = !!currentUser && !!ownerId && currentUser.id === ownerId;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const handleClose = async () => {
    try {
      setLoading(true);
      setConfirmOpen(false);
      await api.patch(`/auction/${auctionId}/close`);
      toast.success('Leilão encerrado com sucesso');
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao encerrar leilão');
    } finally {
      setLoading(false);
    }
  };

  const prevIsClosed = useRef<boolean | undefined>(auctionState?.isClosed);
  useEffect(() => {
    if (prevIsClosed.current === undefined) {
      prevIsClosed.current = auctionState?.isClosed;
      return;
    }
    if (!prevIsClosed.current && auctionState?.isClosed) {
      setEndOpen(true);
    }
    prevIsClosed.current = auctionState?.isClosed;
  }, [auctionState?.isClosed]);

  const isWinning = !!currentUser && highestBidder === (currentUser.displayName || currentUser.username);

  return (
    <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
      
      <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Preço Atual
          </span>
          <h2 className="text-5xl font-extrabold text-gray-800 mt-1 tracking-tight">
            <span className="text-2xl text-gray-500 font-medium align-top mr-1">R$</span>
            {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${isClosed ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
          {isClosed ? <Lock className="w-4 h-4"/> : <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>}
          {isClosed ? 'Encerrado' : 'Em andamento'}
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${isWinning ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
          <div className={`p-2 rounded-full ${isWinning ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Maior Lance</p>
            <p className={`font-bold ${isWinning ? 'text-blue-700' : 'text-gray-700'}`}>
              {highestBidder} {isWinning && '(Você)'}
            </p>
          </div>
        </div>

        {isClosed ? (
          <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-500 flex flex-col items-center gap-2">
            <Lock className="w-8 h-8 opacity-20" />
            <span className="font-medium">Este leilão não aceita mais lances.</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm font-bold">R$</span>
              </div>
              <input
                type="number"
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                placeholder={`Mínimo: ${(currentPrice + 1).toLocaleString('pt-BR')}`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value === '' ? '' : Number(e.target.value))}
                disabled={loading}
              />
            </div>

            <div className="flex gap-3">
              <button
                style={{cursor: "pointer"}}
                onClick={handleBid}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Gavel className="w-5 h-5" />
                    Dar Lance
                  </>
                )}
              </button>

              {isOwner && (
                <button
                  onClick={() => setConfirmOpen(true)}
                  disabled={loading}
                  className="px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 focus:ring-4 focus:ring-red-100 transition-all font-medium flex items-center gap-2"
                  title="Encerrar Leilão"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="hidden sm:inline">Encerrar</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modais (Mantidos funcionais) */}
      <ConfirmModal
        open={confirmOpen}
        title="Encerrar leilão"
        description="Tem certeza que deseja encerrar este leilão? O maior lance será declarado vencedor."
        confirmLabel="Encerrar Agora"
        cancelLabel="Cancelar"
        onConfirm={handleClose}
        onCancel={() => setConfirmOpen(false)}
      />

      {(() => {
        const cu = getCurrentUser();
        const isWinner = !!cu && (!!auctionState?.highestBidder && (auctionState.highestBidder === cu.displayName || auctionState.highestBidder === cu.username));
        return (
          <InfoModal
            open={endOpen}
            title={isWinner ? 'Parabéns! Você venceu' : 'Leilão Encerrado'}
            description={auctionState?.highestBidder ? `Vencedor: ${auctionState.highestBidder} — Preço final: R$ ${auctionState.price?.toLocaleString('pt-BR')}` : 'Leilão encerrado sem lances.'}
            onClose={() => setEndOpen(false)}
          />
        );
      })()}
    </div>
  );
}