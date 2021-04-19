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
      fetch(`https://api.ratesapi.io/latest?base=${this.baseCurrency}`)
        .then((response) => response.json())
        .then(resolve)
        .catch(reject);
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

    if (!window.hartenfellerdev.CurrencyConverter[this.baseCurrency]) {
      throw new Error(
        `Could not load rates for base currency ${this.baseCurrency}`
      );
    }

    const conversionRate =
      window.hartenfellerdev.CurrencyConverter[this.baseCurrency]?.data
        ?.rates?.[this.conversionCurrency];

    if (!conversionRate) {
      throw new Error(
        `Could not find conversion rate for ${this.conversionCurrency}`
      );
    }

    this.convertedAmount = this.value * conversionRate;

    const conversionAmount = conversionFormat.format(this.convertedAmount);

    this.shadowRoot.querySelector(
      '.curr-shell'
    ).innerText = `${originAmount} | ${conversionAmount}`;
  }

  async connectedCallback() {
    this.baseCurrency = this.getAttribute('base-currency');
    this.value = parseFloat(this.getAttribute('value'));
    this.conversionCurrency = this.getAttribute('conversion-currency');

    if (!window.hartenfellerdev) {
      window.hartenfellerdev = {};
    }

    if (!window.hartenfellerdev.CurrencyConverter) {
      window.hartenfellerdev.CurrencyConverter = {};
    }

    if (!window.hartenfellerdev.CurrencyConverter[this.baseCurrency]) {
      // first one -> fetch api
      window.hartenfellerdev.CurrencyConverter[this.baseCurrency] = {
        status: 'fetching',
        data: null,
        callbacks: [],
      };

      window.hartenfellerdev.CurrencyConverter[
        this.baseCurrency
      ].data = await this.fetchApi();
      window.hartenfellerdev.CurrencyConverter[this.baseCurrency].status =
        'loaded';
      this.renderData();
      // resolve all callbacks from the waiting ones
      window.hartenfellerdev.CurrencyConverter[
        this.baseCurrency
      ].callbacks.forEach((cb) => cb());
    } else if (
      window.hartenfellerdev.CurrencyConverter[this.baseCurrency].status ===
      'fetching'
    ) {
      // currently some else is fetching -> add callback to be called when done
      window.hartenfellerdev.CurrencyConverter[
        this.baseCurrency
      ].callbacks.push(() => this.renderData());
    } else {
      // all data loaded
      this.renderData();
    }
  }
}

window.customElements.define('currency-converter', CurrencyConverter);
