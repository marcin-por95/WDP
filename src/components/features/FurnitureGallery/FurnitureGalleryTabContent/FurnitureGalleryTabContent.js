import React, { useState, useEffect, useRef } from 'react';
import ProductStars from '../../ProductStars/ProductStars';
import styles from './FurnitureGalleryTabContent.module.scss';
import Button from '../../../common/Button/Button';
import { useSelector, useDispatch } from 'react-redux';
import { getProductById, toggleFavorite } from '../../../../redux/productsRedux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faShoppingBasket,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import {
  getAllCompared,
  getCountCompared,
  addComparedProduct,
  deleteComparedProduct,
} from '../../../../redux/comparedReducer';
import { addProduct } from '../../../../redux/cartRedux';

import { getByIdArray } from '../../../../redux/productsRedux';
import {
  setActiveGalleryItem,
  getActiveGalleryItem,
} from '../../../../redux/galleryRedux';
import { getViewport } from '../../../../redux/viewportRedux';

const TabContent = ({ id }) => {
  const [fadeOutImage, setFadeOutImage] = useState(false);
  const [fadeInImage, setFadeInImage] = useState(false);

  const activeGalleryItemId = useSelector(state => getActiveGalleryItem(state));
  const item = useSelector(state => getProductById(state, activeGalleryItemId));
  const viewport = useSelector(state => getViewport(state));
  const sliderContainerRef = useRef(null);

  const dispatch = useDispatch();
  const sliderItems = useSelector(state => getByIdArray(state, id));

  const [selectedStars, setSelectedStars] = useState(item.myStars);
  const [activeSlide, setActiveSlide] = useState(null);

  const [visibleSlides, setVisibleSlides] = useState(6);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    dispatch(setActiveGalleryItem(id[0]));
  }, [dispatch, id]);

  useEffect(() => {
    if (sliderContainerRef.current) {
      const sliderContainerWidth = sliderContainerRef.current.offsetWidth;
      const sliderItemWidth = 90;
      const maxVisibleSlides = Math.floor(sliderContainerWidth / sliderItemWidth);

      setVisibleSlides(Math.min(maxVisibleSlides, sliderItems.length));
    }
  }, [sliderContainerRef, sliderItems, viewport]);

  useEffect(() => {
    dispatch(setActiveGalleryItem(id[0]));
    setStartIndex(0);
  }, [dispatch, id, viewport]);

  const currency = useSelector(state => state.currency.currency);
  const conversionRates = useSelector(state => state.currency.conversionRates);

  const handleStarClick = clickedStars => {
    setSelectedStars(clickedStars);
  };

  const favoriteHandler = e => {
    e.preventDefault();
    dispatch(toggleFavorite(item.id));
  };

  const addToCartHandler = e => {
    e.preventDefault();

    dispatch(
      addProduct({
        id: item.id,
        name: item.name,
        price: item.price,
        picture: item.picture,
      })
    );
  };

  const handleSlideClick = index => {
    setFadeOutImage(true);
    setTimeout(() => {
      setActiveSlide(index);
      setFadeOutImage(false);
      setFadeInImage(true);
      setTimeout(() => {
        setFadeInImage(false);
      }, 500);
      dispatch(setActiveGalleryItem(id[index]));
    }, 500);
  };

  const comparedProducts = useSelector(state => getAllCompared(state));
  const compareCount = useSelector(state => getCountCompared(state));

  const convertPrice = () => {
    const rate = conversionRates[currency];
    return item.price * rate;
  };

  const onCompareClick = evt => {
    evt.preventDefault();

    if (comparedProducts.includes(item.id)) {
      dispatch(deleteComparedProduct(item.id));
      return;
    }

    if (compareCount < 4) dispatch(addComparedProduct(item.id));
  };

  const renderSliderImages = () => {
    const endIndex = startIndex + visibleSlides;
    const visibleSliderItems = sliderItems.slice(startIndex, endIndex);

    return visibleSliderItems.map((sliderItem, index) => (
      <img
        key={sliderItem.id}
        className={`${styles.slide} ${activeSlide === index ? styles.active : ''}`}
        alt='slide'
        src={sliderItem.picture}
        onClick={() => handleSlideClick(startIndex + index)}
      />
    ));
  };

  const handlePrevClick = () => {
    const newStartIndex = startIndex - visibleSlides;
    if (newStartIndex >= 0) {
      setStartIndex(newStartIndex);
      setActiveSlide(null);
    }
  };

  const handleNextClick = () => {
    const newStartIndex = startIndex + visibleSlides;
    const remainingSlides = sliderItems.length - newStartIndex;

    if (remainingSlides >= visibleSlides || remainingSlides > 0) {
      setStartIndex(newStartIndex);
      setActiveSlide(null);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.TabContent}>
        <div className={styles.image}>
          <img
            src={`${item.picture}`}
            alt='activeItem'
            className={`${styles.image} ${styles.activeImage} ${
              fadeOutImage ? styles.fade : ''
            } ${fadeInImage ? styles.fadeIn : ''}`}
          />
          <div className={styles.stars}>
            <div className={styles.priceContainer}>
              <h3 className={styles.price}>
                {currency === 'EUR' ? '€' : currency === 'PLN' ? 'PLN' : '$'}{' '}
                {convertPrice()}
              </h3>
              {item.oldPrice && (
                <h4 className={styles.oldPrice}>
                  {currency === 'EUR' ? '€' : currency === 'PLN' ? 'PLN' : '$'}{' '}
                  {item.oldPrice}
                </h4>
              )}
            </div>
            <h5 className={styles.itemName}>{item.name}</h5>
            <ProductStars
              stars={item.stars}
              myStars={selectedStars}
              onClick={handleStarClick}
            />
          </div>
          <div className={styles.buttons}>
            <Button
              className={styles.actionButton}
              variant={item.isFavorite ? 'active' : 'outline'}
              onClick={favoriteHandler}
              tooltip-text='Add Favorite'
            >
              <FontAwesomeIcon icon={faHeart} />
            </Button>

            <Button
              className={styles.actionButton}
              onClick={onCompareClick}
              variant={comparedProducts.includes(item.id) ? 'active' : 'outline'}
              tooltip-text='Add to compare'
            >
              <FontAwesomeIcon icon={faExchangeAlt} />
            </Button>

            <Button
              className={styles.actionButton}
              variant='outline'
              tooltip-text='See more'
            >
              <FontAwesomeIcon icon={faEye} />
            </Button>
            <Button
              className={styles.actionButton}
              variant='outline'
              tooltip-text='Add to cart'
              onClick={addToCartHandler}
            >
              <FontAwesomeIcon icon={faShoppingBasket} />
            </Button>
          </div>
        </div>
        <div className={styles.furnitureGallerySlider} ref={sliderContainerRef}>
          <div className={styles.row}>
            <button>&#60;</button>
            <div className={styles.slider}>
              <img
                className={`${styles.slide} ${activeSlide === 0 ? styles.active : ''}`}
                alt='slide'
                src={'images/chairs/chair-1.jpg'}
                onClick={() => handleSlideClick(0)}
              />
              <img
                className={`${styles.slide} ${activeSlide === 1 ? styles.active : ''}`}
                alt='slide'
                src={'images/chairs/chair-2.jpg'}
                onClick={() => handleSlideClick(1)}
              />
              <img
                className={`${styles.slide} ${activeSlide === 2 ? styles.active : ''}`}
                alt='slide'
                src={'images/chairs/chair-3.jpg'}
                onClick={() => handleSlideClick(2)}
              />
              <img
                className={`${styles.slide} ${activeSlide === 3 ? styles.active : ''}`}
                alt='slide'
                src={'images/chairs/chair-4.jpg'}
                onClick={() => handleSlideClick(3)}
              />
              <img
                className={`${styles.slide} ${activeSlide === 4 ? styles.active : ''}`}
                alt='slide'
                src={'images/chairs/chair-5.jpg'}
                onClick={() => handleSlideClick(4)}
              />
              <img
                className={`${styles.slide} ${activeSlide === 5 ? styles.active : ''}`}
                alt='slide'
                src={'images/chairs/chair-1.jpg'}
                onClick={() => handleSlideClick(5)}
              />
            </div>
            <button>&#62;</button>
            <button onClick={handlePrevClick}>&#60;</button>
            <div className={styles.slider}>{renderSliderImages()}</div>
            <button onClick={handleNextClick}>&#62;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

TabContent.propTypes = {
  id: PropTypes.array.isRequired,
};

export default TabContent;
