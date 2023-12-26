import React, { Fragment, useEffect, useState } from 'react';
import {useHistory} from "react-router-dom";

import Footer from '../../components/global/Footer';
import Instagram from '../../components/global/Instagram';
import PageTitle from '../../components/global/PageTitle';
import Header from '../../components/header/Header';
import CartItem from "../../components/cart/CartItem";
import CalculatedShipping from "../../components/cart/CalculatedShipping";

import './cart.css';

function Cart({ options }) {
    const [cartItemData, setCartItemData] = useState([]);
    const userId = localStorage.getItem('userId');
    const [totalAmount, setTotalAmount] = useState(0);
    const history = useHistory();

    const fetchCartLines = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You have to login !!!');
                history.push('/my-account');
                return;
            }

            const response = await fetch(`https://localhost:44344/api/CartLines/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                if (Array.isArray(result)) {
                    setCartItemData(result);
                } else {
                    console.error('Invalid data format. Expected an array.');
                }
            } else {
                alert('You have to login !!!');
                history.push('/my-account');
                console.log('Fetch products API error: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const onDeleteCartItem = async (cartLineId) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You have to login !!!');
                history.push('/my-account');
                return;
            }

            const response = await fetch(`https://localhost:44344/api/CartLines/${cartLineId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log('Cart item deleted successfully!');
                fetchCartLines();
            } else {
                console.error('Error deleting cart item: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error calling delete cart item API:', error);
        }
    };


    useEffect(() => {
        fetchCartLines();
    }, [userId]);

    useEffect(() => {
        calculateTotalAmount();
    }, [cartItemData]);

    const calculateTotalAmount = () => {
        let total = 0;
        for (const item of cartItemData) {
            total += item.product.price * item.quantity;
        }
        setTotalAmount(total);
    };

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
                                            <CartItem key={index} data={item} onDeleteCartItem={onDeleteCartItem} fetchCartLines={fetchCartLines} calculateTotalAmount={calculateTotalAmount} />
                                        ))}
                                        {/*<Coupon />*/}
                                        </tbody>
                                    </table>
                                </form>
                                <div className="cart-collaterals">
                                    <CalculatedShipping currencySymbol="$" price={totalAmount.toFixed(2)}/>
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
