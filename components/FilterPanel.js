import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from '../styles/FilterPanel.module.css';

function FilterPanel({
  priceRange,
  setPriceRange,
  tempPriceRange,
  setTempPriceRange,
  products,
  setFilteredProducts,
  selectedRating,
  setSelectedRating
}) {

  const maxPossiblePrice = products.length > 0 ? Math.ceil(Math.max(...products.map(p => p.price || 0))) : 1000;

  const applyFilters = () => {
    setPriceRange(tempPriceRange);

    const filtered = products.filter(product => {
      const scoreOutOfFive = (product.popularityScore || 0) * 5;
      
      return (
        product.price >= tempPriceRange[0] &&
        product.price <= tempPriceRange[1] &&
        scoreOutOfFive >= selectedRating
      );
    });
    setFilteredProducts(filtered);
  };

  return (
    <div className={styles['filter-panel']}>
      <div className={styles['price-filter-container']}>
        <label className={styles['filter-label']}>Price</label>
        <div className={styles['price-range-display']}>
          $ {new Intl.NumberFormat('tr-TR').format(tempPriceRange[0])} – $ {new Intl.NumberFormat('tr-TR').format(tempPriceRange[1])}
        </div>
        <Slider
          range
          min={0}
          max={maxPossiblePrice}
          value={tempPriceRange}
          onChange={value => setTempPriceRange(value)}
          allowCross={false}
        />
      </div>

      <div className={styles['rating-filter']}>
        <label className={styles['filter-label']}>Minimum Rating:</label>
        <div className={styles['star-selector']}>
          {[1, 2, 3, 4, 5].map(i => (
            <span
              key={i}
              className={`${styles['star']} ${i <= selectedRating ? styles['selected'] : ''}`}
              onClick={() => setSelectedRating(i)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <button className={styles['apply-filter-button']} onClick={applyFilters}>Filter</button>
    </div>
  );
}

export default FilterPanel;