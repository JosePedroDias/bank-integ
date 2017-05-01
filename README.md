# bank-integ

## motivation

Home banking sites of most Portuguese banks are cumbersome and offer no open APIs or decent exporting formats.

This is an initiative to make that happen, via browser automation. The KISS approach was adopted.
Pretty much everyone can help out with more banks supported and/or maintaining existing banks.


## supported banks

* [Montepio](https://www.montepio.pt)


## TODO

* in the montepio_advanced module, the promise isn't returning as it should
* there seems to be a bug in graph.js. it's marked as @TODO: there.


## to run:

    npm install
    <edit> auth.json
    DEBUG=nightmare node main.js


## to process stuff

do the following for your account (must edit account name):

    node process.js
    node explore.js

explore features several possible filters and sorting. edit to tweak.

each row is tagged according to a set of criteria defined in `classify.js`. edit to match yours...


## to plot cash flow graphs

explore saves a `rows.json` file. If you visit the `graph.html` page you can plot the cash flow and do a stacked area plot of the tag totals per month.
