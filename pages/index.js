import { useEffect, useState } from "react";
import Head from 'next/head';
import 'rc-slider/assets/index.css';

import ProductCard from "../components/ProductCard";
import FilterPanel from '../components/FilterPanel';

import styles from '../styles/index.module.css';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 1000]);

  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    fetch("/api/data")
      .then(res => {
        if (!res.ok) throw new Error("Veri sunucusuna bağlanılamadı.");
        return res.json();
      })
      .then(data => {
        // İyileştirme: Fiyatı olmayan ürünlerde hata vermemesi için `|| 0` eklendi.
        const maxPriceFromServer = data.length > 0
          ? Math.max(...data.map(p => p.price || 0)) 
          : 1000;
        
        setProducts(data);
        setFilteredProducts(data);
        setPriceRange([0, maxPriceFromServer]);
        setTempPriceRange([0, maxPriceFromServer]);
        setError(null);
      })
      .catch(err => {
        console.error("Fetch hatası:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles['status-message']}><h1>Ürünler yükleniyor...</h1></div>;
  if (error) return <div className={`${styles['status-message']} ${styles['error']}`}><h1>Hata: {error}</h1></div>;

  return (
    <div className={styles.app}>
      <Head>
        <title>Ürün Listesi | E-Ticaret</title>
        <meta name="description" content="En yeni ürünlerimizi keşfedin." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles['product-list-header']}>
        <h1>Product List</h1>
      </header>
            <main className={styles['main-content']}>
        <aside className={styles['sidebar']}>
            <FilterPanel
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              tempPriceRange={tempPriceRange}
              setTempPriceRange={setTempPriceRange}
              products={products}
              setFilteredProducts={setFilteredProducts}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
            />
        </aside>

        <div className={styles['products-container']}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id || product.name} product={product} />
            ))
          ) : (
            <p className={styles['no-products-message']}>Seçilen filtrelere uygun ürün bulunamadı.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default HomePage;