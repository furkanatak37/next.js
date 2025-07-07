import { useState } from "react";
import styles from '../styles/ProductCard.module.css';

const colorMap = {
  yellow: { className: 'color-yellow-gold' },
  rose: { className: 'color-rose-gold' },
  white: { className: 'color-white-gold' },
};

// Yıldızları render eden fonksiyon
function renderStars(score) {
  const stars = [];
  // 1. DEĞİŞİKLİK: 0-1 arasındaki skor 5'lik sisteme çevrildi.
  const scoreOutOfFive = (score || 0) * 5;
  const fullStars = Math.round(scoreOutOfFive);
  const maxStars = 5;

  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <span key={i} className={`${styles.star} ${i <= fullStars ? styles.full : styles.empty}`}>
        ★
      </span>
    );
  }
  return <div className={styles['stars-container']}>{stars}</div>;
}

function ProductCard({ product }) {
  const initialColor = Object.keys(product.images)[0] || 'yellow';
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedImage, setSelectedImage] = useState(product.images[initialColor]);

  if (!product || !product.images || Object.keys(product.images).length === 0) {
    return <div className={styles['product-card']}>Ürün bilgisi bulunamadı.</div>;
  }

  const handleColorClick = (color, imageUrl) => {
    setSelectedColor(color);
    setSelectedImage(imageUrl);
  };

  const colorOptions = Object.entries(product.images);

  return (
    <div className={styles['product-card']}>
      <div className={styles['product-image-container']}>
        <img src={selectedImage} alt={`${product.name} - ${selectedColor}`} className={styles['product-image']} />
      </div>

      <div className={styles['product-info']}>
        <h3 className={styles['product-title']}>{product.name || "Product Title"}</h3>
        <p className={styles['product-price']}>${product.price?.toFixed(2) || "0.00"} USD</p>

        <div className={styles['product-colors']}>
          {colorOptions.map(([color, imageUrl]) => {
            const colorClass = colorMap[color]?.className || '';
            return (
              <div
                key={color}
                className={`${styles['color-swatch']} ${styles[colorClass]} ${selectedColor === color ? styles.selected : ''}`}
                onClick={() => handleColorClick(color, imageUrl)}
                title={color.charAt(0).toUpperCase() + color.slice(1) + ' Gold'}
              />
            );
          })}
        </div>

        <div className={styles['product-rating']}>
          {renderStars(product.popularityScore)}
          {/* 2. DEĞİŞİKLİK: Sayısal skor da 5'lik sisteme göre gösterildi. */}
          <span>{((product.popularityScore || 0) * 5).toFixed(1)}/5</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;