'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { User, UserCircle, Lock, Eye, EyeOff, Loader2, UserPlus, ArrowRight } from 'lucide-react';

type FormData = {
  username: string;
  displayName: string;
  password: string;
  passwordConfirm?: string;
};

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.passwordConfirm) {
      toast.error('As senhas não coincidem!');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        username: data.username,
        password: data.password,
        displayName: data.displayName,
      });
      toast.success('Cadastro realizado com sucesso! Faça login.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="bg-white p-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Criar Conta</h1>
          <p className="text-gray-500 mt-2 text-sm">Preencha os dados abaixo para começar a dar lances.</p>
        </div>

        <div className="p-8 pt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 ml-1 mb-1">Nome Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircle className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  {...register('displayName', { required: true })} 
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${errors.displayName ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Ex: João da Silva" 
                />
              </div>
              {errors.displayName && <span className="text-xs text-red-500 ml-1">Nome é obrigatório.</span>}
            </div>

   
            <div>
              <label className="block text-sm font-medium text-gray-700 ml-1 mb-1">Nome de Usuário</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  {...register('username', { required: true })} 
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${errors.username ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Ex: joaosilva99" 
                />
              </div>
              {errors.username && <span className="text-xs text-red-500 ml-1">Usuário é obrigatório.</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 ml-1 mb-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  {...register('password', { required: true })} 
                  type={showPassword ? "text" : "password"} 
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
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
              {errors.password && <span className="text-xs text-red-500 ml-1">Crie uma senha.</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 ml-1 mb-1">Confirmar Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  {...register('passwordConfirm', { required: true })} 
                  type={showPassword ? "text" : "password"} 
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${errors.passwordConfirm ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="••••••••" 
                />
              </div>
              {errors.passwordConfirm && <span className="text-xs text-red-500 ml-1">Confirme a senha.</span>}
            </div>


            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Criando conta...
                </>
              ) : (
                'Finalizar Cadastro'
              )}
            </button>
          </form>


          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600 flex justify-center items-center gap-1">
              Já possui uma conta?
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors inline-flex items-center gap-1">
                Fazer Login <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}