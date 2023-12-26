import React, { Fragment, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './navbarRight.css';

function HeaderRight({ options }) {
    const hasToken = localStorage.getItem('token');
    const [miniCartData, setMiniCartData] = useState({});
    const userId = localStorage.getItem('userId');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/';
    };

    const fetchCartLines = async () => {
        try {
            const response = await fetch(`https://localhost:44344/api/CartLines/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${hasToken}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                setMiniCartData(result);
            } else {
                console.log('Fetch products API error: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        fetchCartLines();
    }, [miniCartData]);

    return (
        <Fragment>
            <div className="header-right">
                {hasToken ? (
                    <div className="logout-link" onClick={handleLogout}>
                        <Link to="/">
                            <span>Logout</span>
                        </Link>
                    </div>
                ) : (
                    <div className="my-account-link">
                        <Link className="" to="/my-account">
                            <i className="icon-user" />
                        </Link>
                    </div>
                )}
                <div className="wishlist-box">
                    <a href="#"><i className="icon-heart-shape-outline" /></a>
                </div>
                <div className="mini-cart">
                    <button className="cart-toggle-btn" onClick={options.onMiniCartClick}>
                        <i className="icon-large-paper-bag" />
                        <span className="cart-count">{miniCartData.length}</span>
                    </button>
                    <div className={"mini-cart-content " + (options.miniCart ? 'mini-cart-content-toggle' : '')}>
                        {/*<div className="mini-cart-items">*/}
                        {/*    {miniCartData.product && miniCartData.product.length > 0 ? (*/}
                        {/*        miniCartData.product.map((item, index) => (*/}
                        {/*            <div key={index} className="mini-cart-item clearfix">*/}
                        {/*                <div className="mini-cart-item-image">*/}
                        {/*                    <NavLink to={item.link}>*/}
                        {/*                        <img src={process.env.PUBLIC_URL + item.product.mainImg} alt="" />*/}
                        {/*                    </NavLink>*/}
                        {/*                </div>*/}
                        {/*                <div className="mini-cart-item-des">*/}
                        {/*                    <NavLink to={item.link}>{item.product.title}</NavLink>*/}
                        {/*                    <span className="mini-cart-item-quantity">Qty: {item.quantity}</span>*/}
                        {/*                    <span className="mini-cart-item-price">{miniCartData.symbol}{item.product.price}</span>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        ))*/}
                        {/*    ) : (*/}
                        {/*        <p>There is nothing in your cart</p>*/}
                        {/*    )}*/}
                        {/*</div>*/}
                        <div className="mini-cart-action clearfix">
                            {miniCartData.length > 0 ? (
                                <Fragment>
                                    <span className="mini-checkout-price">
                                        {miniCartData.length > 1
                                            ? `There are ${miniCartData.length} items in your cart`
                                            : `There is ${miniCartData.length} item in your cart`}
                                    </span>
                                    <Link className="view-cart-btn" to="/cart">
                                        View Cart
                                    </Link>
                                    <Link className="checkout-btn" to="/checkout">
                                        Checkout
                                    </Link>
                                </Fragment>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default HeaderRight;
