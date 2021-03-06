var REQUIRED_JQUERY = 1.9;
var JQUERY_INJECTED = false;
var WIDGET_LOADED = false;
var SHOPPING_CART = 'none';
var CUSTOMER_EMAIL = '';
var CART_LINK = '';
var API_HOST = 'https://goapi.curtmfg.com';
var API_KEY = '883d4046-8b96-11e4-9475-42010af00d4e';
var LOOKUP_HTML = Handlebars.compile(`
	{{#registerPartial "paypal"}}
		<form class="paypal" target="_blank" action="https://www.paypal.com/cgi-bin/webscr" method="post">
			<div class="row">
				<div class="col-md-5">
					<span class="price accPrice">{{getPrice this}}</span>
					<label>Qty</label>
					<select name="quantity" style="min-width:40px;display:inline">
						<option>1</option>
						<option>2</option>
						<option>3</option>
						<option>4</option>
						<option>5</option>
					</select>
				</div>
				<div class="col-md-7">
					<input type="hidden" name="item_number" value="{{this.short_description}} #{{this.part_number}}" />
					<input type="hidden" name="cmd" value="_xclick" />
					<input type="hidden" name="no_note" value="1" />
					<input type="hidden" name="business" value="{{../cart.email}}" />
					<input type="hidden" name="currency_code" value="USD" />
					<input type="hidden" name="return" value="{{../cart.location}}" />
					<input type="hidden" name="item_name" value="{{this.short_description}}" />
					<input type="hidden" name="amount" value="{{getPrice this}}" />
					<input type="image" name="submit" src="https://www.paypalobjects.com/webstatic/en_US/btn/btn_pponly_142x27.png" border="0" align="top" alt="Check out with PayPal" />
				</div>
			</div>
		</form>
	{{/registerPartial}}
	{{#registerPartial "shopify"}}
		<form class="shopify" action="{{../cart.link}}/cart/add.js" onSubmit="shopifySubmit(event)" method="post" class="form-inline">
			<input type="hidden" name="product_id" value="{{this.customer.cart_reference}}">
			<div class="row">
				<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
					<p class="price accPrice">{{getPrice this}}</p>
					<div class="form-group">
						<label>Qty</label>
						<input type="number" class="form-control" name="qty" value="1">
					</div>
				</div>
				<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
					<div class="product-form__item product-form__item--submit">
						<button type="submit" name="add" id="AddToCart" class="btn btn--full product-form__cart-submit">
							<span id="AddToCartText">Add to Cart</span>
						</button>
					</div>
					{{#if this.install_sheet}}
						<a href="{{getInstall this.install_sheet}}" target="_blank" title="View Installation Sheet">
							<img src="http://cdn2.bigcommerce.com/server2000/z10l8n/product_images/uploaded_images/setup.jpg" alt="View Installation Sheet">
						</a>
					{{/if}}
				</div>
			</div>
		</form>
	{{/registerPartial}}
	{{#registerPartial "custom"}}
		{{#if_eq ../cart.link ''}}
		{{else}}
		<span class="price">{{getPrice this}}</span>
		<a href="{{generateCartLink ../cart.link this.customer.cart_reference}}" title="Buy Now">
			<img src="https://labs.curtmfg.com/widget_v2/img/checkout.png" alt="Checkout" />
		</a>
		{{/if_eq}}
	{{/registerPartial}}
	{{#registerPartial "price_only"}}
		<span class="price">{{getPrice this}}</span>
	{{/registerPartial}}
	{{#registerPartial "nuera"}}
		<span class="price"><span>Price:</span>{{getPrice this}}</span>
		<form class="nuera" method="post" action="{{generateCartLink ../cart.link this.part_number}}">
			<input name="VariantStyle" id="VariantStyle" type="hidden" value="0" />
			<input name="IsWishList" id="IsWishList" type="hidden" value="0" />
			<input name="IsGiftRegistry" id="IsGiftRegistry" type="hidden" value="0" />
			<input name="UpsellProducts" id="UpsellProducts" type="hidden" value="" />
			<input name="CartRecID" id="CartRecID" type="hidden" value="0" />
			<input name="ProductID" id="ProductID" type="hidden" value="{{this.customer.cart_reference}}" />
			<input name="VariantID" id="VariantID" type="hidden" value="0" />
			<small>Quantity:</small>
			<input name="Quantity" id="Quantity" type="text" value="1" size="3" maxlength="4" />
			<input type="submit" value="Add to Cart" />
		</form>
	{{/registerPartial}}
	{{#registerPartial "fasttrackracks"}}
		<form action="http://www.fasttrackracks.com/store/addtocart.aspx" method="post">
			<div style="padding-top:15px"><span class="price accPrice">{{getPrice this}}</span>
				<label>Qty</label>
				<select name="qty" style="min-width:40px;display:inline">
					<option>1</option>
					<option>2</option>
					<option>3</option>
					<option>4</option>
					<option>5</option>
				</select>
			</div>
			<input type="hidden" name="return" value="{{../cart.location}}" />
			<input type="hidden" name="imageurl" value="{{getImage this.images}}" />
			<input type="hidden" name="ItemNbr" value="{{this.short_description}} #{{this.part_number}}" />
			<input type="hidden" name="product" value="{{vehicleString ../cart.vehicle}} {{this.short_description}} #{{this.part_number}}" />
			<input type="hidden" name="notax" value="null" />
			<input type="hidden" name="price" value="{{getPrice this}}" />
			<input type="hidden" name="weight" value="null" />
			<input type="submit" name="submit" class="fasttrackracks_button" value="Buy Now" />
		</form>
	{{/registerPartial}}
	{{#registerPartial "stowaway2"}}
		<form action="http://www.stowaway2.com/store/addtocart.aspx" method="post">
			<div style="padding-top:15px"><span class="price accPrice">{{getPrice this}}</span>
				<label>Qty</label>
				<select name="qty" style="min-width:40px;display:inline">
					<option>1</option>
					<option>2</option>
					<option>3</option>
					<option>4</option>
					<option>5</option>
				</select>
			</div>
			<input type="hidden" name="return" value="{{../cart.location}}" />
			<input type="hidden" name="imageurl" value="{{getImage this.images}}" />
			<input type="hidden" name="ItemNbr" value="{{this.short_description}} #{{this.part_number}}" />
			<input type="hidden" name="product" value="{{vehicleString ../cart.vehicle}} {{this.short_description}} #{{this.part_number}}" />
			<input type="hidden" name="notax" value="null" />
			<input type="hidden" name="price" value="{{getPrice this}}" />
			<input type="hidden" name="weight" value="null" />
			<input type="submit" name="submit" class="fasttrackracks_button" value="Buy Now" />
		</form>
	{{/registerPartial}}
	{{#registerPartial "bigcommerce"}}
		<form class="bigcommerce" action="{{../cart.link}}/cart.php" method="post" enctype="multipart/form-data" class="form-inline">
			<input type="hidden" name="action" value="add">
			<input type="hidden" name="product_id" value="{{this.customer.cart_reference}}">
			<input type="hidden" name="variation_id" class="CartVariationId" value="">
			<input type="hidden" name="currency_id" value="">
			<div class="row">
				<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">

					<p class="price accPrice">{{getPrice this}}</p>
					<div class="form-group">
						<label>Qty</label>
						<input type="number" class="form-control" name="qty[]" value="1">
					</div>
				</div>
				<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
					<input type="image" src="http://cdn2.bigcommerce.com/server2000/z10l8n/templates/__custom/images/white/AddCartButton.gif?t=1440606443" alt="">
					{{#if this.install_sheet}}
						<a href="{{getInstall this.install_sheet}}" target="_blank" title="View Installation Sheet">
							<img src="http://cdn2.bigcommerce.com/server2000/z10l8n/product_images/uploaded_images/setup.jpg" alt="View Installation Sheet">
						</a>
					{{/if}}
				</div>
			</div>
		</form>
	{{/registerPartial}}


    <div class="form-group">
    {{#if collections}}
        <label class="sr-only" for="aries-widget-collection">Select Category</label><select class="aries-widget-dropdown collection form-control"><option value="">- Select Category - </option>{{#each collections}}<option>{{toUpperCase .}}</option>{{/each}}</select>
    {{/if}}
    {{#if available_years}}
        <label class="sr-only" for="aries-widget-years">Select Vehicle Year</label><select class="aries-widget-dropdown form-control year"><option value="">- Select Vehicle Year - </option>{{#each available_years}}<option>{{.}}</option>{{/each}}</select>
    {{/if}}
    {{#if available_makes}}
        <label class="sr-only" for="aries-widget-makes">Select Vehicle Make</label><select class="aries-widget-dropdown form-control make"><option value="">- Select Vehicle Make - </option>{{#each available_makes}}<option>{{toUpperCase .}}</option>{{/each}}</select>
    {{/if}}
    {{#if available_models}}
        <label class="sr-only" for="aries-widget-models">Select Vehicle Model</label><select class="aries-widget-dropdown form-control model"><option value="">- Select Vehicle Model - </option>{{#each available_models}}<option>{{toUpperCase .}}</option>{{/each}}</select>
    {{/if}}
    {{#if available_styles}}
        <label class="sr-only" for="aries-widget-styles">Select Vehicle Style</label><select class="aries-widget-dropdown form-control style"><option value="">- Select Vehicle Style - </option>{{#each available_styles}}<option>{{toUpperCase .}}</option>{{/each}}</select>
    {{/if}}
		{{#unless collections}}
				<div class="clear-btn">
					<label class="sr-only" for="aries-widget-clear">Clear Vehicle</label>
					<button class="btn btn-primary">
						Clear Vehicle
					</button>
				</div>
		{{/unless}}
    </div>


    {{#if parts}}
	<div class="modal fade" id="imagemodal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
					<h4 class="modal-title" id="myModalLabel">Image preview</h4>
				</div>
				<div class="modal-body">
					<img src="" id="imagepreview" >
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
    <div class="part-results">
        <div class="result-info">
            <div class="col-xs-12 col-sm-12 col-md-3 total-results">
                <span>Total Results: </span>
                <span>{{./parts.length}}</span>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-9">
                <span>{{toUpperCase ././vehicle.collection}} {{././vehicle.year}} {{toUpperCase ././vehicle.make}} {{toUpperCase ././vehicle.model}} {{toUpperCase ././vehicle.style}}</span>
            </div>
            <div class="clearfix"></div>
        </div>
        {{#each ./parts}}
            <div class="part">
                <div class="row">
                    <div class="col-md-7">
                        <h3>{{this.short_description}} #{{this.part_number}}</h3>
                    </div>
                    <div class="col-md-5 checkout {{../cart.type}}">
											{{#partial ../cart.type this}}{{/partial}}
                    </div>
                </div>
                <div>
                    <div class="col-md-4 images">
											<a class="main-handler" href="{{getImage this.images 'full'}}">
												<img src="{{getImage this.images 'Venti'}}" alt="{{this.short_description}}" class="main img-thumbnail">
											</a>
											<div class="img-thumbs">
												{{{getThumbs this.images}}}
											</div>
                    </div>
                    <div class="col-md-8">
                        <table class="table table-striped table-bordered table-condensed">
                            <tbody>
                            {{#each this.attributes}}
                                <tr>
                                    <td>{{name}}</td>
                                    <td>{{value}}</td>
                                </tr>
                            {{/each}}
                            </tbody>
                        </table>
                        <ul>
                        {{#each this.content}}
                            {{#if_eq this.contentType.type 'Bullet'}}
                            <li>{{this.text}}</li>
                            {{/if_eq}}
                        {{/each}}
                    </div>
										<div class="clearfix"></div>
                </div>
            </div>
        {{/each}}
    </div>
    {{/if}}
`);
var VEHICLE = {};

