'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { AuthResponse } from '@/types';
import { User, Lock, LogIn, Eye, EyeOff, Loader2, Gavel } from 'lucide-react';

type FormData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>('/auth/login', data);
      Cookies.set('auction_token', res.data.access_token);
      toast.success(`Bem-vindo de volta, ${data.username}!`);
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Usuário ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
        <div className="bg-white p-8 pb-0 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
            <Gavel className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Bem-vindo</h1>
          <p className="text-gray-500 mt-2 text-sm">Insira suas credenciais para acessar os leilões.</p>
        </div>


        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 ml-1">Usuário</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  {...register('username', { required: true })} 
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.username ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                  }`}
                  placeholder="Seu nome de usuário" 
                />
              </div>
              {errors.username && <span className="text-xs text-red-500 ml-1">O usuário é obrigatório.</span>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 ml-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  {...register('password', { required: true })} 
                  type={showPassword ? "text" : "password"} 
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                  }`}
                  placeholder="••••••••" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-red-500 ml-1">A senha é obrigatória.</span>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <LogIn className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta ainda?{' '}
              <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors">
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}