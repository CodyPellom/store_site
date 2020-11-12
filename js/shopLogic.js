
		init: function() {
		
		    // Properties
		
			this.cartPrefix = "winery-"; // Prefix string to be prepended to the cart's name in the session storage
			this.cartName = this.cartPrefix + "cart"; // Cart name in the session storage
			this.shippingRates = this.cartPrefix + "shipping-rates"; // Shipping rates key in the session storage
			this.total = this.cartPrefix + "total"; // Total key in the session storage
			this.storage = sessionStorage; // shortcut to the sessionStorage object
			
			
			this.$formAddToCart = this.$element.find( "form.add-to-cart" ); // Forms for adding items to the cart
			var formCart = document.getElementById( "#shopping-cart" ); // Shopping cart form
			var checkoutCart = document.getElementById( "#checkout-cart" ); // Checkout form cart
			var checkoutOrderForm = document.getElementById( "#checkout-order-form" ); // Checkout user details form
			var shipping = document.getElementById( "#sshipping" ); // Element that displays the shipping rates
			var subTotal = document.getElementById( "#stotal" ); // Element that displays the subtotal charges
			var shoppingCartActions = document.getElementById( "#shopping-cart-actions" ); // Cart actions links
            var updateCartBtn = document.getElementById( "#update-cart" ); // Update cart button
			var emptyCartBtn = document.getElementById( "#empty-cart" ); // Empty cart button
			var userDetails = document.getElementById( "#user-details-content" ); // Element that displays the user information
			var paypalForm = document.getElementById( "#paypal-form" ); // PayPal form
			
			
			var currency = "&euro;"; // HTML entity of the currency to be displayed in the layout
			var currencyString = "€"; // Currency symbol as textual string
			var paypalCurrency = "EUR"; // PayPal's currency code
			var paypalBusinessEmail = "yourbusiness@email.com"; // Your Business PayPal's account email address
			var paypalURL = "https://www.sandbox.paypal.com/cgi-bin/webscr"; // The URL of the PayPal's form
			
			// Object containing patterns for form validation
			var requiredFields = {
				expression: {
					value: /^([\w-\.]+)@((?:[\w]+\.)+)([a-z]){2,4}$/
				},
				
				str: {
					value: ""
				}
				
			};
			
			// Method invocation
			
			this.createCart();
			this.handleAddToCartForm();
			this.handleCheckoutOrderForm();
			this.emptyCart();
			this.updateCart();
			this.displayCart();
			this.deleteProduct();
			this.displayUserDetails();
			this.populatePayPalForm();
			
			
		},
		
		// Public methods
		
		// Creates the cart keys in the session storage
		
		function createCart() {
			if( this.storage.getItem( this.cartName ) == null ) {
			
				var cart = {};
				cart.items = [];
			
				this.storage.setItem( this.cartName, this._toJSONString( cart ) );
				this.storage.setItem( this.shippingRates, "0" );
				this.storage.setItem( this.total, "0" );
			}
		},
		
		// Appends the required hidden values to the PayPal's form before submitting
		
		function populatePayPalForm() {
			var me = this;
			if( me.$paypalForm.length ) {
				var $form = me.$paypalForm;
				var cart = me._toJSONObject( me.storage.getItem( me.cartName ) );
				var shipping = me.storage.getItem( me.shippingRates );
				var numShipping = me._convertString( shipping );
				var cartItems = cart.items; 
				var singShipping = Math.floor( numShipping / cartItems.length );
				
				$form.attr( "action", me.paypalURL );
				$form.find( "input[name='business']" ).val( me.paypalBusinessEmail );
				$form.find( "input[name='currency_code']" ).val( me.paypalCurrency );
				
				for( var i = 0; i < cartItems.length; ++i ) {
					var cartItem = cartItems[i];
					var n = i + 1;
					var name = cartItem.product;
					var price = cartItem.price;
					var qty = cartItem.qty;
					
					$( "<div/>" ).html( "<input type='hidden' name='quantity_" + n + "' value='" + qty + "'/>" ).
					insertBefore( "#paypal-btn" );
					$( "<div/>" ).html( "<input type='hidden' name='item_name_" + n + "' value='" + name + "'/>" ).
					insertBefore( "#paypal-btn" );
					$( "<div/>" ).html( "<input type='hidden' name='item_number_" + n + "' value='SKU " + name + "'/>" ).
					insertBefore( "#paypal-btn" );
					$( "<div/>" ).html( "<input type='hidden' name='amount_" + n + "' value='" + me._formatNumber( price, 2 ) + "'/>" ).
					insertBefore( "#paypal-btn" );
					$( "<div/>" ).html( "<input type='hidden' name='shipping_" + n + "' value='" + me._formatNumber( singShipping, 2 ) + "'/>" ).
					insertBefore( "#paypal-btn" );
					
				}
				
				
				
			}
		},
		
		// Displays the user's information
		
		 function displayUserDetails() {
			if( this.$userDetails.length ) {
				if( this.storage.getItem( "shipping-name" ) == null ) {
					var name = this.storage.getItem( "billing-name" );
					var email = this.storage.getItem( "billing-email" );
					var city = this.storage.getItem( "billing-city" );
					var address = this.storage.getItem( "billing-address" );
					var zip = this.storage.getItem( "billing-zip" );
					var country = this.storage.getItem( "billing-country" );
					
					var html = "<div class='detail'>";
						html += "<h2>Billing and Shipping</h2>";
						html += "<ul>";
						html += "<li>" + name + "</li>";
						html += "<li>" + email + "</li>";
						html += "<li>" + city + "</li>";
						html += "<li>" + address + "</li>";
						html += "<li>" + zip + "</li>";
						html += "<li>" + country + "</li>";
						html += "</ul></div>";
						
					this.$userDetails[0].innerHTML = html;
				} else {
					var name = this.storage.getItem( "billing-name" );
					var email = this.storage.getItem( "billing-email" );
					var city = this.storage.getItem( "billing-city" );
					var address = this.storage.getItem( "billing-address" );
					var zip = this.storage.getItem( "billing-zip" );
					var country = this.storage.getItem( "billing-country" );
					
					var sName = this.storage.getItem( "shipping-name" );
					var sEmail = this.storage.getItem( "shipping-email" );
					var sCity = this.storage.getItem( "shipping-city" );
					var sAddress = this.storage.getItem( "shipping-address" );
					var sZip = this.storage.getItem( "shipping-zip" );
					var sCountry = this.storage.getItem( "shipping-country" );
					
					var html = "<div class='detail'>";
						html += "<h2>Billing</h2>";
						html += "<ul>";
						html += "<li>" + name + "</li>";
						html += "<li>" + email + "</li>";
						html += "<li>" + city + "</li>";
						html += "<li>" + address + "</li>";
						html += "<li>" + zip + "</li>";
						html += "<li>" + country + "</li>";
						html += "</ul></div>";
						
						html += "<div class='detail right'>";
						html += "<h2>Shipping</h2>";
						html += "<ul>";
						html += "<li>" + sName + "</li>";
						html += "<li>" + sEmail + "</li>";
						html += "<li>" + sCity + "</li>";
						html += "<li>" + sAddress + "</li>";
						html += "<li>" + sZip + "</li>";
						html += "<li>" + sCountry + "</li>";
						html += "</ul></div>";
						
					this.$userDetails[0].innerHTML = html;	
				
				}
			}
		},

		// Delete a product from the shopping cart

		function deleteProduct() {
			var me = this;
			if( me.$formCart.length ) {
				var cart = this._toJSONObject( this.storage.getItem( this.cartName ) );
				var items = cart.items;

				$( document ).on( "click", ".pdelete a", function( e ) {
					e.preventDefault();
					var productName = $( this ).data( "product" );
					var newItems = [];
					for( var i = 0; i < items.length; ++i ) {
						var item = items[i];
						var product = item.product;	
						if( product == productName ) {
							items.splice( i, 1 );
						}
					}
					newItems = items;
					var updatedCart = {};
					updatedCart.items = newItems;

					var updatedTotal = 0;
					var totalQty = 0;
					if( newItems.length == 0 ) {
						updatedTotal = 0;
						totalQty = 0;
					} else {
						for( var j = 0; j < newItems.length; ++j ) {
							var prod = newItems[j];
							var sub = prod.price * prod.qty;
							updatedTotal += sub;
							totalQty += prod.qty;
						}
					}

					me.storage.setItem( me.total, me._convertNumber( updatedTotal ) );
					me.storage.setItem( me.shippingRates, me._convertNumber( me._calculateShipping( totalQty ) ) );

					me.storage.setItem( me.cartName, me._toJSONString( updatedCart ) );
					$( this ).parents( "tr" ).remove();
					me.$subTotal[0].innerHTML = me.currency + " " + me.storage.getItem( me.total );
				});
			}
		},
		
		// Displays the shopping cart
		
		function displayCart() {
			if( this.$formCart.length ) {
				var cart = this._toJSONObject( this.storage.getItem( this.cartName ) );
				var items = cart.items;
				var $tableCart = this.$formCart.find( ".shopping-cart" );
				var $tableCartBody = $tableCart.find( "tbody" );

				if( items.length == 0 ) {
					$tableCartBody.html( "" );	
				} else {
				
				
					for( var i = 0; i < items.length; ++i ) {
						var item = items[i];
						var product = item.product;
						var price = this.currency + " " + item.price;
						var qty = item.qty;
						var html = "<tr><td class='pname'>" + product + "</td>" + "<td class='pqty'><input type='text' value='" + qty + "' class='qty'/></td>";
					    	html += "<td class='pprice'>" + price + "</td><td class='pdelete'><a href='' data-product='" + product + "'>&times;</a></td></tr>";
					
						$tableCartBody.html( $tableCartBody.html() + html );
					}

				}

				if( items.length == 0 ) {
					this.$subTotal[0].innerHTML = this.currency + " " + 0.00;
				} else {	
				
					var total = this.storage.getItem( this.total );
					this.$subTotal[0].innerHTML = this.currency + " " + total;
				}
			} else if( this.$checkoutCart.length ) {
				var checkoutCart = this._toJSONObject( this.storage.getItem( this.cartName ) );
				var cartItems = checkoutCart.items;
				var $cartBody = this.$checkoutCart.find( "tbody" );

				if( cartItems.length > 0 ) {
				
					for( var j = 0; j < cartItems.length; ++j ) {
						var cartItem = cartItems[j];
						var cartProduct = cartItem.product;
						var cartPrice = this.currency + " " + cartItem.price;
						var cartQty = cartItem.qty;
						var cartHTML = "<tr><td class='pname'>" + cartProduct + "</td>" + "<td class='pqty'>" + cartQty + "</td>" + "<td class='pprice'>" + cartPrice + "</td></tr>";
					
						$cartBody.html( $cartBody.html() + cartHTML );
					}
				} else {
					$cartBody.html( "" );	
				}

				if( cartItems.length > 0 ) {
				
					var cartTotal = this.storage.getItem( this.total );
					var cartShipping = this.storage.getItem( this.shippingRates );
					var subTot = this._convertString( cartTotal ) + this._convertString( cartShipping );
				
					this.$subTotal[0].innerHTML = this.currency + " " + this._convertNumber( subTot );
					this.$shipping[0].innerHTML = this.currency + " " + cartShipping;
				} else {
					this.$subTotal[0].innerHTML = this.currency + " " + 0.00;
					this.$shipping[0].innerHTML = this.currency + " " + 0.00;	
				}
			
			}
		},
		
		// Empties the cart by calling the _emptyCart() method
		// @see $.Shop._emptyCart()
		
		function emptyCart() {
            debugger;;;
			var me = this;
			if( me.$emptyCartBtn.length ) {
				me.$emptyCartBtn.on( "click", function() {
					me._emptyCart();
				});
			}
		},
		
		// Updates the cart
		
		function updateCart() {
			var me = this;
		  if( me.$updateCartBtn.length ) {
			me.$updateCartBtn.on( "click", function() {
				var $rows = me.$formCart.find( "tbody tr" );
				var cart = me.storage.getItem( me.cartName );
				var shippingRates = me.storage.getItem( me.shippingRates );
				var total = me.storage.getItem( me.total );
				
				var updatedTotal = 0;
				var totalQty = 0;
				var updatedCart = {};
				updatedCart.items = [];
				
				$rows.each(function() {
					var $row = $( this );
					var pname = $.trim( $row.find( ".pname" ).text() );
					var pqty = me._convertString( $row.find( ".pqty > .qty" ).val() );
					var pprice = me._convertString( me._extractPrice( $row.find( ".pprice" ) ) );
					
					var cartObj = {
						product: pname,
						price: pprice,
						qty: pqty
					};
					
					updatedCart.items.push( cartObj );
					
					var subTotal = pqty * pprice;
					updatedTotal += subTotal;
					totalQty += pqty;
				});
				
				me.storage.setItem( me.total, me._convertNumber( updatedTotal ) );
				me.storage.setItem( me.shippingRates, me._convertNumber( me._calculateShipping( totalQty ) ) );
				me.storage.setItem( me.cartName, me._toJSONString( updatedCart ) );
				
			});
		  }
		},
		
		// Adds items to the shopping cart
		
		function handleAddToCartForm() {
			var me = this;
			me.$formAddToCart.each(function() {
				var $form = $( this );
				var $product = $form.parent();
				var price = me._convertString( $product.data( "price" ) );
				var name =  $product.data( "name" );
				
				$form.on( "submit", function() {
					var qty = me._convertString( $form.find( ".qty" ).val() );
					var subTotal = qty * price;
					var total = me._convertString( me.storage.getItem( me.total ) );
					var sTotal = total + subTotal;
					me.storage.setItem( me.total, sTotal );
					me._addToCart({
						product: name,
						price: price,
						qty: qty
					});
					var shipping = me._convertString( me.storage.getItem( me.shippingRates ) );
					var shippingRates = me._calculateShipping( qty );
					var totalShipping = shipping + shippingRates;
					
					me.storage.setItem( me.shippingRates, totalShipping );
				});
			});
		},
		
		// Handles the checkout form by adding a validation routine and saving user's info into the session storage
		
		function handleCheckoutOrderForm() {
			var me = this;
			if( me.$checkoutOrderForm.length ) {
				var $sameAsBilling = $( "#same-as-billing" );
				$sameAsBilling.on( "change", function() {
					var $check = $( this );
					if( $check.prop( "checked" ) ) {
						$( "#fieldset-shipping" ).slideUp( "normal" );
					} else {
						$( "#fieldset-shipping" ).slideDown( "normal" );
					}
				});
				
				me.$checkoutOrderForm.on( "submit", function() {
					var $form = $( this );
					var valid = me._validateForm( $form );
					
					if( !valid ) {
						return valid;
					} else {
						me._saveFormData( $form );
					}
				});
			}
		},
		
		// Private methods
		
		
		// Empties the session storage
		
		function _emptyCart() {
			this.storage.clear();
		},
		
		/* Format a number by decimal places
		 * @param num Number the number to be formatted
		 * @param places Number the decimal places
		 * @returns n Number the formatted number
		 */
		 
		 
		
		function _formatNumber( num, places ) {
			var n = num.toFixed( places );
			return n;
		}
		
		/* Extract the numeric portion from a string
		 * @param element Object the jQuery element that contains the relevant string
		 * @returns price String the numeric string
		 */
		
		
		function _extractPrice( element ) {
			var me = this;
			var text = element.text();
			var price = text.replace( me.currencyString, "" ).replace( " ", "" );
			return price;
		}
		
		/* Converts a numeric string into a number
		 * @param numStr String the numeric string to be converted
		 * @returns num Number the number
		 */
		
		function _convertString( numStr ) {
			var num;
			if( /^[-+]?[0-9]+\.[0-9]+$/.test( numStr ) ) {
				num = parseFloat( numStr );
			} else if( /^\d+$/.test( numStr ) ) {
				num = parseInt( numStr, 10 );
			} else {
				num = Number( numStr );
			}
			
			if( !isNaN( num ) ) {
				return num;
			} else {
				console.warn( numStr + " cannot be converted into a number" );
				return false;
			}
		}
		
		/* Converts a number to a string
		 * @param n Number the number to be converted
		 * @returns str String the string returned
		 */
		
		function _convertNumber( n ) {
			var str = n.toString();
			return str;
		}
		
		/* Converts a JSON string to a JavaScript object
		 * @param str String the JSON string
		 * @returns obj Object the JavaScript object
		 */
		
		function _toJSONObject( str ) {
			var obj = JSON.parse( str );
			return obj;
		}
		
		/* Converts a JavaScript object to a JSON string
		 * @param obj Object the JavaScript object
		 * @returns str String the JSON string
		 */
		
		
		function _toJSONString( obj ) {
			var str = JSON.stringify( obj );
			return str;
		}
		
		
		/* Add an object to the cart as a JSON string
		 * @param values Object the object to be added to the cart
		 * @returns void
		 */
		
		
		function _addToCart( values ) {
			var cart = this.storage.getItem( this.cartName );
			
			var cartObject = this._toJSONObject( cart );
			var cartCopy = cartObject;
			var items = cartCopy.items;
			items.push( values );
			
			this.storage.setItem( this.cartName, this._toJSONString( cartCopy ) );
		}
		
		/* Custom shipping rates calculation based on the total quantity of items in the cart
		 * @param qty Number the total quantity of items
		 * @returns shipping Number the shipping rates
		 */
		
		function _calculateShipping( qty ) {
			var shipping = 0;
			if( qty >= 6 ) {
				shipping = 10;
			}
			if( qty >= 12 && qty <= 30 ) {
				shipping = 20;	
			}
			
			if( qty >= 30 && qty <= 60 ) {
				shipping = 30;	
			}
			
			if( qty > 60 ) {
				shipping = 0;
			}
			
			return shipping;
		
		}
		
		/* Validates the checkout form
		 * @param form Object the jQuery element of the checkout form
		 * @returns valid Boolean true for success, false for failure
		 */
		 
		 
		
		function _validateForm( form ) {
			var me = this;
			var fields = me.requiredFields;
			var $visibleSet = form.find( "fieldset:visible" );
			var valid = true;
			
			form.find( ".message" ).remove();
			
		  $visibleSet.each(function() {
			
			$( this ).find( ":input" ).each(function() {
				var $input = $( this );
				var type = $input.data( "type" );
				var msg = $input.data( "message" );
				
				if( type == "string" ) {
					if( $input.val() == fields.str.value ) {
						$( "<span class='message'/>" ).text( msg ).
						insertBefore( $input );
						
						valid = false;
					}
				} else {
					if( !fields.expression.value.test( $input.val() ) ) {
						$( "<span class='message'/>" ).text( msg ).
						insertBefore( $input );
						
						valid = false;
					}
				}
				
			});
		  });
			
			return valid;
		
		}
		
		/* Save the data entered by the user in the ckeckout form
		 * @param form Object the jQuery element of the checkout form
		 * @returns void
		 */
		
		
		 function ( form ) {
			var me = this;
			var $visibleSet = form.find( "fieldset:visible" );
			
			$visibleSet.each(function() {
				var $set = $( this );
				if( $set.is( "#fieldset-billing" ) ) {
					var name = $( "#name", $set ).val();
					var email = $( "#email", $set ).val();
					var city = $( "#city", $set ).val();
					var address = $( "#address", $set ).val();
					var zip = $( "#zip", $set ).val();
					var country = $( "#country", $set ).val();
					
					me.storage.setItem( "billing-name", name );
					me.storage.setItem( "billing-email", email );
					me.storage.setItem( "billing-city", city );
					me.storage.setItem( "billing-address", address );
					me.storage.setItem( "billing-zip", zip );
					me.storage.setItem( "billing-country", country );
				} else {
					var sName = $( "#sname", $set ).val();
					var sEmail = $( "#semail", $set ).val();
					var sCity = $( "#scity", $set ).val();
					var sAddress = $( "#saddress", $set ).val();
					var sZip = $( "#szip", $set ).val();
					var sCountry = $( "#scountry", $set ).val();
					
					me.storage.setItem( "shipping-name", sName );
					me.storage.setItem( "shipping-email", sEmail );
					me.storage.setItem( "shipping-city", sCity );
					me.storage.setItem( "shipping-address", sAddress );
					me.storage.setItem( "shipping-zip", sZip );
					me.storage.setItem( "shipping-country", sCountry );
				
				}
			});
		}
	};
	
	$(function() {
		var shop = new $.Shop( "#site" );
	});

