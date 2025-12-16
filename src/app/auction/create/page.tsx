'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; 
import { Upload, DollarSign, Calendar, Type, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateAuction() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const router = useRouter();

  const file = watch('file');
  
  if (file && file.length > 0 && !imagePreview) {
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file[0]);
  }

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('item', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('expiresAt', data.expiresAt); 
      
      if (data.file && data.file[0]) {
        formData.append('file', data.file[0]); 
      } else {
        toast.error('Por favor, selecione uma imagem.');
        setLoading(false);
        return;
      }

      await api.post('/auction', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Leilão criado com sucesso!');
      router.push('/');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Erro ao criar leilão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a lista
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">Novo Leilão</h1>
            <p className="text-blue-100 mt-1 text-sm">Preencha os dados abaixo para colocar seu item à venda.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Foto do Item</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 hover:border-blue-400 transition-all cursor-pointer relative group">
                <input 
                  type="file" 
                  {...register('file', { required: true })} 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                 
                    if(e.target.files && e.target.files[0]) {
                       const reader = new FileReader();
                       reader.onload = (ev) => setImagePreview(ev.target?.result as string);
                       reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
                
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="mx-auto h-48 object-contain rounded-lg shadow-sm" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <p className="text-white font-medium flex items-center gap-2"><Upload className="w-5 h-5"/> Alterar foto</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <span className="font-medium text-blue-600 hover:text-blue-500">Faça upload de um arquivo</span>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF até 5MB</p>
                    </>
                  )}
                </div>
              </div>
              {errors.file && <span className="text-xs text-red-500">A imagem é obrigatória.</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Item</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Type className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    {...register('title', { required: true })} 
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="Ex: Câmera Antiga 1980" 
                  />
                </div>
                {errors.title && <span className="text-xs text-red-500">O título é obrigatório.</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lance Inicial</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-bold sm:text-sm">R$</span>
                  </div>
                  <input 
                    type="number" 
                    step="0.01"
                    {...register('price', { required: true })} 
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="0,00" 
                  />
                </div>
                {errors.price && <span className="text-xs text-red-500">Defina um preço inicial.</span>}
              </div>

         
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Encerra em</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="datetime-local" 
                    {...register('expiresAt', { required: true })} 
     
                    min={new Date().toISOString().slice(0, 16)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm text-gray-600"
                  />
                </div>
                {errors.expiresAt && <span className="text-xs text-red-500">Defina uma data de fim.</span>}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Detalhada</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea 
                    {...register('description', { required: true })} 
                    rows={4}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="Descreva o estado do item, detalhes técnicos, etc..." 
                  />
                </div>
                {errors.description && <span className="text-xs text-red-500">A descrição é obrigatória.</span>}
              </div>
            </div>


            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Criando Leilão...
                  </>
                ) : (
                  'Publicar Leilão'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}