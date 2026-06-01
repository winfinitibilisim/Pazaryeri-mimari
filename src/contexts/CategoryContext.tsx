import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Category {
    id: string;
    name: string;
    productCount: number;
    isActive: boolean;
    productClass?: string;
    children?: Category[];
}

export interface FlatCategory {
    id: string;
    name: string;
    parentId: string | null;
    path: string;
}

interface CategoryContextType {
    categories: Category[];
    addCategory: (category: Category, parentId?: string | null) => void;
    getCategoryToClassesMap: () => Record<string, string[]>;
    getFlatCategoryNames: () => string[];
    getFlatCategories: () => FlatCategory[];
}

const initialCategories: Category[] = [
    {
        id: 'aksesuar',
        name: 'Aksesuar',
        productCount: 45,
        isActive: true,
        children: [
            { id: 'saat', name: 'Saat', productCount: 15, isActive: true },
            { id: 'gozluk', name: 'Gözlük', productCount: 10, isActive: true },
            { id: 'taki', name: 'Takı & Mücevher', productCount: 20, isActive: true },
        ]
    },
    {
        id: 'anne-bebek',
        name: 'Anne & Bebek & Çocuk',
        productCount: 30,
        isActive: true,
        children: [
            { id: 'bebek-bezi', name: 'Bebek Bezi', productCount: 5, isActive: true },
            { id: 'oyuncak', name: 'Oyuncak', productCount: 25, isActive: true },
        ]
    },
    {
        id: 'giyim',
        name: 'Giyim',
        productCount: 150,
        isActive: true,
        children: [
            { id: 'erkek-giyim', name: 'Erkek', productCount: 70, isActive: true },
            { id: 'kadin-giyim', name: 'Kadın', productCount: 80, isActive: true }
        ]
    },
    {
        id: 'ayakkabi',
        name: 'Ayakkabı',
        productCount: 120,
        isActive: true,
        productClass: 'Ayakkabı Şablonu',
        children: [
            { id: 'spor-ayakkabi', name: 'Spor Ayakkabı', productCount: 50, isActive: true, productClass: 'Ayakkabı Şablonu' },
            { id: 'klasik-ayakkabi', name: 'Klasik Ayakkabı', productCount: 30, isActive: true, productClass: 'Ayakkabı Şablonu' },
            { id: 'bot', name: 'Bot & Çizme', productCount: 40, isActive: true, productClass: 'Ayakkabı Şablonu' }
        ]
    },
    {
        id: 'bahce',
        name: 'Bahçe & Elektrikli El Aletleri',
        productCount: 20,
        isActive: true,
        children: [
            { id: 'matkap', name: 'Matkap', productCount: 5, isActive: true },
            { id: 'bahce-mobilyasi', name: 'Bahçe Mobilyası', productCount: 15, isActive: true }
        ]
    },
    {
        id: 'banyo-yapi',
        name: 'Banyo Yapı & Hırdavat',
        productCount: 15,
        isActive: true
    },
    {
        id: 'ek-hizmetler',
        name: 'Ek Hizmetler',
        productCount: 5,
        isActive: true
    },
    {
        id: 'elektronik',
        name: 'Elektronik',
        productCount: 85,
        isActive: true,
        productClass: 'Bilgisayar Şablonu',
        children: [
            { id: 'bilgisayar', name: 'Bilgisayar', productCount: 35, isActive: true, productClass: 'Bilgisayar Şablonu' },
            { id: 'telefon', name: 'Cep Telefonu', productCount: 40, isActive: true, productClass: 'Bilgisayar Şablonu' },
            { id: 'televizyon', name: 'Televizyon', productCount: 10, isActive: true }
        ]
    },
    {
        id: 'ev-mobilya',
        name: 'Ev & Mobilya',
        productCount: 65,
        isActive: true,
        children: [
            { id: 'oturma-odasi', name: 'Oturma Odası', productCount: 20, isActive: true },
            { id: 'yatak-odasi', name: 'Yatak Odası', productCount: 15, isActive: true },
            { id: 'mutfak', name: 'Mutfak Gereçleri', productCount: 30, isActive: true }
        ]
    }
];

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    const addCategory = (category: Category, parentId?: string | null) => {
        setCategories(prev => {
            if (!parentId) {
                return [...prev, category];
            }

            const addToParent = (cats: Category[]): Category[] => {
                return cats.map(c => {
                    if (c.id === parentId) {
                        return {
                            ...c,
                            children: [...(c.children || []), category]
                        };
                    }
                    if (c.children) {
                        return {
                            ...c,
                            children: addToParent(c.children)
                        };
                    }
                    return c;
                });
            };

            return addToParent(prev);
        });
    };

    const getFlatCategories = () => {
        const flatList: FlatCategory[] = [];
        const extractCats = (cats: Category[], currentPath: string, parentId: string | null) => {
            cats.forEach(c => {
                const path = currentPath ? `${currentPath} > ${c.name}` : c.name;
                flatList.push({ id: c.id, name: c.name, parentId, path });
                if (c.children) extractCats(c.children, path, c.id);
            });
        };
        extractCats(categories, '', null);
        return flatList;
    };

    const getFlatCategoryNames = () => {
        const names: string[] = [];
        const extractNames = (cats: Category[]) => {
            cats.forEach(c => {
                names.push(c.name);
                if (c.children) extractNames(c.children);
            });
        };
        extractNames(categories);
        return names;
    };

    const getCategoryToClassesMap = () => {
        const map: Record<string, string[]> = {};
        const extractMap = (cats: Category[]) => {
            cats.forEach(c => {
                if (c.productClass) {
                    map[c.name] = [c.productClass];
                }
                if (c.children) extractMap(c.children);
            });
        };
        extractMap(categories);
        return map;
    };

    return (
        <CategoryContext.Provider value={{ categories, addCategory, getCategoryToClassesMap, getFlatCategoryNames, getFlatCategories }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error('useCategories must be used within a CategoryProvider');
    }
    return context;
};
