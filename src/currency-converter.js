const template = document.createElement('template');
template.innerHTML = `
  <style>
    .curr-shell {
      background: #E2E8F0;
    }
  </style>
  <span class="curr-shell"></span>`;

class CurrencyConverter extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', () => console.log('click'));
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

  fillData() {
    this.convertedAmount =
      this.value *
      window.rates[this.baseCurrency].data.rates[this.conversionCurrency];

    this.shadowRoot.querySelector(
      '.curr-shell'
    ).innerText = `${this.baseCurrency} - ${this.value} - ${this.conversionCurrency} - ${this.convertedAmount}`;
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
      console.log('fetching data');
      window.rates[this.baseCurrency].data = await this.fetchApi();
      window.rates[this.baseCurrency].status = 'loaded';
      this.fillData();
      // resolve all callbacks from the waiting ones
      window.rates[this.baseCurrency].callbacks.forEach((cb) => cb());
    } else if (window.rates[this.baseCurrency].status === 'fetching') {
      // currently some else is fetching -> add callback to be called when done
      console.log('status loading');
      window.rates[this.baseCurrency].callbacks.push(() => this.fillData());
    } else {
      // all data loaded
      console.log('loaded');
      this.fillData();
    }
  }
}

window.customElements.define('currency-converter', CurrencyConverter);
