'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegisterMutation } from '@/hooks/useAuth';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';
import { Eye, EyeOff, Info } from 'lucide-react';
import clsx from 'clsx';
import Button from '@/components/ui/Button';
import BackLink from '../ui/BackLink';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().min(10, 'Mobile must be at least 10 characters').regex(/^\d+$/, 'Mobile number must contain only digits'),
  email: z.string().email('Please enter a valid business email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  profile: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('professionals');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const registerMutation = useRegisterMutation();

  const onSubmit = (data) => {
    const assignedRole = activeTab === 'professionals' ? 'customer' : 'vendor';

    // Add www. prefix to profile URL if it exists and doesn't already have it
    let profileUrl = data.profile;
    if (profileUrl && profileUrl.trim() !== '') {
      // Remove any existing protocol or www. to avoid duplication
      profileUrl = profileUrl.replace(/^(https?:\/\/)?(www\.)?/, '');
      // Add www. prefix
      profileUrl = 'www.' + profileUrl;
    }

    registerMutation.mutate({ ...data, profile: profileUrl, role: assignedRole });
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between items-center w-full h-[76px] mb-[60px]">
        <BackLink href="/" />
        <Button href="/auth/login">Sign In</Button>
      </div>

      <div className="mb-8">
        <div className="flex w-full gap-1 sm:gap-2 mb-6 p-1 bg-[#f5f0eb] rounded-full">
          <button
            type="button"
            onClick={() => setActiveTab('professionals')}
            className={clsx(
              'flex-1 rounded-full font-medium transition-all whitespace-nowrap py-2 sm:py-2.5 px-2 sm:px-6 text-xs sm:text-sm',
              activeTab === 'professionals' ? 'bg-white text-[#d9a88a] shadow-sm' : 'text-[#718096] hover:text-[#4a5568]'
            )}
          >
            Professionals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('brands')}
            className={clsx(
              'flex-1 rounded-full font-medium transition-all whitespace-nowrap py-2 sm:py-2.5 px-2 sm:px-6 text-xs sm:text-sm',
              activeTab === 'brands' ? 'bg-white text-[#d9a88a] shadow-sm' : 'text-[#718096] hover:text-[#4a5568]'
            )}
          >
            Brands & Retailers
          </button>
        </div>

        <h2 className="text-3xl font-semibold text-[#4a5568] mb-2 px-0 sm:px-10">
          Join as a {activeTab === 'professionals' ? 'Professional' : 'Brand'}
        </h2>
        <p className="text-[#718096] text-base px-0 sm:px-10">
          {activeTab === 'professionals'
            ? "Free membership for architects, designer and contractors."
            : "Connect with professionals and showcase your products."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-0 sm:px-10 pb-8">
        <div>
          <input
            type="text"
            placeholder="Full Name"
            {...register('name')}
            className={clsx(
              'w-full px-4 py-3.5 border rounded-lg text-base text-[#4a5568] placeholder:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#d9a88a] focus:border-transparent transition-all',
              errors.name ? 'border-red-500' : 'border-[#e2e8f0]'
            )}
          />
          {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Mobile Number"
            {...register('mobile')}
            className={clsx(
              'w-full px-4 py-3.5 border rounded-lg text-base text-[#4a5568] placeholder:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#d9a88a] focus:border-transparent transition-all',
              errors.mobile ? 'border-red-500' : 'border-[#e2e8f0]'
            )}
          />
          {errors.mobile && <p className="mt-1.5 text-sm text-red-500">{errors.mobile.message}</p>}
        </div>

        <div>
          <div className="relative">
            <input
              type="email"
              placeholder="Business Email"
              {...register('email')}
              className={clsx(
                'w-full px-4 py-3.5 pr-12 border rounded-lg text-base text-[#4a5568] placeholder:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#d9a88a] focus:border-transparent transition-all',
                errors.email ? 'border-red-500' : 'border-[#e2e8f0]'
              )}
            />
            <Info className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0aec0]" />
          </div>
          {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...register('password')}
                className={clsx(
                  'w-full px-4 py-3.5 pr-12 border rounded-lg text-base text-[#4a5568] placeholder:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#d9a88a] focus:border-transparent transition-all',
                  errors.password ? 'border-red-500' : 'border-[#e2e8f0]'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0aec0] hover:text-[#718096] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                {...register('confirmPassword')}
                className={clsx(
                  'w-full px-4 py-3.5 pr-12 border rounded-lg text-base text-[#4a5568] placeholder:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#d9a88a] focus:border-transparent transition-all',
                  errors.confirmPassword ? 'border-red-500' : 'border-[#e2e8f0]'
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0aec0] hover:text-[#718096] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder="LinkedIn / Portfolio URL"
            {...register('profile')}
            className={clsx(
              'w-full px-4 py-3.5 border rounded-lg text-base text-[#4a5568] placeholder:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#d9a88a] focus:border-transparent transition-all',
              errors.profile ? 'border-red-500' : 'border-[#e2e8f0]'
            )}
          />
          {errors.profile && <p className="mt-1.5 text-sm text-red-500">{errors.profile.message}</p>}
        </div>

        {registerMutation.isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {registerMutation.error.message || 'Registration failed. Please try again.'}
            </p>
          </div>
        )}

        <p className="text-sm text-[#718096]">
          By Clicking "Create Account", You Agree to{' '}
          <Link href="/terms" className="text-[#4a5568] underline hover:text-[#2d3748]">Our Terms of Use</Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-[#4a5568] underline hover:text-[#2d3748]">Privacy Notice</Link>
        </p>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className={clsx(
            'w-full py-3.5 rounded-lg text-base font-medium text-white transition-all',
            registerMutation.isPending ? 'bg-[#d9a88a]/70 cursor-not-allowed' : 'bg-[#d9a88a] hover:bg-[#c99775]'
          )}
        >
          {registerMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <ClipLoader size={18} color="#ffffff" />
              <span>Creating Account...</span>
            </span>
          ) : (
            `Create ${activeTab === 'professionals' ? 'Professional' : 'Brand'} Account`
          )}
        </button>
      </form>
    </div>
  );
}