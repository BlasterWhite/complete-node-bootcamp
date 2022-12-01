module.exports = (template, product) => {
    let output = template.replace(/{%PRODUCT_NAME%}/g, product.productName);
    output = output.replace(/{%PRODUCT_ICON%}/g, product.image);
    output = output.replace(/{%PRODUCT_QTY%}/g, product.quantity);
    output = output.replace(/{%PRODUCT_PRICE%}/g, product.price);
    output = output.replace(/{%PRODUCT_ID%}/g, product.id);
    output = output.replace(/{%PRODUCT_ORIGIN%}/g, product.from);
    output = output.replace(/{%PRODUCT_NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, product.description);
    if(!product.organic) {
        output = output.replace(/{%PRODUCT_NOT_ORGANIC%}/g, 'not-organic');
    } else {
        output = output.replace(/{%PRODUCT_NOT_ORGANIC%}/g, '');
    }
    return output;
}