function addStylesheet() {
	var dataStyle = 'index';
	var styl = document.getElementById('aries-widget').getAttribute('data-lookupstyle');
	if (styl !== null && styl !== '') {
		dataStyle = styl;
	}

	if (window.location.hostname.indexOf('localhost') === -1) {
		if (dataStyle.indexOf('://') === -1) {
			dataStyle = '//product-widget.appspot.com/' + dataStyle;
		}
	}

	if (!document.createStylesheet) {
		var nss = document.createElement('link');
		nss.rel = 'stylesheet';
		nss.href = dataStyle;
		var head = document.getElementsByTagName('head');
		if (head !== undefined && head.length > 0) {
			head[0].appendChild(nss);
		}
		return;
	}

	document.createStylesheet(dataStyle);

	return;
}

function addJQuery() {
	if (typeof jQuery === 'undefined' || parseFloat(jQuery.fn.jquery) < REQUIRED_JQUERY) { // jQuery has not been loaded
		if (!JQUERY_INJECTED) {
			document.write('<scr' + 'ipt type=\'text/javascript\' src=\'https://ajax.googleapis.com/ajax/libs/jquery/' + REQUIRED_JQUERY + '/jquery.min.js\'></scr' + 'ipt>');
			JQUERY_INJECTED = true;
		}
		setTimeout(addJQuery(), 50);
	}
}

