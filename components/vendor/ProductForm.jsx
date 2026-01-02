'use client';

import { useState, useMemo, useEffect } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { PRODUCT_CATEGORIES } from '@/lib/mockData/productCategories';
import { toast } from '@/components/ui/Toast';
import clsx from 'clsx';

export default function ProductForm({ product = null, onSuccess }) {
  const { addProduct, updateProduct } = useProductStore();
  const { currentVendorId } = useAuthStore();
  const { closeProductFormModal, openBulkUploadModal } = useUIStore();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(() => {
    const attrs = product?.attributes || {};
    const dynamicAttributes = Object.entries(attrs).map(([key, value]) => ({ key, value }));

    return {
      // Classification
      categoryId: product?.categoryId || '',
      subCategoryId: product?.subCategoryId || '',
      subSubCategoryName: product?.subSubCategoryName || '',
      // Product Identity
      name: product?.name || '',
      sku: product?.id ? `PRD-${product.id.toString().padStart(3, '0')}` : '',
      slug: product?.slug || '',
      // Pricing
      price: product?.price || '',
      mrp: product?.mrp || '',
      stockQuantity: product?.stockQuantity || '',
      // Description
      description: product?.description || '',
      tags: '',
      // Other
      attributes: attrs,
      dynamicAttributes: dynamicAttributes.length > 0 ? dynamicAttributes : [],
      images: product?.images || [],
      variants: product?.variants || [],
    };
  });

  const [imageUrls, setImageUrls] = useState(product?.images || ['']);
  const [errors, setErrors] = useState({});

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !product) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, product]);

  // Derived states for cascading dropdowns
  const subCategoryOptions = useMemo(() => {
    if (!formData.categoryId) return [];
    const category = PRODUCT_CATEGORIES.find(c => c.id === parseInt(formData.categoryId));
    return category?.subCategories || [];
  }, [formData.categoryId]);

  const subSubCategoryOptions = useMemo(() => {
    if (!formData.subCategoryId) return [];
    const subCategory = subCategoryOptions.find(sc => sc.id === parseInt(formData.subCategoryId));
    return subCategory?.subSubCategories || [];
  }, [formData.subCategoryId, subCategoryOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      categoryId: val,
      subCategoryId: '',
      subSubCategoryName: ''
    }));
    if (errors.categoryId) setErrors(prev => ({ ...prev, categoryId: null }));
  };

  const handleSubCategoryChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      subCategoryId: val,
      subSubCategoryName: ''
    }));
    if (errors.subCategoryId) setErrors(prev => ({ ...prev, subCategoryId: null }));
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
    setFormData((prev) => ({ ...prev, images: newUrls.filter(url => url.trim()) }));
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    setFormData((prev) => ({ ...prev, images: newUrls.filter(url => url.trim()) }));
  };

  // Variants handlers
  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { type: 'Color', value: '', price: '', stock: '', sku: '' }]
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (formData.categoryId && subCategoryOptions.length > 0 && !formData.subCategoryId) {
      newErrors.subCategoryId = 'Sub-category is required';
    }
    if (formData.subCategoryId && subSubCategoryOptions.length > 0 && !formData.subSubCategoryName) {
      newErrors.subSubCategoryName = 'Sub-sub-category is required';
    }
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stockQuantity || formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Valid stock quantity is required';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Construct categoryPath
    const category = PRODUCT_CATEGORIES.find(c => c.id === parseInt(formData.categoryId));
    const subCategory = category?.subCategories.find(sc => sc.id === parseInt(formData.subCategoryId));
    const categoryPath = [category?.name, subCategory?.name, formData.subSubCategoryName]
      .filter(Boolean)
      .join(' > ');

    const productData = {
      ...formData,
      categoryPath,
      price: parseFloat(formData.price),
      mrp: formData.mrp ? parseFloat(formData.mrp) : parseFloat(formData.price),
      categoryId: parseInt(formData.categoryId),
      subCategoryId: formData.subCategoryId ? parseInt(formData.subCategoryId) : null,
      subSubCategoryName: formData.subSubCategoryName,
      stockQuantity: parseInt(formData.stockQuantity),
      vendorId: currentVendorId,
      inStock: parseInt(formData.stockQuantity) > 0,
      images: imageUrls.filter(url => url.trim()),
      attributes: (formData.dynamicAttributes || []).reduce((acc, attr) => {
        if (attr.key.trim()) {
          acc[attr.key.trim()] = attr.value;
        }
        return acc;
      }, {}),
      variants: formData.variants.map(v => ({
        ...v,
        price: v.price ? parseFloat(v.price) : 0,
        stock: v.stock ? parseInt(v.stock) : 0
      }))
    };

    if (product) {
      updateProduct(product.id, productData);
      toast.success('Product updated successfully!');
    } else {
      addProduct(productData);
      toast.success('Product added successfully! It is now live.');
    }

    setLoading(false);
    closeProductFormModal();
    if (onSuccess) onSuccess();
  };

  // Section Header Component
  const SectionHeader = ({ title, subtitle }) => (
    <div className="border-b border-gray-200 pb-2 mb-4">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: ACTIONS
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            closeProductFormModal();
            openBulkUploadModal();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#d9a88a] text-[#d9a88a] rounded-lg hover:bg-[#d9a88a] hover:text-white transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Bulk Upload CSV/Excel
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: CLASSIFICATION
      ═══════════════════════════════════════════════════════════════════ */}
      <div>
        <SectionHeader title="Classification" subtitle="Select product category" />
        <div className="grid grid-cols-3 gap-4">
          {/* Level 1: Category */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Category *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleCategoryChange}
              className={clsx(
                'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9a88a] text-gray-900',
                errors.categoryId ? 'border-red-500' : 'border-gray-300'
              )}
            >
              <option value="">Select Category</option>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1.5 text-sm text-red-500">{errors.categoryId}</p>
            )}
          </div>

          {/* Level 2: Sub-Category */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Sub-Category
            </label>
            <select
              name="subCategoryId"
              value={formData.subCategoryId}
              onChange={handleSubCategoryChange}
              disabled={!formData.categoryId || subCategoryOptions.length === 0}
              className={clsx(
                'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9a88a] text-gray-900 disabled:bg-gray-100 disabled:text-gray-500',
                errors.subCategoryId ? 'border-red-500' : 'border-gray-300'
              )}
            >
              <option value="">Select Sub-Category</option>
              {subCategoryOptions.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
            {errors.subCategoryId && (
              <p className="mt-1.5 text-sm text-red-500">{errors.subCategoryId}</p>
            )}
          </div>

          {/* Level 3: Sub-Sub-Category */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Sub-Sub-Category
            </label>
            <select
              name="subSubCategoryName"
              value={formData.subSubCategoryName}
              onChange={handleChange}
              disabled={!formData.subCategoryId || subSubCategoryOptions.length === 0}
              className={clsx(
                'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9a88a] text-gray-900 disabled:bg-gray-100 disabled:text-gray-500',
                errors.subSubCategoryName ? 'border-red-500' : 'border-gray-300'
              )}
            >
              <option value="">Select Type</option>
              {subSubCategoryOptions.map((subSub) => (
                <option key={subSub} value={subSub}>
                  {subSub}
                </option>
              ))}
            </select>
            {errors.subSubCategoryName && (
              <p className="mt-1.5 text-sm text-red-500">{errors.subSubCategoryName}</p>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: PRODUCT IDENTITY
      ═══════════════════════════════════════════════════════════════════ */}
      <div>
        <SectionHeader title="Product Identity" subtitle="Basic product information" />
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={clsx(
                'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9a88a] text-gray-900 placeholder:text-gray-400',
                errors.name ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="Enter product name"
            />
            {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              placeholder="Auto-generated"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              placeholder="Auto-generated from name"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: PRICING
      ═══════════════════════════════════════════════════════════════════ */}
      <div>
        <SectionHeader title="Pricing" subtitle="Set your product prices and stock" />
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Selling Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={clsx(
                'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9a88a] text-gray-900 placeholder:text-gray-400',
                errors.price ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="0.00"
            />
            {errors.price && <p className="mt-1.5 text-sm text-red-500">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              MRP (₹)
            </label>
            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9a88a] text-gray-900 placeholder:text-gray-400"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              min="0"
              className={clsx(
                'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9a88a] text-gray-900 placeholder:text-gray-400',
                errors.stockQuantity ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="0"
            />
            {errors.stockQuantity && (
              <p className="mt-1.5 text-sm text-red-500">{errors.stockQuantity}</p>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: ATTRIBUTES
      ═══════════════════════════════════════════════════════════════════ */}
      <div>
        <SectionHeader title="Attributes" subtitle="Product specifications and details" />

        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-bold text-gray-800">
            Custom Attributes
          </label>
          <button
            type="button"
            onClick={() => {
              const newAttrs = [...(formData.dynamicAttributes || [])];
              newAttrs.push({ key: '', value: '' });
              setFormData(prev => ({ ...prev, dynamicAttributes: newAttrs }));
            }}
            className="inline-flex items-center gap-1 text-sm text-[#d9a88a] hover:text-[#c99775] font-bold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Attribute
          </button>
        </div>

        {(formData.dynamicAttributes || []).length > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase">
              <div className="col-span-5">Attribute Name</div>
              <div className="col-span-6">Value</div>
            </div>
            {(formData.dynamicAttributes || []).map((attr, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5">
                  <input
                    type="text"
                    value={attr.key}
                    onChange={(e) => {
                      const newAttrs = [...formData.dynamicAttributes];
                      newAttrs[index].key = e.target.value;
                      setFormData(prev => ({ ...prev, dynamicAttributes: newAttrs }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d9a88a]"
                    placeholder="e.g. Material"
                  />
                </div>
                <div className="col-span-6">
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => {
                      const newAttrs = [...formData.dynamicAttributes];
                      newAttrs[index].value = e.target.value;
                      setFormData(prev => ({ ...prev, dynamicAttributes: newAttrs }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d9a88a]"
                    placeholder="Value"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => {
                      const newAttrs = formData.dynamicAttributes.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, dynamicAttributes: newAttrs }));
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500 text-sm">
            No custom attributes added.
          </div>
        )}

        {/* Variants Sub-Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-bold text-gray-800">
              Product Variants
            </label>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-1 text-sm text-[#d9a88a] hover:text-[#c99775] font-bold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Variant
            </button>
          </div>

          {formData.variants.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 uppercase">
                <div className="col-span-3">Type</div>
                <div className="col-span-3">Value</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Stock</div>
                <div className="col-span-2">SKU</div>
              </div>
              {formData.variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-start relative">
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={variant.type}
                      onChange={(e) => handleVariantChange(index, 'type', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#d9a88a]"
                      placeholder="Type (e.g. Color)"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={variant.value}
                      onChange={(e) => handleVariantChange(index, 'value', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#d9a88a]"
                      placeholder="Value (e.g. Blue)"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#d9a88a]"
                      placeholder="Price"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#d9a88a]"
                      placeholder="Stock"
                    />
                  </div>
                  <div className="col-span-2 flex gap-1">
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#d9a88a]"
                      placeholder="SKU"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">
              No variants added. Click "Add Variant" to create product variations.
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6: DESCRIPTION
      ═══════════════════════════════════════════════════════════════════ */}
      <div>
        <SectionHeader title="Description" subtitle="Product details and media" />

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={clsx(
                'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9a88a] resize-none text-gray-900 placeholder:text-gray-400',
                errors.description ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9a88a] text-gray-900 placeholder:text-gray-400"
              placeholder="modern, wooden, living room, premium, handmade"
            />
          </div>

          {/* Image URLs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-gray-800">
                Image URLs
              </label>
              <button
                type="button"
                onClick={addImageUrl}
                className="inline-flex items-center gap-1 text-sm text-[#d9a88a] hover:text-[#c99775] font-bold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Image
              </button>
            </div>
            <div className="space-y-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9a88a] text-gray-900 placeholder:text-gray-400"
                    placeholder="https://example.com/image.jpg"
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          FORM ACTIONS
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex gap-3 justify-end pt-6 border-t">
        <button
          type="button"
          onClick={closeProductFormModal}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#d9a88a] text-white rounded-lg hover:bg-[#c99775] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}