require('dotenv').config();
const fetch = require('node-fetch');
const request = require('request-json');
const url = require('url');

const STOCK_URL =
  'https://www.hermes.com/us/en/product/etriers-remix-scarf-90-H003502Sv09/';
const OUT_OF_STOCK = 'add-to-cart-button-oos';
const IN_STOCK = 'add-to-cart-button-in-stock';

const TILL_URL = url.parse(process.env.TILL_URL);
const TILL_BASE = TILL_URL.protocol + '//' + TILL_URL.host;
let TILL_PATH = TILL_URL.pathname;
const TILL_PHONE = process.env.TILL_PHONE;

if (TILL_URL.query != null) {
  TILL_PATH += '?' + TILL_URL.query;
}

async function init() {
  try {
    console.log('starting');

    // const body = await fetch(STOCK_URL).then((res) => res.text());

    // const outOfStock = body.indexOf(OUT_OF_STOCK) !== -1;

    // const inStock = body.indexOf(IN_STOCK) !== -1;

    // if (!outOfStock && inStock) {
    inform();
    // }

    console.log('complete');
  } catch (e) {
    console.error(e);
  }
}

async function inform() {
  console.log('informing');
  return request.createClient(TILL_BASE).post(
    TILL_PATH,
    {
      phone: [TILL_PHONE],
      text:
        'Hermes in STOCK!\nhttps://www.hermes.com/us/en/product/etriers-remix-scarf-90-H003502Sv09/',
    },
    function (err, res) {
      return console.log(res.statusCode);
    }
  );
}

init();
