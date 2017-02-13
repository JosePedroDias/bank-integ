# bank-integ

## motivation

Home banking sites of most Portuguese banks are cumbersome and offer no open APIs or decent exporting formats.

This is an initiative to make that happen, via browser automation. The KISS approach was adopted.
Pretty much everyone can help out with more banks supported and/or maintaining existing banks.


## supported banks

* [Montepio](https://www.montepio.pt)


## TODO

* in the montepio_advanced module, the promise isn't returning as it should


## to run:

    npm install
    <edit> auth.json
    DEBUG=nightmare node main.js
