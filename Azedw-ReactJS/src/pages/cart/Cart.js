import React, { Fragment, useEffect, useState } from 'react';

import Footer from '../../components/global/Footer';
import Instagram from '../../components/global/Instagram';
import PageTitle from '../../components/global/PageTitle';
import Header from '../../components/header/Header';
import CartItem from "../../components/cart/CartItem";
import Coupon from "../../components/cart/Coupon";
import CalculatedShipping from "../../components/cart/CalculatedShipping";

import './cart.css';

function Cart({ options }) {
    const [cartItemData, setCartItemData] = useState([]);
    const userId = localStorage.getItem('userId');

    const fetchCartLines = async () => {
        try {
            const response = await fetch(`https://localhost:44344/api/CartLines/${userId}`);
            if (response.ok) {
                const result = await response.json();
                if (Array.isArray(result)) {
                    setCartItemData(result);
                } else {
                    console.error('Invalid data format. Expected an array.');
                }
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
            <Header options={options} />
            <PageTitle name="Cart"/>

            <section className="cart-section woocommerce-cart section-padding">
                <div className="container-1410">
                    <div className="row">
                        <div className="col col-xs-12">
                            <div className="woocommerce">
                                <form action="/" method="post">
                                    <table className="shop_table shop_table_responsive cart">
                                        <thead>
                                        <tr>
                                            <th className="product-remove">&nbsp;</th>
                                            <th className="product-thumbnail">&nbsp;</th>
                                            <th className="product-name">Product</th>
                                            <th className="product-price">Price</th>
                                            <th className="product-quantity">Quantity</th>
                                            <th className="product-subtotal">Total</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {cartItemData.map((item, index) => (
                                            <CartItem key={index} data={item} />
                                        ))}
                                        <Coupon />
                                        </tbody>
                                    </table>
                                </form>
                                <div className="cart-collaterals">
                                    <CalculatedShipping currencySymbol="£" price="430.00"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Instagram/>
            <Footer/>
        </Fragment>
    );
}

export default Cart;
