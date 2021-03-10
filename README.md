[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/currency-converter-wc)

# Currency Converter Web Component

A simple Web Component that converts a given currency to another.

This component uses the [free and open source API from the European Central Bank](https://exchangeratesapi.io/).

Demo: https://phartenfeller.github.io/currency-converter-wc/demo/

![demo](./assets/demo-screenshot.png)

## Usage

<!--
```
<custom-element-demo>
  <template>
    <script src="demo/index.js"></script>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->

```html
<currency-converter
  base-currency="USD"
  value="1.32"
  conversion-currency="EUR"
></currency-converter>
```

## Install

[![NPM](https://nodei.co/npm/currency-converter-wc.png)](https://nodei.co/npm/currency-converter-wc/)

```sh
npm install currency-converter-wc
```

## Development

`yarn start` --> Development Server

`yarn build` --> Build dist and demo bundles
