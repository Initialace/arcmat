'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Upload } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore';
import { useGetProducts } from '@/hooks/useProduct';
import { useUIStore } from '@/store/useUIStore';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';


// Components
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import VendorProductTable from '@/components/vendor/VendorProductTable';
import BulkActionsBar from '@/components/vendor/BulkActionsBar';
import AttributeCompletionBanner from '@/components/vendor/AttributeCompletionBanner';
import ProductList from '@/app/productlist/page';

// Modals
import ProductFormModal from '@/components/vendor/ProductFormModal';
import BulkUploadModal from '@/components/vendor/BulkUploadModal';

// Product List Page
export default function ProductsListPage() {
  const { user } = useAuthStore();
  const { getPublicProducts } = useProductStore();
  const { openProductFormModal, openBulkUploadModal } = useUIStore();

  const { data: apiResponse, isLoading } = useGetProducts(user?._id || user?.id);
  const apiProducts = apiResponse?.data?.data || [];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-6">Loading...</div>;

  const isVendor = user?.role === 'vendor';
  const productsToDisplay = isVendor ? apiProducts : getPublicProducts();

  return (
    <Container className="py-6 space-y-6">

      {/* Invisible Modals */}
      <ProductFormModal />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isVendor ? 'My Inventory' : 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isVendor
              ? 'Manage your prices, stock, and listings.'
              : 'Browse our latest collection.'}
          </p>
        </div>

        {/* VENDOR ADD BUTTON */}
        {isVendor && (
          <div className="flex gap-3">
            <Button
              onClick={() => openBulkUploadModal()}
              className="flex items-center rounded-full bg-white text-[#e09a74] cursor-pointer hover:bg-gray-50 min-w-[120px] py-2 px-4 border border-[#e09a74] duration-300"
            >
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </Button>
            <Link
              href="/dashboard/products-list/add"
              className="flex items-center rounded-full bg-[#e09a74] text-white cursor-pointer hover:bg-[#d08963] min-w-[120px] py-2 px-4 hover:border-[#e09a74] border hover:text-[#e09a74] hover:bg-white duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </div>
        )}
      </div>

      {/* CONDITIONAL CONTENT */}
      {isVendor ? (
        // --- VENDOR VIEW ---
        <div className="space-y-4">

          <AttributeCompletionBanner />

          {/* 2. TABLE VIEW (Now at the top) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Pass REAL API PRODUCTS */}
            <VendorProductTable products={apiProducts} />
          </div>

        </div>
      ) : (
        // --- USER/PROFESSIONAL VIEW ---
        <div className="space-y-6">
          <ProductFilters />
          <ProductGrid products={productsToDisplay} />
          <ProductList />
        </div>
      )}
    </Container>
  );
}