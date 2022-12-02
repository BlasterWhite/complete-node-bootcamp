const http = require('http');
const url = require('url');
const fs = require('fs');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

const templateOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
);
const templateProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
);
const templateCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
);

const productData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productDataObj = JSON.parse(productData);

const slugs = productDataObj.map((elem) =>
    slugify(elem.productName, { lower: true })
);
console.log(slugs);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    // Overview Page
    if (pathname == '/' || pathname == '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        });

        const cardsHtml = productDataObj
            .map((elem) => replaceTemplate(templateCard, elem))
            .join('');

        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);

        // Product pages
    } else if (pathname == '/product') {
        const product = productDataObj[query.id ? query.id : 0];

        const output = replaceTemplate(templateProduct, product);

        res.writeHead(200, {
            'Content-type': 'text/html',
        });
        res.end(output);

        // Api
    } else if (pathname == '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json',
        });
        res.end(productData);

        // Not found 404
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'page not found',
        });

        res.end('<h1>Page not found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Server launch on http://127.0.0.1:8000/');
});
