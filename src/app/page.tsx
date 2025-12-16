'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Auction } from '@/types';
import { Plus, Gavel, ImageOff, Clock, Search, AlertCircle } from 'lucide-react';


const AuctionSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="pt-4 flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-8 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

export default function Home() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get<Auction[]>('/auction');
        if (mounted) setAuctions(res.data);
      } catch (err: any) {
        if (mounted) setError(err.response?.data?.message || 'Erro ao carregar leilões');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const base = api.defaults.baseURL || '';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Leilões Ativos</h1>
            <p className="text-gray-500 mt-1">Descubra oportunidades únicas e dê seu lance.</p>
          </div>
          
          <Link 
            href="/auction/create" 
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all hover:shadow-lg transform active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Novo Leilão
          </Link>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {loading && Array.from({ length: 8 }).map((_, i) => (
            <AuctionSkeleton key={i} />
          ))}

          {!loading && auctions.slice().reverse().map((a) => {
            const item = typeof a.item === 'string' ? null : a.item;
            const imgUrl = item?.imageUrl 
              ? (item.imageUrl.startsWith('/') || item.imageUrl.startsWith('http') ? item.imageUrl : `${base}${item.imageUrl}`) 
              : null;
            
            const isClosed = a.isClosed;

            return (
              <Link 
                key={a._id} 
                href={`/auction/${a._id}`} 
                className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  {imgUrl ? (
                    <img 
                      src={imgUrl} 
                      alt={item?.title || 'Item'} 
                      className={`object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 ${isClosed ? 'grayscale' : ''}`} 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ImageOff className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-xs font-medium">Sem imagem</span>
                    </div>
                  )}

                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                    isClosed 
                      ? 'bg-gray-800/80 text-white backdrop-blur-md' 
                      : 'bg-green-500/90 text-white backdrop-blur-md flex items-center gap-1'
                  }`}>
                    {isClosed ? 'Encerrado' : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Aberto
                      </>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {item?.title || 'Item sem título'}
                  </h2>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10 leading-relaxed">
                    {item?.description || 'Sem descrição disponível.'}
                  </p>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase">Lance Atual</p>
                      <p className={`text-xl font-bold ${isClosed ? 'text-gray-500 decoration-slice' : 'text-green-600'}`}>
                        R$ {a.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isClosed 
                        ? 'bg-gray-100 text-gray-400' 
                        : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                    }`}>
                      {isClosed ? <Clock className="w-5 h-5"/> : <Gavel className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {!loading && auctions.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">Nenhum leilão encontrado</h3>
            <p className="text-gray-500 mt-2 max-w-md">
              Não há leilões ativos no momento. Que tal ser o primeiro a criar um?
            </p>
            <Link 
              href="/auction/create" 
              className="mt-6 text-blue-600 font-semibold hover:underline"
            >
              Começar a vender agora &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}