// This function will return all of the GET data inside the 'vars' array
function getUrlVars() {
	if (window.location.href.indexOf('?') === -1) {
		return [];
	}

	var vars = [];
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	jQuery.each(hashes, function(i, hash) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = decodeURIComponent(hash[1]);
	});
	return vars;
}

// This function will return the GET variable declared in the 'name' variable
// @param : GET variable name to be retrieved
function getUrlVar(name) {
	var hashes = jQuery.getUrlVars();
	if (hashes !== undefined && hashes[name] !== undefined) {
		return hashes[name];
	} else {
		return '';
	}
}

function initialize() {
	addStylesheet();
	addJQuery();

	if (WIDGET_LOADED) {
		return;
	}

	jQuery.extend({
		getUrlVars: getUrlVars,
		getUrlVar: getUrlVar
	});
	jQuery.fn.sort = function() {
		return this.pushStack([].sort.apply(this, arguments), []);
	};
	Handlebars.registerHelper('toUpperCase', function(val) {
		if (val) {
			return val.toUpperCase();
		} else {
			return '';
		}
	});
	Handlebars.registerHelper('getImage', function(images, size) {
		if (images === undefined) {
			return '';
		}
		if (size === undefined) {
			size = 'Grande';
		}

		var i;
		var img;
		var src;
		for (i = 0; i < images.length; i++) {
			img = images[i];
			src = img.path.Scheme + '://' + img.path.Host + img.path.Path;
			if (img.sort === 'a' && img.size === size) {
				return src;
			}
		}

		for (i = 0; i < images.length; i++) {
			img = images[i];
			src = img.path.Scheme + '://' + img.path.Host + img.path.Path;
			if (img.sort === 'a') {
				return src;
			}
		}

		for (i = 0; i < images.length; i++) {
			img = images[i];
			src = img.path.Scheme + '://' + img.path.Host + img.path.Path;
			return src;
		}
	});

	Handlebars.registerHelper('getThumbs', function(images) {
		return getThumbnails(images);
	});

	Handlebars.registerHelper('vehicleString', function(v) {
		return v.year + ' ' + v.make + ' ' + v.model + ' ' + v.style;
	});
	Handlebars.registerHelper('getPrice', function(part) {
		if (part === undefined) {
			return '';
		}

		if (part.customer.price > 0) {
			return '$' + part.customer.price;
		}

		for (var i = 0; i < part.pricing.length; i++) {
			var pr = part.pricing[i];
			if (pr.type === 'List') {
				return '$' + parseFloat(pr.price, 2).toFixed(2);
			}
		}
	});
	Handlebars.registerHelper('getInstall', function(is) {
		if (is === undefined || is === null) {
			return '';
		}

		return is.Scheme + '://' + is.Host + is.Path;
	});
	Handlebars.registerHelper('if_eq', function(a, b, block) {
		if (a === b) {
			return block.fn(this);
		}
		return block.inverse(this);
	});
	Handlebars.registerHelper('generateCartLink', function(a, b) {
		return a.replace('[part_id]', b);
	});
	Handlebars.registerHelper('registerPartial', function(name, options) {
		Handlebars.dynamicPartials = Handlebars.dynamicPartials || {};
		Handlebars.dynamicPartials[name] = function(context, _options) {
			return options.fn(context, _options);
		};
	});
	Handlebars.registerHelper('partial', function(name, context, options) {
		context = context || {};
		var partial = Handlebars.dynamicPartials[name];
		partial = partial || Handlebars.partials[name];
		if (!partial) {
			return '';
		}
		return partial.call(null, context, options);
	});

	var widget = document.getElementById('aries-widget');
	SHOPPING_CART = widget.getAttribute('data-cart');
	CUSTOMER_EMAIL = widget.getAttribute('data-email');
	CART_LINK = widget.getAttribute('data-cart-link') || '';
	var tmpKey = widget.getAttribute('data-key');
	if (tmpKey !== undefined && tmpKey !== null && tmpKey !== '') {
		API_KEY = tmpKey;
	}

	var tempVehicle = parseQueryString();
	if (vehicleIsValid(tempVehicle)) {
		VEHICLE = tempVehicle;
		getVehicle(function() {
			jQuery('.aries-widget-dropdown').on('change', changeHandler);
			jQuery('.img-thumbnail').on('click', imageClicker);
			jQuery('.main-handler').on('click', imagePreview);
			jQuery('.clear-btn button').on('click', clearVehicle);
		});
	} else {
		getCollections(function(data) {
			var obj = {
				collections: data,
				vehicle: VEHICLE
			};
			var colHTML = LOOKUP_HTML(obj);
			jQuery('.aries-widget-dropdown').remove();
			jQuery('#aries-widget').html(colHTML);
			jQuery('.aries-widget-dropdown').on('change', changeHandler);
		});
	}



	WIDGET_LOADED = true;
}

