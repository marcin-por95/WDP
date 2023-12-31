import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import initialState from './initialState';

import cartReducer from './cartRedux';
import categoriesReducer from './categoriesRedux';
import productsReducer from './productsRedux';
import promotedReducer from './promotedRedux';
import galleryReducer from './galleryRedux';
import comparedReducer from './comparedReducer';
import viewportReducer from './viewportRedux';
import currencyReducer from './currencyRedux';

// define reducers
const reducers = {
  cart: cartReducer,
  categories: categoriesReducer,
  products: productsReducer,
  promoted: promotedReducer,
  gallery: galleryReducer,
  compared: comparedReducer,
  viewport: viewportReducer,
  currency: currencyReducer,
};

// add blank reducers for initial state properties without reducers
Object.keys(initialState).forEach(item => {
  if (typeof reducers[item] == 'undefined') {
    reducers[item] = (statePart = null) => statePart;
  }
});

const combinedReducers = combineReducers(reducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// create store
const store = createStore(
  combinedReducers,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
