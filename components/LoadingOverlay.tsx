
import React from 'react';
import { AppStatus } from '../types';

interface LoadingOverlayProps {
  status: AppStatus;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ status }) => {
  if (status === AppStatus.IDLE || status === AppStatus.COMPLETED || status === AppStatus.ERROR) {
    return null;
  }

  const steps = [
    { key: AppStatus.EXTRACTING, label: 'Scanning Competitors', icon: 'fa-spider' },
    { key: AppStatus.GENERATING_COPY, label: 'Writing Copywriting', icon: 'fa-pen-fancy' },
    { key: AppStatus.GENERATING_IMAGE, label: 'Rendering Visuals', icon: 'fa-wand-magic-sparkles' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-6">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4 animate-bounce">
            <i className={`fas ${steps[currentStepIndex]?.icon || 'fa-brain'} text-3xl`}></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Intelligence Processing</h3>
          <p className="text-gray-500 text-sm">Please wait while our AI builds your product strategy...</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;

            return (
              <div key={idx} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 border-2 transition-colors ${
                  isDone ? 'bg-green-500 border-green-500 text-white' : 
                  isActive ? 'border-indigo-600 text-indigo-600 animate-pulse' : 'border-gray-200 text-gray-300'
                }`}>
                  {isDone ? <i className="fas fa-check text-xs"></i> : <span className="text-xs font-bold">{idx + 1}</span>}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-bold ${isActive ? 'text-gray-900' : isDone ? 'text-gray-500' : 'text-gray-300'}`}>
                    {step.label}
                  </div>
                  {isActive && <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-indigo-600 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
                  </div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
