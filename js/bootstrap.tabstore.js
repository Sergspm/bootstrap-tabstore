/**!
 * Tabstore Component for Twitter Bootstrap
 *
 * @author TriGlav <serghspm@inbox.ru>
 * version: 1.0.1
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * TODO: add passing options from data-attribute
 * TODO: add debugging
 * TODO: add methods to activate/deactivate
 * TODO: add events
 */


(function ($) {

	var Defaults = {
		key: 'bootstrap-tabs-restore-key',
		selector: 'a[data-toggle="tab"]',
		storage: 'localStorage',
		trackShowEvent: 'shown.bs.tab',
		trackHideEvent: 'hidden.bs.tab',
		track: true,
		debug: false
	};

	var console = window.console || { log: function () {}, error: function () {} };

	var log = function (options, message, type) {
		if (options.debug) {
			console[type]('[BootstrapTabStore]: ' + message);
		}
	};

	var storages = {
		localStorage: function (options, stored) {
			var data = [];
			if (window.localStorage) {
				if (stored) {
					if (stored instanceof Array) {
						data = stored;
					}
					window.localStorage.setItem(options.key, JSON.stringify(data));
				} else {
					stored = window.localStorage.getItem(options.key) || '[]';
					try {
						data = JSON.parse(stored);
					} catch (e) {
						data = [];
						log(options, 'Wrong data from storage', 'error');
					}
				}
			}
			return data;
		}
	};

	var restore = function (options) {
		var stored = storages[options.storage] ? storages[options.storage](options) : [];
		options.tabs.each(function () {
			var id = (this.href || '').split('#')[1];
			if (id && stored.indexOf(id) >= 0) {
				$(this).tab('show');
			}
		});
	};


	var store = function (item, options, remove) {
		var id = (item.href || '').split('#')[1],
			stored = storages[options.storage] ? storages[options.storage](options) : [],
			index;

		if (id) {
			index = stored.indexOf(id);
			if (remove) {
				if (index >= 0) {
					stored.splice(index, 1);
				}
			} else {
				if (index === -1) {
					stored.push(id);
				}
			}
			storages[options.storage] && storages[options.storage](options, stored);
		}
	};


	$.fn.bootstrapTabRestore = function (options) {
		options = $.extend(Defaults, options || {});
		options.tabs = this.filter(options.selector).add(this.find(options.selector));
		if (options.track) {
			options.tabs
				.on(options.trackShowEvent, function (e) {
					store(e.target, options);
				})
				.on(options.trackHideEvent, function (e) {
					store(e.target, options, true);
				});
		}
		restore(options);
	};

	$.bootstrapTabRestore = function (options) {
		$('body').bootstrapTabRestore(options || {});
	};


	$(function () {
		$('[data-action="store"]').bootstrapTabRestore();
	});


})(jQuery);