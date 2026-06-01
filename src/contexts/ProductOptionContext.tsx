import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface ReferenceItem {
    id: string;
    name: string;
}

export type DisplayType = 'color' | 'dropdown' | 'radio' | 'text';

export interface OptionValue {
    id: string;
    name: string;
    colorCode?: string;
}

export interface ProductOption {
    id: string;
    name: string;
    displayType: DisplayType;
    values: OptionValue[];
    isActive: boolean;
    isRequired?: boolean;
    hasSizeChart?: boolean;
}

const initialOptions: ProductOption[] = [
    {
        id: '1',
        name: 'Renk',
        displayType: 'color',
        isActive: true,
        isRequired: false,
        values: [
            { id: 'v1', name: 'Kırmızı', colorCode: '#FF0000' },
            { id: 'v2', name: 'Mavi', colorCode: '#0000FF' },
            { id: 'v3', name: 'Siyah', colorCode: '#000000' },
            { id: 'v4', name: 'Beyaz', colorCode: '#FFFFFF' }
        ]
    },
    {
        id: '2',
        name: 'Beden',
        displayType: 'dropdown',
        isActive: true,
        isRequired: false,
        hasSizeChart: true,
        values: [
            { id: 'v5', name: 'S' },
            { id: 'v6', name: 'M' },
            { id: 'v7', name: 'L' },
            { id: 'v8', name: 'XL' },
            { id: 'v9', name: 'XXL' }
        ]
    },
    {
        id: '3',
        name: 'Ayakkabı Numarası',
        displayType: 'radio',
        isActive: true,
        isRequired: false,
        values: [
            { id: 'v10', name: '36' },
            { id: 'v11', name: '37' },
            { id: 'v12', name: '38' },
            { id: 'v13', name: '39' },
            { id: 'v14', name: '40' },
            { id: 'v15', name: '41' },
            { id: 'v16', name: '42' },
            { id: 'v17', name: '43' },
            { id: 'v18', name: '44' }
        ]
    },
    {
        id: '4',
        name: 'RAM Kapasitesi',
        displayType: 'radio',
        isActive: true,
        isRequired: false,
        values: [
            { id: 'v1', name: '4 GB' },
            { id: 'v2', name: '8 GB' },
            { id: 'v3', name: '16 GB' },
            { id: 'v4', name: '32 GB' }
        ]
    },
    {
        id: '5',
        name: 'Ekran Boyutu',
        displayType: 'radio',
        isActive: true,
        isRequired: false,
        values: [
            { id: 'v10', name: '13 inç' },
            { id: 'v11', name: '14 inç' },
            { id: 'v12', name: '15.6 inç' },
            { id: 'v13', name: '17 inç' }
        ]
    },
    {
        id: '6',
        name: 'Malzeme',
        displayType: 'text',
        isActive: false,
        isRequired: false,
        values: [
            { id: 'v19', name: 'Pamuk' },
            { id: 'v20', name: 'Polyester' },
            { id: 'v21', name: 'Deri' },
            { id: 'v22', name: 'Keten' }
        ]
    }
];

interface ProductOptionContextType {
    options: ProductOption[];
    setOptions: React.Dispatch<React.SetStateAction<ProductOption[]>>;
}

const ProductOptionContext = createContext<ProductOptionContextType | undefined>(undefined);

export const ProductOptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [options, setOptions] = useState<ProductOption[]>(initialOptions);

    return (
        <ProductOptionContext.Provider value={{ options, setOptions }}>
            {children}
        </ProductOptionContext.Provider>
    );
};

export const useProductOptions = () => {
    const context = useContext(ProductOptionContext);
    if (!context) {
        throw new Error('useProductOptions must be used within a ProductOptionProvider');
    }
    return context;
};
