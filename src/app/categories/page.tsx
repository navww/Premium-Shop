'use client';

import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableCartItem from '@/components/DraggableCartItem';
import DroppableCart from '@/components/DroppableCart';
import SkeletonLoader from '@/components/SkeletonLoader';
import './categories.css';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface Category {
  id: string;
  name: string;
  products: Product[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const allProducts: Product[] = await response.json();
        
        // Group products by category
        const groupedProducts = allProducts.reduce<{ [key: string]: Product[] }>(
          (acc, product) => {
            const category = product.category;
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(product);
            return acc;
          },
          {}
        );

        // Convert to array format
        const categoriesArray = Object.entries(groupedProducts).map(
          ([name, products]) => ({
            id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            name,
            products,
          })
        );

        setCategories(categoriesArray);
        if (categoriesArray.length > 0) {
          setSelectedCategory(categoriesArray[0].id);
          setProducts(categoriesArray[0].products);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setProducts(category.products);
    }
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 900px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return (
      <div className="categories-container">
        <div className="categories-sidebar">
          <SkeletonLoader type="product" count={5} />
        </div>
        <div className="products-grid">
          <SkeletonLoader type="product" count={8} />
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="categories-container">
        <aside className="categories-sidebar">
          <h2>Categories</h2>
          <div className="categories-list">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-button ${
                  selectedCategory === category.id ? 'active' : ''
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
                <span className="product-count">{category.products.length}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="category-content">
          <div className="products-grid">
            {products.map((product) => (
              <DraggableCartItem key={product.id} product={product} />
            ))}
          </div>
        </main>

        {!isMobile && <DroppableCart />}
      </div>
    </DndProvider>
  );
}
