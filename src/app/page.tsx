'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, fetchProducts } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import './home.css';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Premium Shop</h1>
          <p>Discover our curated collection of premium products</p>
          <Link href="/products" className="cta-button">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="featured">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="product-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-price"></div>
                </div>
              </div>
            ))
          ) : (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
