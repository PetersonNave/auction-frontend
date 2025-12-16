import api from '@/lib/api';
import { Auction } from '@/types';
import BidSection from '@/components/auction/BidSection';
import BidHistory from '@/components/auction/BidHistory';
import { Clock, User, FileText, CalendarDays, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

async function getAuction(id: string): Promise<Auction> {
  const res = await api.get(`/auction/${id}`); 
  return res.data;
}

export default async function AuctionPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const auction = await getAuction(id);
  const item = auction.item as any; 
  const ownerName = (auction.owner as any)?.displayName || (auction.owner as any)?.username || 'Vendedor Desconhecido';

  const endDate = new Date(auction.expiresAt);
  const formattedDate = endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const formattedTime = endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-7 space-y-8">

            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 group">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span className="text-sm">Sem imagem disponível</span>
                  </div>
                )}

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-500" /> Verificado
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                {item.title}
              </h1>

              <div className="flex items-center gap-4 py-4 border-y border-gray-100 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Vendido por</p>
                  <p className="text-sm font-semibold text-gray-900">{ownerName}</p>
                </div>
              </div>

              <div className="prose prose-blue max-w-none text-gray-600">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  Descrição do Item
                </h3>
                <p className="leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
          
            <BidSection 
              auctionId={auction._id} 
              initialPrice={auction.price} 
              owner={auction.owner} 
            />

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex flex-col gap-3">
              <h3 className="font-bold text-blue-900 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Encerramento
              </h3>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                 <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{formattedDate}</span>
                 </div>
                 <div className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    às {formattedTime}
                 </div>
              </div>
              <p className="text-xs text-blue-600/80 text-center mt-1">
                Lances feitos nos últimos segundos podem estender o tempo.
              </p>
            </div>

            <BidHistory auctionId={auction._id} />
          </div>

        </div>
      </div>
    </div>
  );
}