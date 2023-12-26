import React, { Fragment, useEffect, useState } from 'react';
import {Link, useHistory} from 'react-router-dom';

function Products({ HandelQuickViewData, products, ordering, selectedProductId }) {
    const userId = localStorage.getItem('userId');
    const history = useHistory();

    const addToCart = async (productsId, e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You have to login !!!');
                history.push('/my-account');
                return;
            }

            const response = await fetch(`https://localhost:44344/api/CartLines/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    quantity: 1,
                    cartId: 0,
                    productId: productsId
                }),
            });

            if (response.ok) {
                console.log('Product successfully added to the cart!');
            } else {
                console.error('Error adding to cart API: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error calling add to cart API:', error);
        }
    };

    return (
        <Fragment>
            <ul className={`products ${ordering === 1 ? 'default-column' : ordering === 2 ? 'three-column' : ordering === 3 ? 'list-view' : ''}`}>
                {products.map((item, index) => (
                    <li key={index} className={`product ${item.id === selectedProductId ? 'selected' : ''}`}>
                        <div className="product-holder">
                            {parseInt(item.price) < parseInt(item.oldPrice) && (
                                <div className="product-badge discount">
                                    {Math.round(((parseInt(item.price) - parseInt(item.oldPrice)) / parseInt(item.price)) * 100)}%
                                </div>
                            )}

                            <Link to={`/single-slider-images/${item.id}`}>
                                <img loading="lazy" src={process.env.PUBLIC_URL + item.mainImg} alt="" />
                            </Link>

                            <div className="shop-action-wrap">
                                <ul className="shop-action">
                                    <li>
                                        <a href="#" title="Quick view!" data-tip="Quick view!" onClick={(e) => HandelQuickViewData(e, item)}>
                                            <i className="fi flaticon-view" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Add to Wishlist!" data-tip="Add to Wishlist!">
                                            <i className="fi icon-heart-shape-outline" />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            onClick={(e) => addToCart(item.id, e)}
                                            type="button"
                                            title="Add to cart!"
                                            data-tip="Add to cart!"
                                        >
                                            <i className="fi flaticon-shopping-cart" />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="product-info">
                            <h4>
                                <Link to={`/single-slider-images/${item.id}`}>{item.title}</Link>
                            </h4>

                            <span className="woocommerce-Price-amount amount">
                                <ins>
                                    <span className="woocommerce-Price-amount amount">
                                        <bdi>
                                            <span className="woocommerce-Price-currencySymbol">
                                                {item.symbol !== undefined && item.symbol !== null ? String(item.symbol) : ''}
                                            </span>
                                            {item.price}
                                        </bdi>
                                    </span>
                                </ins>

                                {parseInt(item.price) < parseInt(item.oldPrice) && (
                                    <del>
                                        <span className="woocommerce-Price-amount amount">
                                            <bdi>
                                                <span className="woocommerce-Price-currencySymbol">
                                                    {item.symbol !== undefined && item.symbol !== null ? String(item.symbol) : ''}
                                                </span>
                                                {item.oldPrice}
                                            </bdi>
                                        </span>
                                    </del>
                                )}
                            </span>

                            <p className="product-description">{item.content}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </Fragment>
    );
}

export default Products;
