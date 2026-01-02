'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import CategoryStats from '@/components/vendor/CategoryStats';
import CategoryTable from '@/components/vendor/CategoryTable';
import AddCategoryModal from '@/components/vendor/AddCategoryModal';
import Button from '@/components/ui/Button';
import { MOCK_PRODUCTS } from '@/lib/mockData/products';
import Container from '@/components/ui/Container';
import { toast } from '@/components/ui/Toast';

export default function CategoriesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Process data: Group products by Category
    const categoryData = useMemo(() => {
        const groups = {};

        MOCK_PRODUCTS.forEach((product) => {
            // Use categoryPath as the unique key for grouping to handle data inconsistencies
            const path = product.categoryPath || 'Uncategorized';

            if (!groups[path]) {
                // Extract the last part of the path as the name
                const parts = path.split(' > ');
                const name = parts[parts.length - 1];

                groups[path] = {
                    categoryId: product.categoryId, // Use the first found ID
                    name: name,
                    path: path,
                    totalProducts: 0,
                    incompleteProducts: 0,
                };
            }

            groups[path].totalProducts += 1;
            if (product.attributeStatus === 'incomplete') {
                groups[path].incompleteProducts += 1;
            }
        });

        return Object.values(groups);
    }, []);

    // Filter based on search
    const filteredCategories = useMemo(() => {
        if (!searchQuery) return categoryData;
        return categoryData.filter((cat) =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cat.path.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [categoryData, searchQuery]);

    // Calculate Overall Stats
    const overallStats = useMemo(() => {
        return categoryData.reduce(
            (acc, cat) => {
                acc.totalCategories += 1;
                acc.totalProducts += cat.totalProducts;
                acc.incompleteProducts += cat.incompleteProducts;
                return acc;
            },
            { totalCategories: 0, totalProducts: 0, incompleteProducts: 0 }
        );
    }, [categoryData]);

    return (
        <Container className="py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your product categories and attribute completion.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                    {/* Search Input */}
                    <div className="relative flex-1 w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-[#C99775] rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C99775] w-full text-black"
                        />
                    </div>

                    {/* Add Button */}
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-black text-white hover:bg-gray-800 px-4 py-2 w-full sm:w-auto flex justify-center items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                    </Button>
                </div>

            </div>

            {/* Stats Summary */}
            <CategoryStats stats={overallStats} />

            {/* Categories Table */}
            <CategoryTable categories={filteredCategories} />

            {/* Add Category Modal */}
            <AddCategoryModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={(data) => {
                    console.log('New Category Data:', data);
                    toast.success(`Category "${data.name}" added successfully!`);
                    // In a real app, we would update the list here
                }}
            />
        </Container>
    );
}