function imagePreview(e) {
	e.preventDefault();
	jQuery('#imagepreview').attr('src', jQuery(this).find('.main').attr('src'));
	jQuery('#imagemodal').modal('show');
}

function parseQueryString() {
	var tmp = {};
	var hashes = jQuery.getUrlVars();

	if (hashes.category === undefined) {
		return {};
	}
	tmp.collection = decodeURIComponent(hashes.category);

	if (hashes.year === undefined) {
		return {};
	}
	tmp.year = decodeURIComponent(hashes.year);

	if (hashes.make === undefined) {
		return {};
	}
	tmp.make = decodeURIComponent(hashes.make);

	if (hashes.model === undefined) {
		return {};
	}
	tmp.model = decodeURIComponent(hashes.model);

	if (hashes.style === undefined) {
		return {};
	}
	tmp.style = decodeURIComponent(hashes.style);

	return tmp;
}

function vehicleIsValid(v) {
	if (v.collection === undefined || v.collection === '') {
		return false;
	}
	if (v.year === undefined || v.year === '') {
		return false;
	}
	if (v.make === undefined || v.make === '') {
		return false;
	}
	if (v.model === undefined || v.model === '') {
		return false;
	}
	if (v.style === undefined || v.style === '') {
		return false;
	}

	return true;
}

