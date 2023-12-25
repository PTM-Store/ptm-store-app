import React, { useState, useEffect, Fragment } from 'react';
import Header from '../../components/header/Header';
import PageTitle from '../../components/global/PageTitle';
import OrderingToolbar from '../../components/shop/OrderingToolbar';
import Ordering from '../../components/shop/Ordering';
import Products from '../../components/shop/Products';
import QuickView from '../../components/products/QuickView';
import Pagination from '../../components/global/Pagination';
import Instagram from '../../components/global/Instagram';
import Footer from '../../components/global/Footer';

import './shop.css';

function FullWidth({ options }) {
    const [showQuickView, setShowQuickView] = useState(false);
    const [quickViewData, setQuickViewData] = useState({});
    const [ordering, setOrdering] = useState(1);
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const fetchProducts = async () => {
        try {
            const response = await fetch('https://localhost:44344/api/Products');
            if (response.ok) {
                const result = await response.json();
                setProducts(result);
            } else {
                console.error('Fetch products API error: ' + response.statusText);
            }
        } catch (e) {
            console.error('Error fetching data:', e);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const HandleOrderingStatus = (event, data) => {
        event.preventDefault();
        setOrdering(data);
    };

    const HandelQuickViewData = (e, item) => {
        e.preventDefault();
        setShowQuickView(!showQuickView);
        setQuickViewData(item);
        setSelectedProductId(item.id);
    };

    const HandelQuickViewClose = (e) => {
        e.preventDefault();
        setShowQuickView(false);
        setQuickViewData({});
    };

    return (
        <Fragment>
            {showQuickView ? (
                <QuickView data={quickViewData} onQuickViewCloseClick={HandelQuickViewClose} />
            ) : (
                ''
            )}

            <Header options={options} />

            <PageTitle name="Shop" />

            <section className="shop-section shop-style-2 section-padding">
                <div className="container-1410">
                    <div className="row">
                        <div className="col col-xs-12">
                            <div className="shop-area clearfix">
                                <div className="woocommerce-content-wrap">
                                    <div className="woocommerce-content-inner">
                                        <div className="woocommerce-toolbar-top">
                                            <p className="woocommerce-result-count">
                                                Showing all {Array.isArray(products) ? products.length : 0} results
                                            </p>

                                            <OrderingToolbar HandleOrderingStatus={HandleOrderingStatus} ordering={ordering} />

                                            <Ordering />
                                        </div>

                                        <Products
                                            HandelQuickViewData={HandelQuickViewData}
                                            products={Array.isArray(products) ? products : []}
                                            ordering={ordering}
                                            selectedProductId = {selectedProductId}
                                        />
                                    </div>

                                    <Pagination extraClass="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Instagram />
            <Footer />
        </Fragment>
    );
}

export default FullWidth;
