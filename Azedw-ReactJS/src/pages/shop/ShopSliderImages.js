import React, { useState, Fragment, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Slider from 'react-slick';
import Footer from '../../components/global/Footer';
import Instagram from '../../components/global/Instagram';
import PageTitle from '../../components/global/PageTitle';
import Header from '../../components/header/Header';
import ProductInfoTabs from '../../components/products/ProductInfoTabs';
import QuickView from '../../components/products/QuickView';
import RecentSingleProducts from '../../components/products/RecentSingleProducts';

import './shop.css';

function ShopSliderImages({ options }) {
    const [showQuickView, setShowQuickView] = useState(false);
    const [quickViewData, setQuickViewData] = useState({});
    const [productCount, setProductCount] = useState(1);
    const [data, setData] = useState({});
    const { id } = useParams();
    const userId = localStorage.getItem('userId');
    const history = useHistory();

    const fetchData = async () => {
        try {
            const response = await fetch(`https://localhost:44344/api/Products/${id}`);
            if (response.ok) {
                const result = await response.json();
                setData(result);
            } else {
                console.log('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const addToCart = async (productId, quantity, e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You have to log in!!!');
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
                    quantity: quantity,
                    cartId: 0,
                    productId: productId,
                }),
            });

            if (response.ok) {
                console.log('Product successfully added to the cart!');
            } else {
                alert('You have to login!!!');
                history.push("/my-account");
                console.error('Error adding to cart API: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error calling add to cart API:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const HandleProductCount = (e, type) => {
        e.preventDefault();
        setProductCount((prevCount) => (type === 'plus' ? prevCount + 1 : Math.max(prevCount - 1, 1)));
    };

    const HandelQuickViewData = (e, item) => {
        e.preventDefault();
        setShowQuickView(!showQuickView);
        setQuickViewData(item);
    };

    const HandelQuickViewClose = (e) => {
        e.preventDefault();
        setShowQuickView(false);
        setQuickViewData({});
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        autoplaySpeed: 2000,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
    };

    return (
        <Fragment>
            {showQuickView && <QuickView data={quickViewData} onQuickViewCloseClick={HandelQuickViewClose} />}

            <Header options={options} />

            <PageTitle name="Shop single" />

            <section className="shop-single-section section-padding">
                <div className="container-1410">
                    <div className="row">
                        <div className="col col-md-6">
                            <div className="shop-single-slider slider-thumbnail">
                                <Slider {...settings}>
                                    {data.gallery &&
                                        data.gallery.map((item, index) => (
                                            <div key={index}>
                                                <img src={process.env.PUBLIC_URL + item.img} alt={`Product ${index}`} />
                                            </div>
                                        ))}
                                </Slider>
                                <div className="slider-nav"></div>
                            </div>
                        </div>
                        <div className="col col-md-6">
                            <div className="product-details">
                                <h2>{data.title}</h2>
                                <div className="price">
                                    <span className="current">{data.symbols + data.price}</span>
                                    <span className="old">{data.symbols + data.oldPrice}</span>
                                </div>
                                <div className="rating">
                                    <i className="fi flaticon-star" />
                                    <i className="fi flaticon-star" />
                                    <i className="fi flaticon-star" />
                                    <i className="fi flaticon-star" />
                                    <i className="fi flaticon-star-social-favorite-middle-full" />
                                </div>
                                <div className="product-option">
                                    <form className="form" onSubmit={(e) => addToCart(id, productCount, e)}>
                                        <div className="product-row">
                                            <div className="touchspin-wrap">
                                                <button
                                                    onClick={(e) => HandleProductCount(e, 'plus')}
                                                    id="slider-thumbnail-touchspin-up"
                                                    className="btn btn-default "
                                                    type="button"
                                                >
                                                    <i className="glyphicon glyphicon-chevron-up"></i>
                                                </button>
                                                <button
                                                    onClick={(e) => HandleProductCount(e, 'minus')}
                                                    id="slider-thumbnail-touchspin-down"
                                                    className="btn btn-default "
                                                    type="button"
                                                >
                                                    <i className="glyphicon glyphicon-chevron-down"></i>
                                                </button>
                                                <input
                                                    readOnly
                                                    className="product-count"
                                                    type="text"
                                                    value={productCount}
                                                    name="product-count"
                                                />
                                            </div>
                                            <div>
                                                <button type="submit">Add to cart</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="thb-product-meta-before">
                                    <div className="add-to-wishlist">
                                        <a href="#" className="add_to_wishlist">
                                            <i className="pe-7s-like" />
                                            <span>Add To Wishlist</span>
                                        </a>
                                    </div>
                                    <div className="product_meta">
                                        <span className="sku_wrapper">
                                            SKU: <span className="sku">{data.sku != null ? data.sku : ''}</span>
                                        </span>
                                        <span className="posted_in">
                                            Categories:
                                            {data.categories &&
                                                data.categories.map((item, index) => (
                                                    <a key={index} href={item.link}>
                                                        {item.name} {data.categories.length - 1 === index ? '' : ','}
                                                    </a>
                                                ))}
                                        </span>
                                        <span className="tagged_as">
                                            Tags:
                                            {data.tags &&
                                                data.tags.map((item, index) => (
                                                    <a key={index} href={item.link}>
                                                        {item.name} {data.tags.length - 1 === index ? '' : ','}
                                                    </a>
                                                ))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-md-8 col-md-offset-2">
                            <ProductInfoTabs />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-xs-12">
                            <RecentSingleProducts onQuickViewClick={HandelQuickViewData} />
                        </div>
                    </div>
                </div>
            </section>
            <Instagram />
            <Footer />
        </Fragment>
    );
}

export default ShopSliderImages;
