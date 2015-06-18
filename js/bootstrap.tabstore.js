/**!
 * Tabstore Component for Twitter Bootstrap
 *
 * @author TriGlav <serghspm@inbox.ru>
 * version: 1.1.0
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */


(function ($) {
	'use strict';

	var console = window.console || {
		log: function () {},
		error: function () {}
	};


	var Store = function (element, options) {
		this.$element = element;
		this.options = $.extend(this.defaults, options || {});
	};

	Store.version = '1.1.0';

	Store.defaults = {
		key: 'bootstrap-tabs-restore-key',
		selector: 'a[data-toggle="tab"]',
		storage: 'localStorage',
		track: true,
		debug: false
	};

	Store.prototype.log = function (message, type) {
		if (this.options.debug || type === 'error') {
			console[type]('[BootstrapTabStore]: ' + message);
		}
	};

	Store.prototype.localStorage = function (data) {
		if (window.localStorage) {
			if (data) {
				if (data instanceof Array) {
					window.localStorage.setItem(this.options.key, JSON.stringify(data));
					return true;
				}
				this.log('Wrong data from update handler', 'error');
				return false;
			} else {
				data = window.localStorage.getItem(this.options.key) || '[]';
				try {
					data = JSON.parse(data);
				} catch (e) {
					data = [];
					this.log('Wrong data from storage', 'error');
				}
				return data;
			}
		}
		return [];
	};

	Store.prototype.store = function (data) {
		if (this[this.options.storage]) {
			return this[this.options.storage](data);
		}
		this.log('Unknown storage driver: ' + this.options.storage, 'error');
		return [];
	};

	Store.prototype.update = function (e) {
		var $this = e.data,
			id = ($this.$element.attr('href') || '').split('#')[1],
			data = $this.store(),
			remove = e.type === 'hidden',
			index;

		if (id) {
			index = data.indexOf(id);
			if (remove) {
				if (index >= 0) {
					data.splice(index, 1);
				}
			} else {
				if (index === -1) {
					data.push(id);
				}
			}
			$this.store(data);
			$this.$element.trigger(remove ? 'hidden.bs.tabstore' : 'shown.bs.tabstore', $this);
		} else {
			this.log('Id tab is missing', 'error');
		}
	};

	Store.prototype.restore = function () {
		var stored = this.store(),
			id = (this.$element.attr('href') || '').split('#')[1];
		if (id && stored.indexOf(id) >= 0) {
			this.$element.tab('show');
		}
	};

	Store.prototype.on = function () {
		if (this.options.track) {
			this.$element.on('shown.bs.tab hidden.bs.tab', null, this, this.update);
		}
	};

	Store.prototype.off = function () {
		this.$element.off('shown.bs.tab hidden.bs.tab', null, this.update);
	};

	Store.prototype.init = function () {
		this.on();
		this.restore();
	};


	$.fn.bootstrapTabRestore = function (options) {
		var action = typeof options === 'string' ? options : 'init';
		options = $.extend(Store.defaults, options === 'string' || !options ? {} : options);
		this.filter(options.selector).add(this.find(options.selector)).each(function () {
			var $this = $(this),
				instance = $this.data('bs.tabstore');

			if (!instance) {
				instance = new Store($this, options);
				$this.data('bs.tabstore', instance);
			}

			if (instance[action]) {
				instance[action]();
			} else {
				$this.log('Unknown action ' + action, 'error');
			}
		});
	};

	$.bootstrapTabRestore = function (options) {
		$('body').bootstrapTabRestore(options || {});
	};

	$(function () {
		$('[data-action="store"]').bootstrapTabRestore();
	});


})(jQuery);