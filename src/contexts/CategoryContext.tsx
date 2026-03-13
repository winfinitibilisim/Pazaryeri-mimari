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
        id: 'giyim',
        name: 'Giyim',
        productCount: 15,
        isActive: true,
        productClass: 'Genel Şablon',
        children: [
            { id: 'tisort', name: 'Tişört', productCount: 5, isActive: true, productClass: 'Tişört Şablonu' },
            { id: 'pantolon', name: 'Pantolon', productCount: 10, isActive: true, productClass: 'Genel Şablon' }
        ]
    },
    {
        id: 'elektronik-bilgisayar',
        name: 'Elektronik - Bilgisayar',
        productCount: 8,
        isActive: true,
        productClass: 'Bilgisayar Şablonu'
    },
    {
        id: 'ayakkabi',
        name: 'Ayakkabı',
        productCount: 12,
        isActive: true,
        productClass: 'Ayakkabı Şablonu'
    },
    {
        id: 'spor-outdoor',
        name: 'Spor & Outdoor',
        productCount: 3,
        isActive: true,
        productClass: 'Genel Şablon'
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
