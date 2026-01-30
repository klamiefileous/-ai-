
export interface ProductExtraction {
  name: string;
  price: string;
  description: string;
  features: string[];
  dimensions: string;
  weight: string;
  inventoryStatus: string;
  url: string;
}

export interface GeneratedCopy {
  seoTitle: string;
  seoSubtitle: string;
  briefDescription: string;
  detailedDescription: string;
  keywords: string[];
  targetAudience: string;
  sellingPoints: string[];
}

export interface AnalysisResult {
  extractions: ProductExtraction[];
  finalCopy: GeneratedCopy;
  imageUrl?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  EXTRACTING = 'EXTRACTING',
  GENERATING_COPY = 'GENERATING_COPY',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
