import React from 'react';
// import PropTypes from 'prop-types';

import styles from './Homepage.module.scss';

import FeatureBoxes from '../../features/FeatureBoxes/FeatureBoxes';
import NewFurniture from '../../features/NewFurniture/NewFurnitureContainer';
import Promotions from '../../features/Promotions/Promotions';
import Brands from '../../features/Brands/Brands';
import Comments from '../../features/Comments/Comments';

const Homepage = () => (
  <div className={styles.root}>
    <FeatureBoxes />
    <Promotions />
    <NewFurniture />
    <Brands />
    <Comments />
  </div>
);

// Homepage.propTypes = {};

export default Homepage;
