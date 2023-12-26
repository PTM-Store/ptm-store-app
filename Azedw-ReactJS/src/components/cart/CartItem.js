import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';

function CartItem({ data, onDeleteCartItem, fetchCartLines, calculateTotalAmount }) {
    const [quantity, setQuantity] = useState(data.quantity);
    const history = useHistory();

    const handleIncrease = async () => {
        setQuantity(quantity + 1);
        await updateProductQuantity(data.id, quantity + 1);
    };

    const handleDecrease = async () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            await updateProductQuantity(data.id, quantity - 1);
        }
    };

    const handleRemove = async () => {
        await onDeleteCartItem(data.id);
        fetchCartLines();
        calculateTotalAmount();
    };

    const updateProductQuantity = async (cartLineId, newQuantity) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You have to login !!!');
                history.push('/my-account');
                return;
            }

            const response = await fetch(`https://localhost:44344/api/CartLines/${cartLineId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    quantity: newQuantity,
                }),
            });

            if (!response.ok) {
                console.error('Error updating cart item quantity: ' + response.statusText);
            } else {
                fetchCartLines();
                calculateTotalAmount();
            }
        } catch (error) {
            console.error('Error calling update cart item API:', error);
        }
    };


    return (
        <Fragment>
            <tr className="cart_item">
                <td className="product-remove">
                    <a className="remove" title="Remove this item" onClick={handleRemove}>x</a>
                </td>
                <td className="product-thumbnail">
                    <img width={57} height={70} src={process.env.PUBLIC_URL + data.product.mainImg} alt="#" />
                </td>
                <td className="product-name" data-title="Product">
                    <span>{data.product.title}</span>
                </td>
                <td className="product-price" data-title="Price">
                    <span className="woocommerce-Price-amount amount">
                        <span className="woocommerce-Price-currencySymbol">{data.product.symbol}</span>
                        ${data.product.price}
                    </span>
                </td>
                <td className="product-quantity" data-title="Quantity">
                    <div className="quantity">
                        <button className="btn btn-default bootstrap-touchspin-up" type="button" onClick={handleIncrease}>
                            <i className="glyphicon glyphicon-chevron-up"></i>
                        </button>
                        <input
                            type="number"
                            step={1}
                            min={1}
                            name="cart-quantity"
                            value={quantity}
                            title="Qty"
                            className="product-count input-text qty text"
                            readOnly
                        />
                        <button className="btn btn-default bootstrap-touchspin-down" type="button" onClick={handleDecrease}>
                            <i className="glyphicon glyphicon-chevron-down"></i>
                        </button>
                    </div>
                </td>
                <td className="product-subtotal" data-title="Total">
                    <span className="woocommerce-Price-amount amount">
                        <span className="woocommerce-Price-currencySymbol">{data.currencySymbol}</span>
                        ${data.product.price * quantity}
                    </span>
                </td>
            </tr>
        </Fragment>
    );
}

export default CartItem;
