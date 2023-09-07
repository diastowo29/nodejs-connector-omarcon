const productHtml = function (name, price, url) {
    return `<html lang="en">
        <head>
        <style>
        /* 
        * Design by Robert Mayer:https://goo.gl/CJ7yC8
        *
        *I intentionally left out the line that was supposed to be below the subheader simply because I don't like how it looks.
        *
        * Chronicle Display Roman font was substituted for similar fonts from Google Fonts.
        */

        body {
        background-color: #fdf1ec;
        }

        .wrapper {
        overflow-y: hidden !important;
        height: 189px !important;
        width: 327px;
        border-radius: 7px 7px 7px 7px;
        /* VIA CSS MATIC https://goo.gl/cIbnS */
        -webkit-box-shadow: 0px 14px 32px 0px rgba(0, 0, 0, 0.15);
        -moz-box-shadow: 0px 14px 32px 0px rgba(0, 0, 0, 0.15);
        box-shadow: 0px 14px 32px 0px rgba(0, 0, 0, 0.15);
        }

        .product-img {
        float: left;
        height: 420px;
        width: 327px;
        }

        .product-img img {
        border-radius: 7px 0 0 7px;
        }

        .product-info {
        float: left;
        height: 420px;
        width: 327px;
        border-radius: 0 7px 10px 7px;
        background-color: #ffffff;
        }

        .product-text {
        height: 300px;
        width: 327px;
        }

        .product-text h1 {
        margin: 0 0 0 38px;
        padding-top: 22px;
        font-size: 20px;
        color: #474747;
        }

        .product-text h1,
        .product-price-btn p {
        font-family: 'Bentham', serif;
        }

        .product-text h2 {
        margin: 0 0 47px 38px;
        font-size: 13px;
        font-family: 'Raleway', sans-serif;
        font-weight: 400;
        text-transform: uppercase;
        color: #d2d2d2;
        letter-spacing: 0.2em;
        }

        .product-text p {
        height: 125px;
        margin: 0 0 0 38px;
        font-family: 'Playfair Display', serif;
        color: #8d8d8d;
        line-height: 1.7em;
        font-size: 15px;
        font-weight: lighter;
        overflow: hidden;
        }

        .product-price-btn {
        height: 103px;
        width: 327px;
        margin-top: 17px;
        position: relative;
        }

        .product-price-btn p {
        display: inline-block;
        position: absolute;
        top: -13px;
        height: 50px;
        font-family: 'Trocchi', serif;
        margin: 0 0 0 38px;
        font-size: 28px;
        font-weight: lighter;
        color: #474747;
        }

        span {
        display: inline-block;
        height: 50px;
        font-family: 'Suranna', serif;
        font-size: 34px;
        }

        .product-price-btn button {
        float: right;
        display: inline-block;
        height: 50px;
        width: 176px;
        margin: 0 40px 0 16px;
        box-sizing: border-box;
        border: transparent;
        border-radius: 60px;
        font-family: 'Raleway', sans-serif;
        font-size: 14px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: #ffffff;
        background-color: #9cebd5;
        cursor: pointer;
        outline: none;
        }

        .product-price-btn button:hover {
        background-color: #79b0a1;
        }

        .btn-test {
        box-shadow: none;
        background-color: #fda028;
        border-color: #fda028;
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
        font-weight: 600;
        padding: 10px 20px 10px 20px;
        display: inline-block;
        margin-bottom: 0;
        line-height: 18px;
        text-align: center;
        text-shadow: none !important;
        vertical-align: middle;
        cursor: pointer;
        background-image: none;
        border-radius: 4px;
        white-space: nowrap;
        }
            </style>
            <link href="https://fonts.googleapis.com/css?family=Bentham|Playfair+Display|Raleway:400,500|Suranna|Trocchi" rel="stylesheet">
        </head>

        <body>
            <div class="wrapper">
            <div class="product-info">
                <div class="product-text">
                <h1>${name}</h1>
                </div>
                <div class="product-price-btn">
                <p><span>${price}</span></p>
                </div>
                <div style="height: 103px;margin-top: 17px;width: 327px;padding-left: 38px;">
                <a href="${url}" class="btn btn-warning btn-test">See Product</a>
                </div>
            </div>
            </div>

        </body>

        </html>`
}


module.exports = {
    productHtml
}