import React, { createContext, useState, useContext, ReactNode } from 'react';

export type FeatureDisplayType = 'single' | 'multiple' | 'text';

export interface FeatureValue {
    id: string;
    name: string;
}

export interface ProductFeature {
    id: string;
    name: string;
    displayType: FeatureDisplayType;
    values: FeatureValue[];
    isActive: boolean;
    isRequired?: boolean;
}

const initialFeatures: ProductFeature[] = [
    {
        id: 'f2',
        name: 'Enerji Sınıfı',
        displayType: 'single',
        isActive: true,
        isRequired: false,
        values: [
            { id: 'v5', name: 'A+++' },
            { id: 'v6', name: 'A++' },
            { id: 'v7', name: 'A+' },
            { id: 'v8', name: 'A' },
            { id: 'v9', name: 'B' }
        ]
    },
    {
        id: 'f4',
        name: 'Kumaş Tipi',
        displayType: 'multiple',
        isActive: false,
        isRequired: false,
        values: [
            { id: 'v14', name: 'Pamuk' },
            { id: 'v15', name: 'Polyester' },
            { id: 'v16', name: 'Elastan' },
            { id: 'v17', name: 'Viskon' }
        ]
    },
    {
        id: 'f5',
        name: 'Garanti Süresi',
        displayType: 'text',
        isActive: true,
        isRequired: false,
        values: [
            { id: 'v18', name: '1 Yıl' },
            { id: 'v19', name: '2 Yıl' },
            { id: 'v20', name: '3 Yıl' }
        ]
    },
    {
        id: 'f6',
        name: 'Klavye Özellikleri',
        displayType: 'single',
        isActive: true,
        isRequired: false,
        values: [
            { id: 'v21', name: 'Q Türkçe + Numerik (RGB Aydınlatmalı)' },
            { id: 'v22', name: 'F Klavye' },
            { id: 'v23', name: 'Q Türkçe + Numerik (Aydınlatmalı)' }
        ]
    },
    {
        id: 'f7',
        name: 'Çözünürlük Standartı',
        displayType: 'single',
        isActive: true,
        isRequired: false,
        values: [
            { id: 'v24', name: 'Ultra HD 4K (UHD)' },
            { id: 'v25', name: 'Full HD (FHD)' }
        ]
    },
    {
        id: 'f8',
        name: 'İşlemci Tipi',
        displayType: 'single',
        isActive: true,
        isRequired: false,
        values: [
            { id: 'v26', name: 'M2' },
            { id: 'v27', name: 'M3' },
            { id: 'v28', name: 'M4' }
        ]
    }
];

interface ProductFeatureContextType {
    features: ProductFeature[];
    setFeatures: React.Dispatch<React.SetStateAction<ProductFeature[]>>;
}

const ProductFeatureContext = createContext<ProductFeatureContextType | undefined>(undefined);

export const ProductFeatureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [features, setFeatures] = useState<ProductFeature[]>(initialFeatures);

    return (
        <ProductFeatureContext.Provider value={{ features, setFeatures }}>
            {children}
        </ProductFeatureContext.Provider>
    );
};

export const useProductFeatures = () => {
    const context = useContext(ProductFeatureContext);
    if (!context) {
        throw new Error('useProductFeatures must be used within a ProductFeatureProvider');
    }
    return context;
};
