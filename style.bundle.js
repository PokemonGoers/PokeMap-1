(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
// For more information about browser field, check out the browser field at https://github.com/substack/browserify-handbook#browser-field.

var styleElementsInsertedAtTop = [];

var insertStyleElement = function(styleElement, options) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];

    options = options || {};
    options.insertAt = options.insertAt || 'bottom';

    if (options.insertAt === 'top') {
        if (!lastStyleElementInsertedAtTop) {
            head.insertBefore(styleElement, head.firstChild);
        } else if (lastStyleElementInsertedAtTop.nextSibling) {
            head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
        } else {
            head.appendChild(styleElement);
        }
        styleElementsInsertedAtTop.push(styleElement);
    } else if (options.insertAt === 'bottom') {
        head.appendChild(styleElement);
    } else {
        throw new Error('Invalid value for parameter \'insertAt\'. Must be \'top\' or \'bottom\'.');
    }
};

module.exports = {
    // Create a <link> tag with optional data attributes
    createLink: function(href, attributes) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link');

        link.href = href;
        link.rel = 'stylesheet';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            link.setAttribute('data-' + key, value);
        }

        head.appendChild(link);
    },
    // Create a <style> tag with optional data attributes
    createStyle: function(cssText, attributes, extraOptions) {
        extraOptions = extraOptions || {};

        var style = document.createElement('style');
        style.type = 'text/css';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            style.setAttribute('data-' + key, value);
        }

        if (style.sheet) { // for jsdom and IE9+
            style.innerHTML = cssText;
            style.sheet.cssText = cssText;
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        } else if (style.styleSheet) { // for IE8 and below
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
            style.styleSheet.cssText = cssText;
        } else { // for Chrome, Firefox, and Safari
            style.appendChild(document.createTextNode(cssText));
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        }
    }
};

},{}],2:[function(require,module,exports){
var css = "/* required styles */\n.leaflet-map-pane,\n.leaflet-tile,\n.leaflet-marker-icon,\n.leaflet-marker-shadow,\n.leaflet-tile-pane,\n.leaflet-tile-container,\n.leaflet-overlay-pane,\n.leaflet-shadow-pane,\n.leaflet-marker-pane,\n.leaflet-popup-pane,\n.leaflet-overlay-pane svg,\n.leaflet-zoom-box,\n.leaflet-image-layer,\n.leaflet-layer {\n  position: absolute;\n  left: 0;\n  top: 0;\n}\n.leaflet-container {\n  overflow: hidden;\n  -ms-touch-action: none;\n  touch-action: none;\n}\n.leaflet-tile,\n.leaflet-marker-icon,\n.leaflet-marker-shadow {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  user-select: none;\n  -webkit-user-drag: none;\n}\n.leaflet-marker-icon,\n.leaflet-marker-shadow {\n  display: block;\n}\n/* map is broken in FF if you have max-width: 100% on tiles */\n.leaflet-container img {\n  max-width: none !important;\n}\n/* stupid Android 2 doesn't understand \"max-width: none\" properly */\n.leaflet-container img.leaflet-image-layer {\n  max-width: 15000px !important;\n}\n.leaflet-tile {\n  filter: inherit;\n  visibility: hidden;\n}\n.leaflet-tile-loaded {\n  visibility: inherit;\n}\n.leaflet-zoom-box {\n  width: 0;\n  height: 0;\n}\n/* workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=888319 */\n.leaflet-overlay-pane svg {\n  -moz-user-select: none;\n}\n.leaflet-tile-pane {\n  z-index: 2;\n}\n.leaflet-objects-pane {\n  z-index: 3;\n}\n.leaflet-overlay-pane {\n  z-index: 4;\n}\n.leaflet-shadow-pane {\n  z-index: 5;\n}\n.leaflet-marker-pane {\n  z-index: 6;\n}\n.leaflet-popup-pane {\n  z-index: 7;\n}\n.leaflet-vml-shape {\n  width: 1px;\n  height: 1px;\n}\n.lvml {\n  behavior: url(#default#VML);\n  display: inline-block;\n  position: absolute;\n}\n/* control positioning */\n.leaflet-control {\n  position: relative;\n  z-index: 7;\n  pointer-events: auto;\n}\n.leaflet-top,\n.leaflet-bottom {\n  position: absolute;\n  z-index: 1000;\n  pointer-events: none;\n}\n.leaflet-top {\n  top: 0;\n}\n.leaflet-right {\n  right: 0;\n}\n.leaflet-bottom {\n  bottom: 0;\n}\n.leaflet-left {\n  left: 0;\n}\n.leaflet-control {\n  float: left;\n  clear: both;\n}\n.leaflet-right .leaflet-control {\n  float: right;\n}\n.leaflet-top .leaflet-control {\n  margin-top: 10px;\n}\n.leaflet-bottom .leaflet-control {\n  margin-bottom: 10px;\n}\n.leaflet-left .leaflet-control {\n  margin-left: 10px;\n}\n.leaflet-right .leaflet-control {\n  margin-right: 10px;\n}\n/* zoom and fade animations */\n.leaflet-fade-anim .leaflet-tile,\n.leaflet-fade-anim .leaflet-popup {\n  opacity: 0;\n  -webkit-transition: opacity 0.2s linear;\n  -moz-transition: opacity 0.2s linear;\n  -o-transition: opacity 0.2s linear;\n  transition: opacity 0.2s linear;\n}\n.leaflet-fade-anim .leaflet-tile-loaded,\n.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {\n  opacity: 1;\n}\n.leaflet-zoom-anim .leaflet-zoom-animated {\n  -webkit-transition: -webkit-transform 0.25s cubic-bezier(0,0,0.25,1);\n  -moz-transition: -moz-transform 0.25s cubic-bezier(0,0,0.25,1);\n  -o-transition: -o-transform 0.25s cubic-bezier(0,0,0.25,1);\n  transition: transform 0.25s cubic-bezier(0,0,0.25,1);\n}\n.leaflet-zoom-anim .leaflet-tile,\n.leaflet-pan-anim .leaflet-tile,\n.leaflet-touching .leaflet-zoom-animated {\n  -webkit-transition: none;\n  -moz-transition: none;\n  -o-transition: none;\n  transition: none;\n}\n.leaflet-zoom-anim .leaflet-zoom-hide {\n  visibility: hidden;\n}\n/* cursors */\n.leaflet-clickable {\n  cursor: pointer;\n}\n.leaflet-container {\n  cursor: -webkit-grab;\n  cursor: -moz-grab;\n}\n.leaflet-popup-pane,\n.leaflet-control {\n  cursor: auto;\n}\n.leaflet-dragging .leaflet-container,\n.leaflet-dragging .leaflet-clickable {\n  cursor: move;\n  cursor: -webkit-grabbing;\n  cursor: -moz-grabbing;\n}\n/* visual tweaks */\n.leaflet-container {\n  background: #ddd;\n  outline: 0;\n}\n.leaflet-container a {\n  color: #0078A8;\n}\n.leaflet-container a.leaflet-active {\n  outline: 2px solid orange;\n}\n.leaflet-zoom-box {\n  border: 2px dotted #38f;\n  background: rgba(255,255,255,0.5);\n}\n/* general typography */\n.leaflet-container {\n  font: 12px/1.5 \"Helvetica Neue\", Arial, Helvetica, sans-serif;\n}\n/* general toolbar styles */\n.leaflet-bar {\n  box-shadow: 0 1px 5px rgba(0,0,0,0.65);\n  border-radius: 4px;\n}\n.leaflet-bar a,\n.leaflet-bar a:hover {\n  background-color: #fff;\n  border-bottom: 1px solid #ccc;\n  width: 26px;\n  height: 26px;\n  line-height: 26px;\n  display: block;\n  text-align: center;\n  text-decoration: none;\n  color: black;\n}\n.leaflet-bar a,\n.leaflet-control-layers-toggle {\n  background-position: 50% 50%;\n  background-repeat: no-repeat;\n  display: block;\n}\n.leaflet-bar a:hover {\n  background-color: #f4f4f4;\n}\n.leaflet-bar a:first-child {\n  border-top-left-radius: 4px;\n  border-top-right-radius: 4px;\n}\n.leaflet-bar a:last-child {\n  border-bottom-left-radius: 4px;\n  border-bottom-right-radius: 4px;\n  border-bottom: none;\n}\n.leaflet-bar a.leaflet-disabled {\n  cursor: default;\n  background-color: #f4f4f4;\n  color: #bbb;\n}\n.leaflet-touch .leaflet-bar a {\n  width: 30px;\n  height: 30px;\n  line-height: 30px;\n}\n/* zoom control */\n.leaflet-control-zoom-in,\n.leaflet-control-zoom-out {\n  font: bold 18px 'Lucida Console', Monaco, monospace;\n  text-indent: 1px;\n}\n.leaflet-control-zoom-out {\n  font-size: 20px;\n}\n.leaflet-touch .leaflet-control-zoom-in {\n  font-size: 22px;\n}\n.leaflet-touch .leaflet-control-zoom-out {\n  font-size: 24px;\n}\n/* layers control */\n.leaflet-control-layers {\n  box-shadow: 0 1px 5px rgba(0,0,0,0.4);\n  background: #fff;\n  border-radius: 5px;\n}\n.leaflet-control-layers-toggle {\n  background-image: url(node_modules/leaflet/dist/images/layers.png);\n  width: 36px;\n  height: 36px;\n}\n.leaflet-retina .leaflet-control-layers-toggle {\n  background-image: url(node_modules/leaflet/dist/images/layers-2x.png);\n  background-size: 26px 26px;\n}\n.leaflet-touch .leaflet-control-layers-toggle {\n  width: 44px;\n  height: 44px;\n}\n.leaflet-control-layers .leaflet-control-layers-list,\n.leaflet-control-layers-expanded .leaflet-control-layers-toggle {\n  display: none;\n}\n.leaflet-control-layers-expanded .leaflet-control-layers-list {\n  display: block;\n  position: relative;\n}\n.leaflet-control-layers-expanded {\n  padding: 6px 10px 6px 6px;\n  color: #333;\n  background: #fff;\n}\n.leaflet-control-layers-selector {\n  margin-top: 2px;\n  position: relative;\n  top: 1px;\n}\n.leaflet-control-layers label {\n  display: block;\n}\n.leaflet-control-layers-separator {\n  height: 0;\n  border-top: 1px solid #ddd;\n  margin: 5px -10px 5px -6px;\n}\n/* attribution and scale controls */\n.leaflet-container .leaflet-control-attribution {\n  background: #fff;\n  background: rgba(255, 255, 255, 0.7);\n  margin: 0;\n}\n.leaflet-control-attribution,\n.leaflet-control-scale-line {\n  padding: 0 5px;\n  color: #333;\n}\n.leaflet-control-attribution a {\n  text-decoration: none;\n}\n.leaflet-control-attribution a:hover {\n  text-decoration: underline;\n}\n.leaflet-container .leaflet-control-attribution,\n.leaflet-container .leaflet-control-scale {\n  font-size: 11px;\n}\n.leaflet-left .leaflet-control-scale {\n  margin-left: 5px;\n}\n.leaflet-bottom .leaflet-control-scale {\n  margin-bottom: 5px;\n}\n.leaflet-control-scale-line {\n  border: 2px solid #777;\n  border-top: none;\n  line-height: 1.1;\n  padding: 2px 5px 1px;\n  font-size: 11px;\n  white-space: nowrap;\n  overflow: hidden;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n  background: #fff;\n  background: rgba(255, 255, 255, 0.5);\n}\n.leaflet-control-scale-line:not(:first-child) {\n  border-top: 2px solid #777;\n  border-bottom: none;\n  margin-top: -2px;\n}\n.leaflet-control-scale-line:not(:first-child):not(:last-child) {\n  border-bottom: 2px solid #777;\n}\n.leaflet-touch .leaflet-control-attribution,\n.leaflet-touch .leaflet-control-layers,\n.leaflet-touch .leaflet-bar {\n  box-shadow: none;\n}\n.leaflet-touch .leaflet-control-layers,\n.leaflet-touch .leaflet-bar {\n  border: 2px solid rgba(0,0,0,0.2);\n  background-clip: padding-box;\n}\n/* popup */\n.leaflet-popup {\n  position: absolute;\n  text-align: center;\n}\n.leaflet-popup-content-wrapper {\n  padding: 1px;\n  text-align: left;\n  border-radius: 12px;\n}\n.leaflet-popup-content {\n  margin: 13px 19px;\n  line-height: 1.4;\n}\n.leaflet-popup-content p {\n  margin: 18px 0;\n}\n.leaflet-popup-tip-container {\n  margin: 0 auto;\n  width: 40px;\n  height: 20px;\n  position: relative;\n  overflow: hidden;\n}\n.leaflet-popup-tip {\n  width: 17px;\n  height: 17px;\n  padding: 1px;\n  margin: -10px auto 0;\n  -webkit-transform: rotate(45deg);\n  -moz-transform: rotate(45deg);\n  -ms-transform: rotate(45deg);\n  -o-transform: rotate(45deg);\n  transform: rotate(45deg);\n}\n.leaflet-popup-content-wrapper,\n.leaflet-popup-tip {\n  background: white;\n  box-shadow: 0 3px 14px rgba(0,0,0,0.4);\n}\n.leaflet-container a.leaflet-popup-close-button {\n  position: absolute;\n  top: 0;\n  right: 0;\n  padding: 4px 4px 0 0;\n  text-align: center;\n  width: 18px;\n  height: 14px;\n  font: 16px/14px Tahoma, Verdana, sans-serif;\n  color: #c3c3c3;\n  text-decoration: none;\n  font-weight: bold;\n  background: transparent;\n}\n.leaflet-container a.leaflet-popup-close-button:hover {\n  color: #999;\n}\n.leaflet-popup-scrolled {\n  overflow: auto;\n  border-bottom: 1px solid #ddd;\n  border-top: 1px solid #ddd;\n}\n.leaflet-oldie .leaflet-popup-content-wrapper {\n  zoom: 1;\n}\n.leaflet-oldie .leaflet-popup-tip {\n  width: 24px;\n  margin: 0 auto;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";\n  filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);\n}\n.leaflet-oldie .leaflet-popup-tip-container {\n  margin-top: -1px;\n}\n.leaflet-oldie .leaflet-control-zoom,\n.leaflet-oldie .leaflet-control-layers,\n.leaflet-oldie .leaflet-popup-content-wrapper,\n.leaflet-oldie .leaflet-popup-tip {\n  border: 1px solid #999;\n}\n/* div icon */\n.leaflet-div-icon {\n  background: #fff;\n  border: 1px solid #666;\n}\nhtml,\nbody,\n#mapid {\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n}\n.custom .leaflet-popup-content-wrapper .pokemon-details-popup {\n  text-align: center;\n  width: 300px;\n}\n.custom .leaflet-popup-content-wrapper .pokemon-details-popup .pokemon-image {\n  vertical-align: top;\n  float: left;\n}\n.custom .leaflet-popup-content-wrapper .pokemon-details-popup .pokemon-name {\n  display: inline-block;\n  margin-right: 15px;\n}\n.custom .leaflet-popup-content-wrapper .pokemon-details-popup .details-block {\n  text-align: left;\n  margin-top: 5px;\n}\n.custom .leaflet-popup-content-wrapper .pokemon-details-popup .details-attribute-name {\n  font-weight: bold;\n  padding-left: 5px;\n  padding-right: 10px;\n  font-size: 1.2em;\n}\n.custom .leaflet-popup-content-wrapper .pokemon-details-popup .details-attribute-value {\n  float: right;\n  padding-top: 0.2em;\n}\n"; (require("browserify-css").createStyle(css, { "href": "style.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}]},{},[2]);
