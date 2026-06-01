import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface ReferenceItem {
    id: string;
    name: string;
}

export interface ProductClass {
    id: string;
    name: string;
    options: ReferenceItem[];
    features: ReferenceItem[];
    categories: ReferenceItem[];
    isActive: boolean;
}

interface ProductClassContextProps {
    classes: ProductClass[];
    setClasses: React.Dispatch<React.SetStateAction<ProductClass[]>>;
}

const ProductClassContext = createContext<ProductClassContextProps | undefined>(undefined);

const initialClasses: ProductClass[] = [
    {
        id: 'pc1',
        name: 'Giyim - Üst Giyim (Tişört, Gömlek)',
        isActive: true,
        options: [
            { id: '1', name: 'Renk' },
            { id: '2', name: 'Beden' }
        ],
        features: [
            { id: 'f4', name: 'Kumaş Tipi' }
        ],
        categories: [
            { id: 'giyim', name: 'Giyim' }
        ]
    },
    {
        id: 'pc2',
        name: 'Elektronik - Bilgisayar',
        isActive: true,
        options: [
            { id: '1', name: 'Renk' },
            { id: '4', name: 'RAM Kapasitesi' },
            { id: '5', name: 'Ekran Boyutu' }
        ],
        features: [
            { id: 'f2', name: 'Enerji Sınıfı' },
            { id: 'f5', name: 'Garanti Süresi' },
            { id: 'f6', name: 'Klavye Özellikleri' },
            { id: 'f7', name: 'Çözünürlük Standartı' },
            { id: 'f8', name: 'İşlemci Tipi' }
        ],
        categories: [
            { id: 'elektronik', name: 'Elektronik' },
            { id: 'bilgisayar', name: 'Bilgisayar' },
            { id: 'telefon', name: 'Cep Telefonu' }
        ]
    },
    {
        id: 'pc3',
        name: 'Ayakkabı',
        isActive: true,
        options: [
            { id: '1', name: 'Renk' },
            { id: '3', name: 'Ayakkabı Numarası' },
            { id: '6', name: 'Malzeme' }
        ],
        features: [
            { id: 'f5', name: 'Garanti Süresi' }
        ],
        categories: [
            { id: 'ayakkabi', name: 'Ayakkabı' }
        ]
    }
];

export const ProductClassProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [classes, setClasses] = useState<ProductClass[]>(initialClasses);

    return (
        <ProductClassContext.Provider value={{ classes, setClasses }}>
            {children}
        </ProductClassContext.Provider>
    );
};

export const useProductClasses = (): ProductClassContextProps => {
    const context = useContext(ProductClassContext);
    if (!context) {
        throw new Error('useProductClasses must be used within a ProductClassProvider');
    }
    return context;
};
