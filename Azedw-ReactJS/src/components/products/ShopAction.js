import React, {Fragment} from 'react';
import { useHistory } from 'react-router-dom';

/**
 * Shop Action
 * @param onQuickViewClick
 * @param item
 * @returns {*}
 * @constructor
 */
function ShopAction({onQuickViewClick, item}) {
    const history = useHistory();
    const userId = localStorage.getItem('userId');

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
                alert('You have to login !!!');
                history.push('/my-account');
                console.error('Error adding to cart API: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error calling add to cart API:', error);
        }
    };


    const onClickAction = (e)=> {
        e.preventDefault();
    };

    return (
        <Fragment>
            <ul className="shop-action">
                <li>
                    <a href="#" title="Quick view!"
                       data-tip="Quick view!"
                       onClick={
                           e => onQuickViewClick(e, item)
                       }>
                        <i className="fi flaticon-view"/>
                    </a>
                </li>
                <li>
                    <a onClick={onClickAction} title="Add to Wishlist!"
                       data-tip="Add to Wishlist!">
                        <i className="fi icon-heart-shape-outline"/>
                    </a>
                </li>
                <li>
                    <a onClick={(e) => addToCart(item.id, e)} title="Add to cart!"
                       data-tip="Add to cart!">
                        <i className="fi flaticon-shopping-cart"/>
                    </a>
                </li>
            </ul>
        </Fragment>
    );
}

export default ShopAction;