function changeHandler() {
	var val = jQuery(this).val();
	if (val.length === 0) {
		return;
	}

	if (jQuery(this).hasClass('collection')) {
		VEHICLE.collection = val.toLowerCase();
	} else if (jQuery(this).hasClass('year')) {
		VEHICLE.year = val.toLowerCase();
	} else if (jQuery(this).hasClass('make')) {
		VEHICLE.make = val.toLowerCase();
	} else if (jQuery(this).hasClass('model')) {
		VEHICLE.model = val.toLowerCase();
	} else if (jQuery(this).hasClass('style')) {
		VEHICLE.style = val.toLowerCase();
	}
	getVehicle(function() {
		jQuery('.aries-widget-dropdown').on('change', changeHandler);
		jQuery('.img-thumbnail').on('click', imageClicker);
		jQuery('.main-handler').on('click', imagePreview);
		jQuery('.clear-btn button').on('click', clearVehicle);
	});
}

function imageClicker() {
	var full = jQuery(this).data('full');
	// var main = jQuery(this).closest('.images').find('.main').attr('src');

	jQuery(this).closest('.images').find('.main').attr('src', full);
}

function clearVehicle() {
	VEHICLE = {};
	getCollections(function(data) {
		var obj = {
			collections: data,
			vehicle: {}
		};
		var colHTML = LOOKUP_HTML(obj);
		jQuery('.aries-widget-dropdown').remove();
		jQuery('#aries-widget').html(colHTML);
		jQuery('.aries-widget-dropdown').on('change', changeHandler);
	});
}

