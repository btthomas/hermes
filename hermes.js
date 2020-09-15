const request = require('request-json');
// const url = require('url');
const puppeteer = require('puppeteer');

const STOCK_URL =
  'https://www.hermes.com/us/en/product/etriers-remix-scarf-90-H003502Sv09/';
const ADD_TO_CART = '#add-to-cart-button-oos';

const showBrowser = !!process.argv[2];
const options = showBrowser
  ? {
      headless: false,
      slowMo: 20,
    }
  : {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };

// const TILL_URL = url.parse(process.env.TILL_URL);
// const TILL_BASE = TILL_URL.protocol + '//' + TILL_URL.host;
// let TILL_PATH = TILL_URL.pathname;
// const TILL_PHONE = process.env.TILL_PHONE;

// if (TILL_URL.query != null) {
//   TILL_PATH += '?' + TILL_URL.query;
// }

const getTextContent = (el) => el.textContent;

const getTextFromHandles = async (page, handles) => {
  let text = [];
  await asyncForEach(handles, async (handle, index) => {
    if (index === 0) {
      return;
    }
    text[index - 1] = await page.evaluate(getTextContent, handle);
  });
  return text;
};

async function init() {
  const browser = await puppeteer.launch(options);

  try {
    let response;
    const page = await browser.newPage();
    console.log('starting');

    await page.goto(STOCK_URL, { waitUntil: 'networkidle2' });
    response = await checkStock(page);
    if (response.error) {
      throw new Error(response.error);
    }

    await browser.close();
    console.log('complete');
  } catch (e) {
    console.error(e);
  }
}

async function checkStock(page) {
  try {
    let response = {};

    await page.waitForSelector(ADD_TO_CART);
    const addToCart = await page.$(ADD_TO_CART);

    // const inStock = notDisabled(addToCart);
    const inStock = false;

    if (inStock) {
      console.log('inform');
      // await inform();
    }

    return {};
  } catch (error) {
    return { error };
  }
}

async function inform() {
  console.log('informing');
  return request.createClient(TILL_BASE).post(
    TILL_PATH,
    {
      phone: [TILL_PHONE],
      text:
        'Kettle Bell in STOCK!\nhttps://www.kettlebellkings.com/competition-kettlebell/',
    },
    function (err, res) {
      return console.log(res.statusCode);
    }
  );
}

init();
