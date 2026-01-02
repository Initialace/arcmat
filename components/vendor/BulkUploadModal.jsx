'use client';

import { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useProductStore } from '@/store/useProductStore';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '../ui/Toast';
import * as XLSX from 'xlsx';

export default function BulkUploadModal() {
  const { isBulkUploadModalOpen, closeBulkUploadModal } = useUIStore();
  const { addProducts } = useProductStore();
  const { currentVendorId } = useAuthStore();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  if (!isBulkUploadModalOpen) return null;

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validExtensions = ['csv', 'xls', 'xlsx', 'xlsm'];
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      toast.error('Please upload a valid file (CSV, XLS, XLSX, XLSM)');
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      processData(jsonData);
    };
    reader.readAsBinaryString(selectedFile);
  };

  const processData = (data) => {
    const previewRows = [];
    const validItems = [];
    const errors = [];

    data.forEach((row, index) => {
      // 1. Basic Validation Logic
      let status = 'Valid';
      let rowError = null;

      // MAPPING: Handle different column names (Case insensitive / Aliases)
      const name = row['Product Name'] || row['name'] || row['Name'];
      const price = row['Price'] || row['price'];

      // FIX 1: Look for 'stockQuantity' specifically (matches your CSV)
      const stock = row['Stock'] || row['stock'] || row['Quantity'] || row['stockQuantity'];

      const category = row['Category'] || row['category'] || row['categoryId'];
      const mrp = row['MRP'] || row['mrp'];

      // FIX 2: Look for 'image' (lowercase) and split by comma if multiple
      const rawImages = row['Images'] || row['images'] || row['Image'] || row['Image URL'] || row['image'] || '';
      const imageArray = rawImages
        ? rawImages.toString().split(',').map(url => url.trim()).filter(url => url.length > 0)
        : [];

      // Validation
      if (!name) {
        status = 'Error: Missing Name';
        rowError = 'Missing Name';
      } else if (!price || isNaN(price)) {
        status = 'Error: Invalid Price';
        rowError = 'Invalid Price';
      } else if (stock === undefined || isNaN(stock)) {
        status = 'Error: Invalid Stock';
        rowError = 'Invalid Stock';
      }

      // Create Preview Row
      previewRows.push({
        name: name || 'N/A',
        category: category || 'Uncategorized',
        price: price || '0',
        stock: stock || '0',
        imageCount: imageArray.length, // Visual check for user
        status: status,
      });

      // Prepare Valid Item for Store
      if (status === 'Valid') {
        validItems.push({
          name: name,
          description: row['Description'] || row['description'] || '',
          price: parseFloat(price),
          mrp: mrp ? parseFloat(mrp) : parseFloat(price),
          stockQuantity: parseInt(stock),
          categoryId: category ? parseInt(category) : 1, // Default to 1 if missing
          vendorId: currentVendorId,
          tags: row['Tags'] || row['tags'] || '',
          inStock: parseInt(stock) > 0,
          images: imageArray,
        });
      } else {
        errors.push({ row: index + 2, message: rowError });
      }
    });

    setPreview(previewRows);
    setParsedData(validItems);
  };

  const handleUpload = async () => {
    if (parsedData.length === 0) {
      toast.error('No valid products to upload.');
      return;
    }

    setUploading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Add to Store
    addProducts(parsedData);

    // Calculate results
    const total = preview.length;
    const success = parsedData.length;
    const failed = total - success;
    const errorList = preview
      .map((row, idx) => row.status.startsWith('Error') ? { row: idx + 2, message: row.status } : null)
      .filter(Boolean);

    setUploadResult({
      total,
      success,
      failed,
      errors: errorList,
    });

    setUploading(false);

    if (success > 0) {
      toast.success(`Successfully added ${success} products!`);
    } else {
      toast.error('Upload failed. Please check errors.');
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview([]);
    setParsedData([]);
    setUploadResult(null);
    closeBulkUploadModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[150] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            Bulk Upload Products
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {!uploadResult ? (
            <>
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  Upload CSV, XLS, XLSX, or XLSM file
                </p>
                <input
                  type="file"
                  accept=".csv,.xls,.xlsx,.xlsm"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {file && (
                  <p className="mt-2 text-sm text-green-600 font-medium relative z-10">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              {/* Helper Text */}
              <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <p className="font-semibold">Supported Columns:</p>
                <p>Name, Price, Stock (or stockQuantity), Images (or image), Category, Description</p>
              </div>

              {/* Preview Table */}
              {preview.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Preview ({preview.length} rows)
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Images</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {preview.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-900">{row.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{row.price}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{row.stock}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{row.imageCount} found</td>
                            <td className="px-4 py-2 text-sm">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.status.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                }`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Upload Result */
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Complete</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Total: {uploadResult.total} products</p>
                <p className="text-green-600">Success: {uploadResult.success}</p>
                <p className="text-red-600">Failed: {uploadResult.failed}</p>
              </div>

              {uploadResult.errors.length > 0 && (
                <div className="mt-6 text-left bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="text-sm font-semibold text-red-800 mb-2">Errors:</h4>
                  <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                    {uploadResult.errors.map((error, idx) => (
                      <li key={idx}>Row {error.row}: {error.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:border-gray-400 transition-all"
          >
            {uploadResult ? 'Close' : 'Cancel'}
          </button>
          {!uploadResult && parsedData.length > 0 && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 bg-[#d9a88a] text-white rounded-lg hover:bg-[#c99775] disabled:opacity-50 transition-all shadow-sm"
            >
              {uploading ? 'Uploading...' : `Upload ${parsedData.length} Valid Products`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}