
import React from 'react';
import { AnalysisResult } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
  isFinal: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset, isFinal }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Final Listing Section */}
      <section className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Generated Product Listing</h2>
            <p className="text-indigo-100 text-sm">Optimized for Conversion & SEO</p>
          </div>
          <button 
            onClick={() => window.print()} 
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm"
          >
            <i className="fas fa-download mr-2"></i> Export PDF
          </button>
        </div>

        <div className="p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Visuals */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center relative group">
                {result.imageUrl ? (
                  <img src={result.imageUrl} alt="Generated Asset" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                ) : (
                  <div className="text-center p-8">
                    <i className="fas fa-image text-gray-200 text-6xl mb-4"></i>
                    <p className="text-gray-400 font-medium italic">Asset Generation in Progress...</p>
                  </div>
                )}
                {result.imageUrl && (
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full tracking-widest">
                    AI Generated Visual
                  </div>
                )}
              </div>
              <div className="mt-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Suggested Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {result.finalCopy.keywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-100">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                  {result.finalCopy.seoTitle}
                </h1>
                <p className="text-xl text-indigo-600 font-medium">
                  {result.finalCopy.seoSubtitle}
                </p>
              </div>

              <div className="prose prose-indigo max-w-none">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">About this Item</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {result.finalCopy.briefDescription}
                </p>
                
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Detailed Overview</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {result.finalCopy.detailedDescription}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Key Benefits</h3>
                <ul className="space-y-3">
                  {result.finalCopy.sellingPoints.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <i className="fas fa-check text-[10px] text-green-600"></i>
                      </span>
                      <span className="ml-3 text-sm text-gray-600">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Extraction Dashboard */}
      <section>
        <div className="flex items-center space-x-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Competitive Insights</h2>
          <div className="h-px flex-1 bg-gray-200"></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{result.extractions.length} Sources Analyzed</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.extractions.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                  <span className="font-bold text-sm">#{idx + 1}</span>
                </div>
                <span className="text-indigo-600 font-bold text-lg">{item.price}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 truncate" title={item.name}>{item.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">{item.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Dimensions</span>
                  <span className="text-gray-700 font-medium">{item.dimensions}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Inventory</span>
                  <span className="text-gray-700 font-medium">{item.inventoryStatus}</span>
                </div>
              </div>

              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 border border-indigo-100 rounded-lg py-2 transition-colors"
              >
                View Source <i className="fas fa-external-link-alt ml-1"></i>
              </a>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-10">
        <button 
          onClick={onReset}
          className="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
        >
          <i className="fas fa-redo-alt mr-2"></i> Start New Analysis
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
