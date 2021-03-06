/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***********************************!*\
  !*** ./src/currency-converter.js ***!
  \***********************************/
const template = document.createElement('template');
template.innerHTML = `
  <style>
    .curr-shell {
      color: #262626;
      background: #F1F5F9;
      border-radius: 16px;
      padding: 4px 8px;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
  </style>
  <span class="curr-shell"></span>`;

class CurrencyConverter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async fetchApi() {
    return new Promise((resolve, reject) => {
      fetch(`https://api.exchangeratesapi.io/latest?base=${this.baseCurrency}`)
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }

  renderData() {
    const browserLocale = navigator.language;
    const originFormat = new Intl.NumberFormat(browserLocale, {
      style: 'currency',
      currency: this.baseCurrency,
    });
    const conversionFormat = new Intl.NumberFormat(browserLocale, {
      style: 'currency',
      currency: this.conversionCurrency,
    });

    const originAmount = originFormat.format(this.value);

    this.convertedAmount =
      this.value *
      window.rates[this.baseCurrency].data.rates[this.conversionCurrency];

    const conversionAmount = conversionFormat.format(this.convertedAmount);

    this.shadowRoot.querySelector(
      '.curr-shell'
    ).innerText = `${originAmount} | ${conversionAmount}`;
  }

  async connectedCallback() {
    this.baseCurrency = this.getAttribute('base-currency');
    this.value = parseFloat(this.getAttribute('value'));
    this.conversionCurrency = this.getAttribute('conversion-currency');

    if (!window.rates) window.rates = {};

    if (!window.rates[this.baseCurrency]) {
      // first one -> fetch api
      window.rates[this.baseCurrency] = {
        status: 'fetching',
        data: null,
        callbacks: [],
      };

      window.rates[this.baseCurrency].data = await this.fetchApi();
      window.rates[this.baseCurrency].status = 'loaded';
      this.renderData();
      // resolve all callbacks from the waiting ones
      window.rates[this.baseCurrency].callbacks.forEach((cb) => cb());
    } else if (window.rates[this.baseCurrency].status === 'fetching') {
      // currently some else is fetching -> add callback to be called when done
      window.rates[this.baseCurrency].callbacks.push(() => this.renderData());
    } else {
      // all data loaded
      this.fillData();
    }
  }
}

window.customElements.define('currency-converter', CurrencyConverter);

/******/ })()
;
//# sourceMappingURL=bundle.468c7dd042924877d2db.js.map