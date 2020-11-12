/*Start Of of Init Function */
$(document).ready(function () {

    (function ($) {
        $.Shop = function (element) {
            this.$element = $(element); // top-level element
            this.init();
        };

        $.Shop.prototype = {
            init: function () {
                // initializes properties and methods
            }
        };

        $(function () {
            var shop = new $.Shop("#site"); // object's instance
        });

    })(jQuery);


    $(function () {
        debugger;;;
        var shop = new $.Shop("#site");
        console.log(shop.$element);
    });

    $.Shop.prototype = {
        init: function () {
            debugger;;;
            // Properties

            this.cartPrefix = "winery-"; // prefix string to be prepended to the cart's name in session storage
            this.cartName = this.cartPrefix + "cart"; // cart's name in session storage
            this.shippingRates = this.cartPrefix + "shipping-rates"; // shipping rates key in session storage
            this.total = this.cartPrefix + "total"; // total key in the session storage
            this.storage = sessionStorage; // shortcut to sessionStorage object

            this.$formAddToCart = this.$element.find("form.add-to-cart"); // forms for adding items to the cart
            this.$formCart = this.$element.find("#shopping-cart"); // Shopping cart form
            this.$checkoutCart = this.$element.find("#checkout-cart"); // checkout form cart
            this.$checkoutOrderForm = this.$element.find("#checkout-order-form"); // checkout user details form
            this.$shipping = this.$element.find("#sshipping"); // element that displays the shipping rates
            this.$subTotal = this.$element.find("#stotal"); // element that displays the subtotal charges
            this.$shoppingCartActions = this.$element.find("#shopping-cart-actions"); // cart actions links
            this.$updateCartBtn = this.$shoppingCartActions.find("#update-cart"); // update cart button
            this.$emptyCartBtn = this.$shoppingCartActions.find("#empty-cart"); // empty cart button
            this.$userDetails = this.$element.find("#user-details-content"); // element that displays the user's information
            this.$paypalForm = this.$element.find("#paypal-form"); // PayPal form

            this.currency = "&usd;"; // HTML entity of the currency to be displayed in layout
            this.currencyString = "$"; // currency symbol as text string
            this.paypalCurrency = "USD"; // PayPal's currency code
            this.paypalBusinessEmail = "cody.and.ngun@gmail.com"; // your PayPal Business account email address
            this.paypalURL = "https://www.sandbox.paypal.com/cgi-bin/webscr"; // URL of the PayPal form

            // object containing patterns for form validation
            // this.requiredFields = {
            //     expression: {
            //         //value: /^([w-.]+)@((?:[w]+.)+)([a-z]){2,4}$/
            //     },

            //     str: {
            //         value: ""
            //     }

            // };

            // public methods invocation
        },
        /* Format a number by decimal places
     * @param num Number the number to be formatted
     * @param places Number the decimal places
     * @returns n Number the formatted number
    */

        _formatNumber: function (num, places) {
            var n = num.toFixed(places);
            return n;
        },

        /**Empty out the cart by emptying session storage */
        _emptyCart: function () {
            this.storage.clear();
        },

        /* Extract the numeric portion from a string
 * @param element Object the jQuery element that contains the relevant string
 * @returns price String the numeric string
 */

        _extractPrice: function (element) {
            var self = this;
            var text = element.text();
            var price = text.replace(self.currencyString, "").replace(" ", "");
            var text = $.trim(element.text());
            return price;
        },


        /* Converts a numeric string into a number
         * @param numStr String the numeric string to be converted
         * @returns num Number the number, or false if the string cannot be converted
         */

        _convertString: function (numStr) {
            var num;
            if (/^[-+]?[0-9]+.[0-9]+$/.test(numStr)) {
                num = parseFloat(numStr);
            } else if (/^d+$/.test(numStr)) {
                num = parseInt(numStr);
            } else {
                num = Number(numStr);
            }

            if (!isNaN(num)) {
                return num;
            } else {
                console.warn(numStr + " cannot be converted into a number");
                return false;
            }
        },

        /* Converts a number to a string
         * @param n Number the number to be converted
         * @returns str String the string returned
         */

        _convertNumber: function (n) {
            var str = n.toString();
            return str;
        },

        /* Converts a JSON string to a JavaScript object
         * @param str String the JSON string
         * @returns obj Object the JavaScript object
         */

        _toJSONObject: function (str) {
            var obj = JSON.parse(str);
            return obj;
        },

        /* Converts a JavaScript object to a JSON string
         * @param obj Object the JavaScript object
         * @returns str String the JSON string
         */

        _toJSONString: function (obj) {
            var str = JSON.stringify(obj);
            return str;
        },

        /* Add an object to the cart as a JSON string
         * @param values Object the object to be added to the cart
         * @returns void
         */

        _addToCart: function (values) {
            var cart = this.storage.getItem(this.cartName);
            var cartObject = this._toJSONObject(cart);
            var cartCopy = cartObject;
            var items = cartCopy.items;
            items.push(values);

            this.storage.setItem(this.cartName, this._toJSONString(cartCopy));
        },



        /* Custom shipping rates calculated based on total quantity of items in cart
         * @param qty Number the total quantity of items
         * @returns shipping Number the shipping rates
         */

        _calculateShipping: function (qty) {
            var shipping = 0;
            if (qty >= 6) {
                shipping = 10;
            }
            if (qty >= 12 && qty <= 30) {
                shipping = 20;
            }

            if (qty >= 30 && qty <= 60) {
                shipping = 30;
            }

            if (qty > 60) {
                shipping = 0;
            }

            return shipping;

        },

        /* Validates the checkout form
         * @param form Object the jQuery element of the checkout form
         * @returns valid Boolean true for success, false for failure
         */

        _validateForm: function (form) {
            var self = this;
            var fields = self.requiredFields;
            var $visibleSet = form.find("fieldset:visible");
            var valid = true;

            form.find(".message").remove();

            $visibleSet.each(function () {

                $(this).find(":input").each(function () {
                    var $input = $(this);
                    var type = $input.data("type");
                    var msg = $input.data("message");

                    if (type == "string") {
                        if ($input.val() == fields.str.value) {
                            $("<span class='message'/>").text(msg).
                                insertBefore($input);

                            valid = false;
                        }
                    } else {
                        if (!fields.expression.value.test($input.val())) {
                            $("<span class='message'/>").text(msg).
                                insertBefore($input);

                            valid = false;
                        }
                    }

                });
            });

            return valid;
        },

        /* Save the data entered by the user in the checkout form
         * @param form Object the jQuery element of the checkout form
         * @returns void
         */

        _saveFormData: function (form) {
            var self = this;
            var $visibleSet = form.find("fieldset:visible");

            $visibleSet.each(function () {
                var $set = $(this);
                if ($set.is("#fieldset-billing")) {
                    var name = $("#name", $set).val();
                    var email = $("#email", $set).val();
                    var city = $("#city", $set).val();
                    var address = $("#address", $set).val();
                    var zip = $("#zip", $set).val();
                    var country = $("#country", $set).val();

                    self.storage.setItem("billing-name", name);
                    self.storage.setItem("billing-email", email);
                    self.storage.setItem("billing-city", city);
                    self.storage.setItem("billing-address", address);
                    self.storage.setItem("billing-zip", zip);
                    self.storage.setItem("billing-country", country);
                } else {
                    var sName = $("#sname", $set).val();
                    var sEmail = $("#semail", $set).val();
                    var sCity = $("#scity", $set).val();
                    var sAddress = $("#saddress", $set).val();
                    var sZip = $("#szip", $set).val();
                    var sCountry = $("#scountry", $set).val();

                    self.storage.setItem("shipping-name", sName);
                    self.storage.setItem("shipping-email", sEmail);
                    self.storage.setItem("shipping-city", sCity);
                    self.storage.setItem("shipping-address", sAddress);
                    self.storage.setItem("shipping-zip", sZip);
                    self.storage.setItem("shipping-country", sCountry);

                }
            });
        },

        createCart: function() {
            if( this.storage.getItem( this.cartName ) == null ) {
        
                var cart = {};
                cart.items = [];
        
                this.storage.setItem( this.cartName, this._toJSONString( cart ) );
                this.storage.setItem( this.shippingRates, "0" );
                this.storage.setItem( this.total, "0" );
            }
        },
    
        // Adds items to shopping cart
    
    handleAddToCartForm: function() {
        var self = this;
        self.$formAddToCart.each(function() {
            var $form = $( this );
            var $product = $form.parent();
            var price = self._convertString( $product.data( "price" ) );
            var name =  $product.data( "name" );
    
            $form.on( "submit", function() {
                var qty = self._convertString( $form.find( ".qty" ).val() );
                var subTotal = qty * price;
                var total = self._convertString( self.storage.getItem( self.total ) );
                var sTotal = total + subTotal;
                self.storage.setItem( self.total, sTotal );
                self._addToCart({
                    product: name,
                    price: price,
                    qty: qty
                });
                var shipping = self._convertString( self.storage.getItem( self.shippingRates ) );
                var shippingRates = self._calculateShipping( qty );
                var totalShipping = shipping + shippingRates;
    
                self.storage.setItem( self.shippingRates, totalShipping );
            });
        });
    },

    displayCart: function() {
        if( this.$formCart.length ) {
            var cart = this._toJSONObject( this.storage.getItem( this.cartName ) );
            var items = cart.items;
            var $tableCart = this.$formCart.find( ".shopping-cart" );
            var $tableCartBody = $tableCart.find( "tbody" );
    
            for( var i = 0; i < items.length; ++i ) {
                var item = items[i];
                var product = item.product;
                var price = this.currency + " " + item.price;
                var qty = item.qty;
                var html = "<tr><td class='pname'>" + product + "</td>" + "<td class='pqty'><input type='text' value='" + qty + "' class='qty'/></td>" + "<td class='pprice'>" + price + "</td></tr>";
    
                $tableCartBody.html( $tableCartBody.html() + html );
            }
    
            var total = this.storage.getItem( this.total );
            this.$subTotal[0].innerHTML = this.currency + " " + total;
        } else if( this.$checkoutCart.length ) {
            var checkoutCart = this._toJSONObject( this.storage.getItem( this.cartName ) );
            var cartItems = checkoutCart.items;
            var $cartBody = this.$checkoutCart.find( "tbody" );
    
            for( var j = 0; j < cartItems.length; ++j ) {
                var cartItem = cartItems[j];
                var cartProduct = cartItem.product;
                var cartPrice = this.currency + " " + cartItem.price;
                var cartQty = cartItem.qty;
                var cartHTML = "<tr><td class='pname'>" + cartProduct + "</td>" + "<td class='pqty'>" + cartQty + "</td>" + "<td class='pprice'>" + cartPrice + "</td></tr>";
    
                $cartBody.html( $cartBody.html() + cartHTML );
            }
    
            var cartTotal = this.storage.getItem( this.total );
            var cartShipping = this.storage.getItem( this.shippingRates );
            var subTot = this._convertString( cartTotal ) + this._convertString( cartShipping );
    
            this.$subTotal[0].innerHTML = this.currency + " " + this._convertNumber( subTot );
            this.$shipping[0].innerHTML = this.currency + " " + cartShipping;
    
        }
    },

    
    
    }



    // Creates the cart keys in session storage





    /**End of Init Function */
});