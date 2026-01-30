
import React, { useState, useCallback } from 'react';
import { GeminiService } from './services/geminiService';
import { ProductExtraction, GeneratedCopy, AnalysisResult, AppStatus } from './types';
import ProductForm from './components/ProductForm';
import ResultDisplay from './components/ResultDisplay';
import LoadingOverlay from './components/LoadingOverlay';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleProcess = async (urls: string[], category: string) => {
    setError(null);
    setResult(null);
    setStatus(AppStatus.EXTRACTING);

    const gemini = new GeminiService();

    try {
      // 1. Extract
      const extractions = await gemini.extractProductInfo(urls, category);
      if (extractions.length === 0) {
        throw new Error("Could not extract information from the provided URLs. Please check if the URLs are valid and public.");
      }

      // 2. Generate Copy
      setStatus(AppStatus.GENERATING_COPY);
      const copy = await gemini.generateCopy(extractions, category);

      // 3. Generate Image
      setStatus(AppStatus.GENERATING_IMAGE);
      let imageUrl: string | undefined;
      try {
        imageUrl = await gemini.generateProductImage(copy);
      } catch (imgErr) {
        console.warn("Image generation failed, continuing with copy only.", imgErr);
      }

      setResult({
        extractions,
        finalCopy: copy,
        imageUrl
      });
      setStatus(AppStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-chart-line text-lg"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">MarketPulse <span className="text-indigo-600">AI</span></h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 hidden sm:inline">Competitive Intelligence Engine</span>
            {status !== AppStatus.IDLE && (
              <button 
                onClick={handleReset}
                className="text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                New Research
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {status === AppStatus.IDLE && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Outsmart your <span className="text-indigo-600">Competition</span>
              </h2>
              <p className="mt-5 text-xl text-gray-500">
                Input competitor URLs. Our AI will analyze their offerings and generate superior SEO-optimized product listings and high-quality visuals for you.
              </p>
            </div>
            <ProductForm onSubmit={handleProcess} isLoading={status !== AppStatus.IDLE} />
          </div>
        )}

        {error && (
          <div className="max-w-3xl mx-auto mt-6">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-circle text-red-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                  <button 
                    onClick={handleReset}
                    className="mt-2 text-sm font-semibold text-red-700 underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {(status === AppStatus.COMPLETED || status === AppStatus.EXTRACTING || status === AppStatus.GENERATING_COPY || status === AppStatus.GENERATING_IMAGE) && result && (
          <ResultDisplay result={result} onReset={handleReset} isFinal={status === AppStatus.COMPLETED} />
        )}

        <LoadingOverlay status={status} />
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t py-4 px-6 text-center text-xs text-gray-400 z-30">
        Powered by Google Gemini 3 Pro & Nano Banana &bull; © 2024 MarketPulse AI
      </footer>
    </div>
  );
};

export default App;
