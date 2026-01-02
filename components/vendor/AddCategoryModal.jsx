'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import clsx from 'clsx';

export default function AddCategoryModal({ isOpen, onClose, onAdd }) {
    const [categoryData, setCategoryData] = useState({
        name: '',
        parentPath: '',
        attributes: []
    });
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleAddAttribute = () => {
        setCategoryData(prev => ({
            ...prev,
            attributes: [...prev.attributes, { name: '', type: 'text', required: false }]
        }));
    };

    const handleRemoveAttribute = (index) => {
        setCategoryData(prev => ({
            ...prev,
            attributes: prev.attributes.filter((_, i) => i !== index)
        }));
    };

    const handleAttributeChange = (index, field, value) => {
        setCategoryData(prev => {
            const newAttrs = [...prev.attributes];
            newAttrs[index] = { ...newAttrs[index], [field]: value };
            return { ...prev, attributes: newAttrs };
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!categoryData.name.trim()) newErrors.name = 'Category name is required';

        categoryData.attributes.forEach((attr, idx) => {
            if (!attr.name.trim()) {
                newErrors[`attr_${idx}`] = 'Attribute name is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        // In a real app, this would call an API
        onAdd({
            ...categoryData,
            path: categoryData.parentPath ? `${categoryData.parentPath} > ${categoryData.name}` : categoryData.name
        });

        onClose();
        // Reset form
        setCategoryData({ name: '', parentPath: '', attributes: [] });
    };

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Add New Category</h2>
                        <p className="text-sm text-gray-500 mt-1">Define categories and their default attributes</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Category Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Category Name *</label>
                                <input
                                    type="text"
                                    value={categoryData.name}
                                    onChange={(e) => setCategoryData(prev => ({ ...prev, name: e.target.value }))}
                                    className={clsx(
                                        "w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9a88a] text-gray-900",
                                        errors.name ? "border-red-500" : "border-gray-300"
                                    )}
                                    placeholder="e.g. Laminates"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Parent Category Path</label>
                                <input
                                    type="text"
                                    value={categoryData.parentPath}
                                    onChange={(e) => setCategoryData(prev => ({ ...prev, parentPath: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9a88a] text-gray-900"
                                    placeholder="e.g. Construction > Tiles"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Attribute Definition */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Attribute Definitions</h3>
                            <button
                                type="button"
                                onClick={handleAddAttribute}
                                className="inline-flex items-center gap-1 text-sm text-[#d9a88a] hover:text-[#c99775] font-bold"
                            >
                                <Plus className="w-4 h-4" />
                                Add Attribute Definition
                            </button>
                        </div>

                        {categoryData.attributes.length > 0 ? (
                            <div className="space-y-3">
                                <div className="grid grid-cols-12 gap-3 text-xs font-bold text-gray-500 uppercase px-1">
                                    <div className="col-span-5">Name</div>
                                    <div className="col-span-4">Type</div>
                                    <div className="col-span-2 text-center">Required</div>
                                    <div className="col-span-1"></div>
                                </div>
                                {categoryData.attributes.map((attr, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <div className="col-span-5">
                                            <input
                                                type="text"
                                                value={attr.name}
                                                onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                                                className={clsx(
                                                    "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d9a88a]",
                                                    errors[`attr_${index}`] ? "border-red-500" : "border-gray-300"
                                                )}
                                                placeholder="e.g. Material"
                                            />
                                        </div>
                                        <div className="col-span-4">
                                            <select
                                                value={attr.type}
                                                onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d9a88a]"
                                            >
                                                <option value="text">Text</option>
                                                <option value="number">Number</option>
                                                <option value="select">Dropdown</option>
                                                <option value="multi-select">Multi-Select</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <input
                                                type="checkbox"
                                                checked={attr.required}
                                                onChange={(e) => handleAttributeChange(index, 'required', e.target.checked)}
                                                className="w-4 h-4 rounded text-[#d9a88a] focus:ring-[#d9a88a]"
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAttribute(index)}
                                                className="text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-sm italic">No custom attributes defined for this category.</p>
                                <p className="text-gray-400 text-xs mt-1">Click "Add Attribute Definition" to start</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="px-6 rounded-lg">Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-black text-white hover:bg-zinc-800 px-8 rounded-lg">Create Category</Button>
                </div>
            </div>
        </div>
    );
}
