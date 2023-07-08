import React from 'react';
import PropTypes from 'prop-types';

import styles from './NewFurniture.module.scss';
import ProductBox from '../../common/ProductBox/ProductBox';
import { useSelector } from 'react-redux';
import { getViewport } from '../../../redux/viewportRedux';

const NewFurniture = ({ categories, products }) => {
  const [activePage, setActivePage] = React.useState(0);
  const [activeCategory, setActiveCategory] = React.useState('bed');
  const viewport = useSelector(getViewport);

  const handlePageChange = newPage => {
    setActivePage(newPage);
  };

  const handleCategoryChange = newCategory => {
    setActiveCategory(newCategory);
  };

  const categoryProducts = products.filter(item => item.category === activeCategory);
  const pagesCount = Math.ceil(categoryProducts.length / 8);

  const dots = [];
  for (let i = 0; i < pagesCount; i++) {
    dots.push(
      <li key={i}>
        <a
          onClick={() => handlePageChange(i)}
          className={i === activePage && styles.active}
        >
          page {i}
        </a>
      </li>
    );
  }

  const itemsPerPage = viewport === 'desktop' ? 8 : viewport === 'tablet' ? 2 : 1;

  return (
    <div className={styles.root}>
      <div className='container'>
        <div className={styles.panelBar}>
          <div className='row no-gutters align-items-end'>
            <div className={`col-auto ${styles.heading}`}>
              <h3>New furniture</h3>
            </div>
            <div className={`col ${styles.menu}`}>
              <ul>
                {categories.map(item => (
                  <li key={item.id}>
                    <a
                      className={item.id === activeCategory && styles.active}
                      onClick={() => handleCategoryChange(item.id)}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`col-auto ${styles.dots}`}>
              <ul>{dots}</ul>
            </div>
          </div>
        </div>
        <div className='row'>
          {categoryProducts
            .slice(activePage * itemsPerPage, (activePage + 1) * itemsPerPage)
            .map(item => (
              <div
                className={`col-lg-3 col-sm-6 col-12 col-${12 / itemsPerPage}`}
                key={item.id}
              >
                <ProductBox {...item} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

NewFurniture.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      category: PropTypes.string,
      price: PropTypes.number,
      stars: PropTypes.number,
      promo: PropTypes.string,
      newFurniture: PropTypes.bool,
    })
  ),
};

NewFurniture.defaultProps = {
  categories: [],
  products: [],
};

export default NewFurniture;
