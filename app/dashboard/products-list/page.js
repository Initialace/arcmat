'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore';
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
  const { getPublicProducts, getVendorProducts } = useProductStore();
  const { openProductFormModal } = useUIStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-6">Loading...</div>;

  const isVendor = user?.role === 'vendor';
  const publicProducts = isVendor ? getVendorProducts(user?.id) : getPublicProducts();

  return (
    <Container className="py-6 space-y-6">

      {/* Invisible Modals */}
      <ProductFormModal />
      <BulkUploadModal />

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
          <Button
            onClick={() => openProductFormModal()}
            className="bg-black text-white hover:bg-gray-800 px-4 py-2 flex items-center max-w-[150px]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {/* CONDITIONAL CONTENT */}
      {isVendor ? (
        // --- VENDOR VIEW ---
        <div className="space-y-4">

          {/* 1. Bulk Bar (Sticky Top) */}
          <BulkActionsBar />

          <AttributeCompletionBanner />

          {/* 2. TABLE VIEW (Now at the top) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <VendorProductTable />
          </div>



        </div>
      ) : (
        // --- USER/PROFESSIONAL VIEW ---
        <div className="space-y-6">
          <ProductFilters />
          <ProductGrid products={publicProducts} />
          <ProductList />
        </div>
      )}
    </Container>
  );
}