function getCollections(callback) {
	var req = jQuery.ajax({
		type: 'GET',
		url: API_HOST + '/vehicle/mongo/cols',
		dataType: 'json',
		data: {
			key: API_KEY
		}
	});

	req.done(function(data) {
		callback(data);
	});
}

function getVehicle(callback) {
	var req = jQuery.ajax({
		type: 'POST',
		url: API_HOST + '/vehicle/mongo/allCollections?key=' + API_KEY,
		dataType: 'json',
		data: jQuery.param(VEHICLE)
	});

	req.done(function(data) {
		getCollections(function(cols) {
			data.vehicle = VEHICLE;

			if (SHOPPING_CART === 'nuera') {
				var returnURL = window.location.pathname;
				if (returnURL.indexOf('?') !== -1) {
					returnURL += '&partID=[part_id]';
				} else {
					returnURL += '?partID=[part_id]';
				}

				if (CART_LINK === '') {
					CART_LINK = '/addtocart.aspx?returnurl=' + returnURL;
				} else {
					if (CART_LINK.indexOf('?') !== -1) {
						CART_LINK += '&returnurl=' + returnURL;
					} else {
						CART_LINK += '?returnurl=' + returnURL;
					}
				}
			}
			data.cart = {
				type: SHOPPING_CART,
				location: window.location.href,
				email: CUSTOMER_EMAIL,
				link: CART_LINK,
				vehicle: VEHICLE
			};

			if (vehicleIsValid(data.vehicle)) {
				data.collections = cols;
				VEHICLE = {};
			} else {
				data.parts = [];
			}

			var html = LOOKUP_HTML(data);
			jQuery('#aries-widget .form-group').remove();
			jQuery('#aries-widget').html(html);

			callback();
		});

	});
}

function getThumbnails(images) {
	if (images === undefined) {
		return '';
	}

	var result = '';
	var src = '';
	var str = '';
	var i;
	for (i = 0; i < images.length; i++) {
		var img = images[i];
		if (img.size === 'Tall') {
			src = img.path.Scheme + '://' + img.path.Host + img.path.Path;

			var fullsrc = '';
			var k;
			var img2;
			for (k = 0; k < images.length; k++) {
				img2 = images[k];
				if (img2.sort === img.sort && img2.size === 'Venti') {
					fullsrc = img2.path.Scheme + '://' + img2.path.Host + img2.path.Path;
					break;
				}
			}
			if (fullsrc === '') {
				for (k = 0; k < images.length; k++) {
					img2 = images[k];
					if (img2.sort === img.sort && img2.size === 'Grande') {
						fullsrc = img2.path.Scheme + '://' + img2.path.Host + img2.path.Path;
						break;
					}
				}
			}
			if (fullsrc === '') {
				fullsrc = src;
			}

			str = '<img src="' + src + '" alt="' + this.short_description + '" data-full="' + fullsrc + '" class="mini img-thumbnail">';
			result = result.concat(str);
		}
	}

	return result;
}

function shopifySubmit(e) { //eslint-disable-line no-unused-vars
	e.preventDefault();
	var forms = jQuery(e.target).get();
	if (!forms || forms.length === 0) {
		return;
	}

	var form = forms[0];
	var obj = {
		id: parseInt(jQuery(form).find('input[name=product_id]').val(), 0),
		quantity: parseInt(jQuery(form).find('input[name=qty]').val(), 0)
	};

	// TODO: Remove this for production use
	obj.id = 18290506375;
	jQuery(form).find('.cart-error').remove();
	jQuery(form).find('.cart-message').remove();
	jQuery.ajax({
		type: 'post',
		url: jQuery(form).attr('action'),
		dataType: 'json',
		data: obj,
		success: function() {
			jQuery('.site-header__cart .site-header__cart-indicator').removeClass('hide');
			jQuery(form).find('button').after('<span class="cart-message text-success">Item added to cart</span>');
		},
		error: function() {
			jQuery(form).find('button').after('<span class="cart-error text-danger">Failed to add to cart</span>');
		}
	});
}

initialize();
