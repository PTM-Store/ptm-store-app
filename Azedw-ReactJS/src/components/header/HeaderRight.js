import React, { Fragment, useState, useEffect } from 'react';
import './navbarRight.css';
import { Link, NavLink } from "react-router-dom";

/**
 * Right side of header include minicart, and buttons
 * @param options
 * @returns {*}
 * @constructor
 */
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
            const response = await fetch(`https://localhost:44344/api/CartLines/${userId}`);
            if (response.ok) {
                const result = await response.json();
                setMiniCartData(result);
            } else {
                console.log('Fetch products API error: ' + response.statusText);
            }
        } catch (e) {
            console.error('Error fetching data:', e);
        }
    };

    useEffect(() => {
        fetchCartLines();
    }, [userId]);

    return (
        <Fragment>
            <div className="header-right">
                {hasToken ? (
                    // Hiển thị nút logout nếu có token
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
                        <span className="cart-count">{miniCartData.product && miniCartData.product.length}</span>
                    </button>
                    <div className={"mini-cart-content " + (options.miniCart ? 'mini-cart-content-toggle' : '')}>
                        <div className="mini-cart-items">
                            {
                                miniCartData.product &&
                                miniCartData.product.map((item, index) => (
                                    <div key={index} className="mini-cart-item clearfix">
                                        <div className="mini-cart-item-image">
                                            <NavLink to={item.link}>
                                                <img src={process.env.PUBLIC_URL + item.img} alt="" />
                                            </NavLink>
                                        </div>
                                        <div className="mini-cart-item-des">
                                            <NavLink to={item.link}>{item.name}</NavLink>
                                            <span className="mini-cart-item-quantity">Qty: {item.qty}</span>
                                            <span className="mini-cart-item-price">{miniCartData.symbol}{item.price}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="mini-cart-action clearfix">
                            <span className="mini-checkout-price">Subtotal: {miniCartData.symbol}{miniCartData.subtotal}</span>
                            <Link className="view-cart-btn" to="/cart">
                                View Cart
                            </Link>
                            <Link className="checkout-btn" to="/checkout">
                                Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default HeaderRight;
