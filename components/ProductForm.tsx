
import React, { useState } from 'react';

interface ProductFormProps {
  onSubmit: (urls: string[], category: string) => void;
  isLoading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, isLoading }) => {
  const [urls, setUrls] = useState<string[]>(['']);
  const [category, setCategory] = useState('');

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, '']);
    }
  };

  const removeUrl = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls.length > 0 ? newUrls : ['']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredUrls = urls.filter(u => u.trim() !== '');
    if (filteredUrls.length === 0 || !category) return;
    onSubmit(filteredUrls, category);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
            Product Category / Niche
          </label>
          <input
            type="text"
            placeholder="e.g., Ergonomic Office Chairs, Gaming Laptops, Organic Skincare"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
              Competitor Product URLs
            </label>
            <span className="text-xs text-gray-400">{urls.length}/5 URLs</span>
          </div>
          
          <div className="space-y-3">
            {urls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://competitor.com/product-a"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  required
                />
                {urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUrl(index)}
                    className="px-4 py-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addUrl}
            disabled={urls.length >= 5}
            className="mt-4 flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
          >
            <i className="fas fa-plus mr-2"></i> Add Another URL
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 transform hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-circle-notch fa-spin mr-2"></i> Analyzing Markets...
            </span>
          ) : (
            'Generate Research & Assets'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
