var global = Function("return this;")();
/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011 (@ded @fat)
  * http://ender.no.de
  * License MIT
  */
!function (context) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {}
    , old = context.$

  function require (identifier) {
    // modules can be required from ender's build system, or found on the window
    var module = modules[identifier] || window[identifier]
    if (!module) throw new Error("Requested module '" + identifier + "' has not been defined.")
    return module
  }

  function provide (name, what) {
    return (modules[name] = what)
  }

  context['provide'] = provide
  context['require'] = require

  function aug(o, o2) {
    for (var k in o2) k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k])
    return o
  }

  function boosh(s, r, els) {
    // string || node || nodelist || window
    if (typeof s == 'string' || s.nodeName || (s.length && 'item' in s) || s == window) {
      els = ender._select(s, r)
      els.selector = s
    } else els = isFinite(s.length) ? s : [s]
    return aug(els, boosh)
  }

  function ender(s, r) {
    return boosh(s, r)
  }

  aug(ender, {
      _VERSION: '0.3.6'
    , fn: boosh // for easy compat to jQuery plugins
    , ender: function (o, chain) {
        aug(chain ? boosh : ender, o)
      }
    , _select: function (s, r) {
        return (r || document).querySelectorAll(s)
      }
  })

  aug(boosh, {
    forEach: function (fn, scope, i) {
      // opt out of native forEach so we can intentionally call our own scope
      // defaulting to the current item and be able to return self
      for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(scope || this[i], this[i], i, this)
      // return self for chaining
      return this
    },
    $: ender // handy reference to self
  })

  ender.noConflict = function () {
    context.$ = old
    return this
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = ender
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = context['ender'] || ender

}(this);
// pakmanager:mime-db
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  /*!
     * mime-db
     * Copyright(c) 2014 Jonathan Ong
     * MIT Licensed
     */
    
    /**
     * Module exports.
     */
    
    module.exports = require('./db.json')
    
  provide("mime-db", module.exports);
}(global));

// pakmanager:ms
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  /**
     * Helpers.
     */
    
    var s = 1000;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;
    
    /**
     * Parse or format the given `val`.
     *
     * Options:
     *
     *  - `long` verbose formatting [false]
     *
     * @param {String|Number} val
     * @param {Object} options
     * @return {String|Number}
     * @api public
     */
    
    module.exports = function(val, options){
      options = options || {};
      if ('string' == typeof val) return parse(val);
      return options.long
        ? long(val)
        : short(val);
    };
    
    /**
     * Parse the given `str` and return milliseconds.
     *
     * @param {String} str
     * @return {Number}
     * @api private
     */
    
    function parse(str) {
      str = '' + str;
      if (str.length > 10000) return;
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
      if (!match) return;
      var n = parseFloat(match[1]);
      var type = (match[2] || 'ms').toLowerCase();
      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y;
        case 'days':
        case 'day':
        case 'd':
          return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n;
      }
    }
    
    /**
     * Short format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */
    
    function short(ms) {
      if (ms >= d) return Math.round(ms / d) + 'd';
      if (ms >= h) return Math.round(ms / h) + 'h';
      if (ms >= m) return Math.round(ms / m) + 'm';
      if (ms >= s) return Math.round(ms / s) + 's';
      return ms + 'ms';
    }
    
    /**
     * Long format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */
    
    function long(ms) {
      return plural(ms, d, 'day')
        || plural(ms, h, 'hour')
        || plural(ms, m, 'minute')
        || plural(ms, s, 'second')
        || ms + ' ms';
    }
    
    /**
     * Pluralization helper.
     */
    
    function plural(ms, n, name) {
      if (ms < n) return;
      if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
      return Math.ceil(ms / n) + ' ' + name + 's';
    }
    
  provide("ms", module.exports);
}(global));

// pakmanager:mime-types
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  /*!
     * mime-types
     * Copyright(c) 2014 Jonathan Ong
     * Copyright(c) 2015 Douglas Christopher Wilson
     * MIT Licensed
     */
    
    'use strict'
    
    /**
     * Module dependencies.
     * @private
     */
    
    var db = require('mime-db')
    var extname = require('path').extname
    
    /**
     * Module variables.
     * @private
     */
    
    var extractTypeRegExp = /^\s*([^;\s]*)(?:;|\s|$)/
    var textTypeRegExp = /^text\//i
    
    /**
     * Module exports.
     * @public
     */
    
    exports.charset = charset
    exports.charsets = { lookup: charset }
    exports.contentType = contentType
    exports.extension = extension
    exports.extensions = Object.create(null)
    exports.lookup = lookup
    exports.types = Object.create(null)
    
    // Populate the extensions/types maps
    populateMaps(exports.extensions, exports.types)
    
    /**
     * Get the default charset for a MIME type.
     *
     * @param {string} type
     * @return {boolean|string}
     */
    
    function charset(type) {
      if (!type || typeof type !== 'string') {
        return false
      }
    
      // TODO: use media-typer
      var match = extractTypeRegExp.exec(type)
      var mime = match && db[match[1].toLowerCase()]
    
      if (mime && mime.charset) {
        return mime.charset
      }
    
      // default text/* to utf-8
      if (match && textTypeRegExp.test(match[1])) {
        return 'UTF-8'
      }
    
      return false
    }
    
    /**
     * Create a full Content-Type header given a MIME type or extension.
     *
     * @param {string} str
     * @return {boolean|string}
     */
    
    function contentType(str) {
      // TODO: should this even be in this module?
      if (!str || typeof str !== 'string') {
        return false
      }
    
      var mime = str.indexOf('/') === -1
        ? exports.lookup(str)
        : str
    
      if (!mime) {
        return false
      }
    
      // TODO: use content-type or other module
      if (mime.indexOf('charset') === -1) {
        var charset = exports.charset(mime)
        if (charset) mime += '; charset=' + charset.toLowerCase()
      }
    
      return mime
    }
    
    /**
     * Get the default extension for a MIME type.
     *
     * @param {string} type
     * @return {boolean|string}
     */
    
    function extension(type) {
      if (!type || typeof type !== 'string') {
        return false
      }
    
      // TODO: use media-typer
      var match = extractTypeRegExp.exec(type)
    
      // get extensions
      var exts = match && exports.extensions[match[1].toLowerCase()]
    
      if (!exts || !exts.length) {
        return false
      }
    
      return exts[0]
    }
    
    /**
     * Lookup the MIME type for a file path/extension.
     *
     * @param {string} path
     * @return {boolean|string}
     */
    
    function lookup(path) {
      if (!path || typeof path !== 'string') {
        return false
      }
    
      // get the extension ("ext" or ".ext" or full path)
      var extension = extname('x.' + path)
        .toLowerCase()
        .substr(1)
    
      if (!extension) {
        return false
      }
    
      return exports.types[extension] || false
    }
    
    /**
     * Populate the extensions and types maps.
     * @private
     */
    
    function populateMaps(extensions, types) {
      // source preference (least -> most)
      var preference = ['nginx', 'apache', undefined, 'iana']
    
      Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type]
        var exts = mime.extensions
    
        if (!exts || !exts.length) {
          return
        }
    
        // mime -> extensions
        extensions[type] = exts
    
        // extension -> mime
        for (var i = 0; i < exts.length; i++) {
          var extension = exts[i]
    
          if (types[extension]) {
            var from = preference.indexOf(db[types[extension]].source)
            var to = preference.indexOf(mime.source)
    
            if (types[extension] !== 'application/octet-stream'
              && from > to || (from === to && types[extension].substr(0, 12) === 'application/')) {
              // skip the remapping
              return
            }
          }
    
          // set the extension -> mime
          types[extension] = type
        }
      })
    }
    
  provide("mime-types", module.exports);
}(global));

// pakmanager:inherits
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  module.exports = require('util').inherits
    
  provide("inherits", module.exports);
}(global));

// pakmanager:isarray
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  module.exports = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };
    
  provide("isarray", module.exports);
}(global));

// pakmanager:process-nextick-args
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  'use strict';
    module.exports = nextTick;
    
    function nextTick(fn) {
      var args = new Array(arguments.length - 1);
      var i = 0;
      while (i < arguments.length) {
        args[i++] = arguments[i];
      }
      process.nextTick(function afterTick() {
        fn.apply(null, args);
      });
    }
    
  provide("process-nextick-args", module.exports);
}(global));

// pakmanager:string_decoder
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    var Buffer = require('buffer').Buffer;
    
    var isBufferEncoding = Buffer.isEncoding
      || function(encoding) {
           switch (encoding && encoding.toLowerCase()) {
             case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
             default: return false;
           }
         }
    
    
    function assertEncoding(encoding) {
      if (encoding && !isBufferEncoding(encoding)) {
        throw new Error('Unknown encoding: ' + encoding);
      }
    }
    
    // StringDecoder provides an interface for efficiently splitting a series of
    // buffers into a series of JS strings without breaking apart multi-byte
    // characters. CESU-8 is handled as part of the UTF-8 encoding.
    //
    // @TODO Handling all encodings inside a single object makes it very difficult
    // to reason about this code, so it should be split up in the future.
    // @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
    // points as used by CESU-8.
    var StringDecoder = exports.StringDecoder = function(encoding) {
      this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
      assertEncoding(encoding);
      switch (this.encoding) {
        case 'utf8':
          // CESU-8 represents each of Surrogate Pair by 3-bytes
          this.surrogateSize = 3;
          break;
        case 'ucs2':
        case 'utf16le':
          // UTF-16 represents each of Surrogate Pair by 2-bytes
          this.surrogateSize = 2;
          this.detectIncompleteChar = utf16DetectIncompleteChar;
          break;
        case 'base64':
          // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
          this.surrogateSize = 3;
          this.detectIncompleteChar = base64DetectIncompleteChar;
          break;
        default:
          this.write = passThroughWrite;
          return;
      }
    
      // Enough space to store all bytes of a single character. UTF-8 needs 4
      // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
      this.charBuffer = new Buffer(6);
      // Number of bytes received for the current incomplete multi-byte character.
      this.charReceived = 0;
      // Number of bytes expected for the current incomplete multi-byte character.
      this.charLength = 0;
    };
    
    
    // write decodes the given buffer and returns it as JS string that is
    // guaranteed to not contain any partial multi-byte characters. Any partial
    // character found at the end of the buffer is buffered up, and will be
    // returned when calling write again with the remaining bytes.
    //
    // Note: Converting a Buffer containing an orphan surrogate to a String
    // currently works, but converting a String to a Buffer (via `new Buffer`, or
    // Buffer#write) will replace incomplete surrogates with the unicode
    // replacement character. See https://codereview.chromium.org/121173009/ .
    StringDecoder.prototype.write = function(buffer) {
      var charStr = '';
      // if our last write ended with an incomplete multibyte character
      while (this.charLength) {
        // determine how many remaining bytes this buffer has to offer for this char
        var available = (buffer.length >= this.charLength - this.charReceived) ?
            this.charLength - this.charReceived :
            buffer.length;
    
        // add the new bytes to the char buffer
        buffer.copy(this.charBuffer, this.charReceived, 0, available);
        this.charReceived += available;
    
        if (this.charReceived < this.charLength) {
          // still not enough chars in this buffer? wait for more ...
          return '';
        }
    
        // remove bytes belonging to the current character from the buffer
        buffer = buffer.slice(available, buffer.length);
    
        // get the character that was split
        charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
    
        // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
        var charCode = charStr.charCodeAt(charStr.length - 1);
        if (charCode >= 0xD800 && charCode <= 0xDBFF) {
          this.charLength += this.surrogateSize;
          charStr = '';
          continue;
        }
        this.charReceived = this.charLength = 0;
    
        // if there are no more bytes in this buffer, just emit our char
        if (buffer.length === 0) {
          return charStr;
        }
        break;
      }
    
      // determine and set charLength / charReceived
      this.detectIncompleteChar(buffer);
    
      var end = buffer.length;
      if (this.charLength) {
        // buffer the incomplete character bytes we got
        buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
        end -= this.charReceived;
      }
    
      charStr += buffer.toString(this.encoding, 0, end);
    
      var end = charStr.length - 1;
      var charCode = charStr.charCodeAt(end);
      // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
      if (charCode >= 0xD800 && charCode <= 0xDBFF) {
        var size = this.surrogateSize;
        this.charLength += size;
        this.charReceived += size;
        this.charBuffer.copy(this.charBuffer, size, 0, size);
        buffer.copy(this.charBuffer, 0, 0, size);
        return charStr.substring(0, end);
      }
    
      // or just emit the charStr
      return charStr;
    };
    
    // detectIncompleteChar determines if there is an incomplete UTF-8 character at
    // the end of the given buffer. If so, it sets this.charLength to the byte
    // length that character, and sets this.charReceived to the number of bytes
    // that are available for this character.
    StringDecoder.prototype.detectIncompleteChar = function(buffer) {
      // determine how many bytes we have to check at the end of this buffer
      var i = (buffer.length >= 3) ? 3 : buffer.length;
    
      // Figure out if one of the last i bytes of our buffer announces an
      // incomplete char.
      for (; i > 0; i--) {
        var c = buffer[buffer.length - i];
    
        // See http://en.wikipedia.org/wiki/UTF-8#Description
    
        // 110XXXXX
        if (i == 1 && c >> 5 == 0x06) {
          this.charLength = 2;
          break;
        }
    
        // 1110XXXX
        if (i <= 2 && c >> 4 == 0x0E) {
          this.charLength = 3;
          break;
        }
    
        // 11110XXX
        if (i <= 3 && c >> 3 == 0x1E) {
          this.charLength = 4;
          break;
        }
      }
      this.charReceived = i;
    };
    
    StringDecoder.prototype.end = function(buffer) {
      var res = '';
      if (buffer && buffer.length)
        res = this.write(buffer);
    
      if (this.charReceived) {
        var cr = this.charReceived;
        var buf = this.charBuffer;
        var enc = this.encoding;
        res += buf.slice(0, cr).toString(enc);
      }
    
      return res;
    };
    
    function passThroughWrite(buffer) {
      return buffer.toString(this.encoding);
    }
    
    function utf16DetectIncompleteChar(buffer) {
      this.charReceived = buffer.length % 2;
      this.charLength = this.charReceived ? 2 : 0;
    }
    
    function base64DetectIncompleteChar(buffer) {
      this.charReceived = buffer.length % 3;
      this.charLength = this.charReceived ? 3 : 0;
    }
    
  provide("string_decoder", module.exports);
}(global));

// pakmanager:util-deprecate
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
    /**
     * For Node.js, simply re-export the core `util.deprecate` function.
     */
    
    module.exports = require('util').deprecate;
    
  provide("util-deprecate", module.exports);
}(global));

// pakmanager:mime
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  var path = require('path');
    var fs = require('fs');
    
    function Mime() {
      // Map of extension -> mime type
      this.types = Object.create(null);
    
      // Map of mime type -> extension
      this.extensions = Object.create(null);
    }
    
    /**
     * Define mimetype -> extension mappings.  Each key is a mime-type that maps
     * to an array of extensions associated with the type.  The first extension is
     * used as the default extension for the type.
     *
     * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
     *
     * @param map (Object) type definitions
     */
    Mime.prototype.define = function (map) {
      for (var type in map) {
        var exts = map[type];
        for (var i = 0; i < exts.length; i++) {
          if (process.env.DEBUG_MIME && this.types[exts]) {
            console.warn(this._loading.replace(/.*\//, ''), 'changes "' + exts[i] + '" extension type from ' +
              this.types[exts] + ' to ' + type);
          }
    
          this.types[exts[i]] = type;
        }
    
        // Default extension is the first one we encounter
        if (!this.extensions[type]) {
          this.extensions[type] = exts[0];
        }
      }
    };
    
    /**
     * Load an Apache2-style ".types" file
     *
     * This may be called multiple times (it's expected).  Where files declare
     * overlapping types/extensions, the last file wins.
     *
     * @param file (String) path of file to load.
     */
    Mime.prototype.load = function(file) {
      this._loading = file;
      // Read file and split into lines
      var map = {},
          content = fs.readFileSync(file, 'ascii'),
          lines = content.split(/[\r\n]+/);
    
      lines.forEach(function(line) {
        // Clean up whitespace/comments, and split into fields
        var fields = line.replace(/\s*#.*|^\s*|\s*$/g, '').split(/\s+/);
        map[fields.shift()] = fields;
      });
    
      this.define(map);
    
      this._loading = null;
    };
    
    /**
     * Lookup a mime type based on extension
     */
    Mime.prototype.lookup = function(path, fallback) {
      var ext = path.replace(/.*[\.\/\\]/, '').toLowerCase();
    
      return this.types[ext] || fallback || this.default_type;
    };
    
    /**
     * Return file extension associated with a mime type
     */
    Mime.prototype.extension = function(mimeType) {
      var type = mimeType.match(/^\s*([^;\s]*)(?:;|\s|$)/)[1].toLowerCase();
      return this.extensions[type];
    };
    
    // Default instance
    var mime = new Mime();
    
    // Define built-in types
    mime.define(require('./types.json'));
    
    // Default type
    mime.default_type = mime.lookup('bin');
    
    //
    // Additional API specific to the default instance
    //
    
    mime.Mime = Mime;
    
    /**
     * Lookup a charset based on mime type.
     */
    mime.charsets = {
      lookup: function(mimeType, fallback) {
        // Assume text types are utf8
        return (/^text\//).test(mimeType) ? 'UTF-8' : fallback;
      }
    };
    
    module.exports = mime;
    
  provide("mime", module.exports);
}(global));

// pakmanager:component-emitter
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
    /**
     * Expose `Emitter`.
     */
    
    module.exports = Emitter;
    
    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */
    
    function Emitter(obj) {
      if (obj) return mixin(obj);
    };
    
    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */
    
    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }
    
    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */
    
    Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
      return this;
    };
    
    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */
    
    Emitter.prototype.once = function(event, fn){
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }
    
      on.fn = fn;
      this.on(event, on);
      return this;
    };
    
    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */
    
    Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
    
      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }
    
      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;
    
      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      }
    
      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }
      return this;
    };
    
    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */
    
    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};
      var args = [].slice.call(arguments, 1)
        , callbacks = this._callbacks['$' + event];
    
      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }
    
      return this;
    };
    
    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */
    
    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};
      return this._callbacks['$' + event] || [];
    };
    
    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */
    
    Emitter.prototype.hasListeners = function(event){
      return !! this.listeners(event).length;
    };
    
  provide("component-emitter", module.exports);
}(global));

// pakmanager:methods
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
    var http = require('http');
    
    /* istanbul ignore next: implementation differs on version */
    if (http.METHODS) {
    
      module.exports = http.METHODS.map(function(method){
        return method.toLowerCase();
      });
    
    } else {
    
      module.exports = [
        'get',
        'post',
        'put',
        'head',
        'delete',
        'options',
        'trace',
        'copy',
        'lock',
        'mkcol',
        'move',
        'purge',
        'propfind',
        'proppatch',
        'unlock',
        'report',
        'mkactivity',
        'checkout',
        'merge',
        'm-search',
        'notify',
        'subscribe',
        'unsubscribe',
        'patch',
        'search',
        'connect'
      ];
    
    }
    
  provide("methods", module.exports);
}(global));

// pakmanager:cookiejar
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  /* jshint node: true */
    (function () {
        "use strict";
    
        function CookieAccessInfo(domain, path, secure, script) {
            if (this instanceof CookieAccessInfo) {
                this.domain = domain || undefined;
                this.path = path || "/";
                this.secure = !!secure;
                this.script = !!script;
                return this;
            }
            return new CookieAccessInfo(domain, path, secure, script);
        }
        exports.CookieAccessInfo = CookieAccessInfo;
    
        function Cookie(cookiestr, request_domain, request_path) {
            if (cookiestr instanceof Cookie) {
                return cookiestr;
            }
            if (this instanceof Cookie) {
                this.name = null;
                this.value = null;
                this.expiration_date = Infinity;
                this.path = String(request_path || "/");
                this.explicit_path = false;
                this.domain = request_domain || null;
                this.explicit_domain = false;
                this.secure = false; //how to define default?
                this.noscript = false; //httponly
                if (cookiestr) {
                    this.parse(cookiestr, request_domain, request_path);
                }
                return this;
            }
            return new Cookie(cookiestr);
        }
        exports.Cookie = Cookie;
    
        Cookie.prototype.toString = function toString() {
            var str = [this.name + "=" + this.value];
            if (this.expiration_date !== Infinity) {
                str.push("expires=" + (new Date(this.expiration_date)).toGMTString());
            }
            if (this.domain) {
                str.push("domain=" + this.domain);
            }
            if (this.path) {
                str.push("path=" + this.path);
            }
            if (this.secure) {
                str.push("secure");
            }
            if (this.noscript) {
                str.push("httponly");
            }
            return str.join("; ");
        };
    
        Cookie.prototype.toValueString = function toValueString() {
            return this.name + "=" + this.value;
        };
    
        var cookie_str_splitter = /[:](?=\s*[a-zA-Z0-9_\-]+\s*[=])/g;
        Cookie.prototype.parse = function parse(str, request_domain, request_path) {
            if (this instanceof Cookie) {
                var parts = str.split(";").filter(function (value) {
                        return !!value;
                    }),
                    pair = parts[0].match(/([^=]+)=([\s\S]*)/),
                    key = pair[1],
                    value = pair[2],
                    i;
                this.name = key;
                this.value = value;
    
                for (i = 1; i < parts.length; i += 1) {
                    pair = parts[i].match(/([^=]+)(?:=([\s\S]*))?/);
                    key = pair[1].trim().toLowerCase();
                    value = pair[2];
                    switch (key) {
                    case "httponly":
                        this.noscript = true;
                        break;
                    case "expires":
                        this.expiration_date = value ?
                                Number(Date.parse(value)) :
                                Infinity;
                        break;
                    case "path":
                        this.path = value ?
                                value.trim() :
                                "";
                        this.explicit_path = true;
                        break;
                    case "domain":
                        this.domain = value ?
                                value.trim() :
                                "";
                        this.explicit_domain = !!this.domain;
                        break;
                    case "secure":
                        this.secure = true;
                        break;
                    }
                }
    
                if (!this.explicit_path) {
                   this.path = request_path || "/";
                }
                if (!this.explicit_domain) {
                   this.domain = request_domain;
                }
    
                return this;
            }
            return new Cookie().parse(str, request_domain, request_path);
        };
    
        Cookie.prototype.matches = function matches(access_info) {
            if (this.noscript && access_info.script ||
                    this.secure && !access_info.secure ||
                    !this.collidesWith(access_info)) {
                return false;
            }
            return true;
        };
    
        Cookie.prototype.collidesWith = function collidesWith(access_info) {
            if ((this.path && !access_info.path) || (this.domain && !access_info.domain)) {
                return false;
            }
            if (this.path && access_info.path.indexOf(this.path) !== 0) {
                return false;
            }
            if (!this.explicit_path) {
               if (this.path !== access_info.path) {
                   return false;
               }
            }
            var access_domain = access_info.domain && access_info.domain.replace(/^[\.]/,'');
            var cookie_domain = this.domain && this.domain.replace(/^[\.]/,'');
            if (cookie_domain === access_domain) {
                return true;
            }
            if (cookie_domain) {
                if (!this.explicit_domain) {
                    return false; // we already checked if the domains were exactly the same
                }
                var wildcard = access_domain.indexOf(cookie_domain);
                if (wildcard === -1 || wildcard !== access_domain.length - cookie_domain.length) {
                    return false;
                }
                return true;
            }
            return true;
        };
    
        function CookieJar() {
            var cookies, cookies_list, collidable_cookie;
            if (this instanceof CookieJar) {
                cookies = Object.create(null); //name: [Cookie]
    
                this.setCookie = function setCookie(cookie, request_domain, request_path) {
                    var remove, i;
                    cookie = new Cookie(cookie, request_domain, request_path);
                    //Delete the cookie if the set is past the current time
                    remove = cookie.expiration_date <= Date.now();
                    if (cookies[cookie.name] !== undefined) {
                        cookies_list = cookies[cookie.name];
                        for (i = 0; i < cookies_list.length; i += 1) {
                            collidable_cookie = cookies_list[i];
                            if (collidable_cookie.collidesWith(cookie)) {
                                if (remove) {
                                    cookies_list.splice(i, 1);
                                    if (cookies_list.length === 0) {
                                        delete cookies[cookie.name];
                                    }
                                    return false;
                                }
                                cookies_list[i] = cookie;
                                return cookie;
                            }
                        }
                        if (remove) {
                            return false;
                        }
                        cookies_list.push(cookie);
                        return cookie;
                    }
                    if (remove) {
                        return false;
                    }
                    cookies[cookie.name] = [cookie];
                    return cookies[cookie.name];
                };
                //returns a cookie
                this.getCookie = function getCookie(cookie_name, access_info) {
                    var cookie, i;
                    cookies_list = cookies[cookie_name];
                    if (!cookies_list) {
                        return;
                    }
                    for (i = 0; i < cookies_list.length; i += 1) {
                        cookie = cookies_list[i];
                        if (cookie.expiration_date <= Date.now()) {
                            if (cookies_list.length === 0) {
                                delete cookies[cookie.name];
                            }
                            continue;
                        }
                        if (cookie.matches(access_info)) {
                            return cookie;
                        }
                    }
                };
                //returns a list of cookies
                this.getCookies = function getCookies(access_info) {
                    var matches = [], cookie_name, cookie;
                    for (cookie_name in cookies) {
                        cookie = this.getCookie(cookie_name, access_info);
                        if (cookie) {
                            matches.push(cookie);
                        }
                    }
                    matches.toString = function toString() {
                        return matches.join(":");
                    };
                    matches.toValueString = function toValueString() {
                        return matches.map(function (c) {
                            return c.toValueString();
                        }).join(';');
                    };
                    return matches;
                };
    
                return this;
            }
            return new CookieJar();
        }
        exports.CookieJar = CookieJar;
    
        //returns list of cookies that were set correctly. Cookies that are expired and removed are not returned.
        CookieJar.prototype.setCookies = function setCookies(cookies, request_domain, request_path) {
            cookies = Array.isArray(cookies) ?
                    cookies :
                    cookies.split(cookie_str_splitter);
            var successful = [],
                i,
                cookie;
            cookies = cookies.map(Cookie);
            for (i = 0; i < cookies.length; i += 1) {
                cookie = cookies[i];
                if (this.setCookie(cookie, request_domain, request_path)) {
                    successful.push(cookie);
                }
            }
            return successful;
        };
    }());
    
  provide("cookiejar", module.exports);
}(global));

// pakmanager:debug
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
    /**
     * Module dependencies.
     */
    
    var tty = require('tty');
    var util = require('util');
    
    /**
     * This is the Node.js implementation of `debug()`.
     *
     * Expose `debug()` as the module.
     */
    
    exports = module.exports =   require('debug');
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    
    /**
     * Colors.
     */
    
    exports.colors = [6, 2, 3, 4, 5, 1];
    
    /**
     * The file descriptor to write the `debug()` calls to.
     * Set the `DEBUG_FD` env variable to override with another value. i.e.:
     *
     *   $ DEBUG_FD=3 node script.js 3>debug.log
     */
    
    var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
    var stream = 1 === fd ? process.stdout :
                 2 === fd ? process.stderr :
                 createWritableStdioStream(fd);
    
    /**
     * Is stdout a TTY? Colored output is enabled when `true`.
     */
    
    function useColors() {
      var debugColors = (process.env.DEBUG_COLORS || '').trim().toLowerCase();
      if (0 === debugColors.length) {
        return tty.isatty(fd);
      } else {
        return '0' !== debugColors
            && 'no' !== debugColors
            && 'false' !== debugColors
            && 'disabled' !== debugColors;
      }
    }
    
    /**
     * Map %o to `util.inspect()`, since Node doesn't do that out of the box.
     */
    
    var inspect = (4 === util.inspect.length ?
      // node <= 0.8.x
      function (v, colors) {
        return util.inspect(v, void 0, void 0, colors);
      } :
      // node > 0.8.x
      function (v, colors) {
        return util.inspect(v, { colors: colors });
      }
    );
    
    exports.formatters.o = function(v) {
      return inspect(v, this.useColors)
        .replace(/\s*\n\s*/g, ' ');
    };
    
    /**
     * Adds ANSI color escape codes if enabled.
     *
     * @api public
     */
    
    function formatArgs() {
      var args = arguments;
      var useColors = this.useColors;
      var name = this.namespace;
    
      if (useColors) {
        var c = this.color;
    
        args[0] = '  \u001b[3' + c + ';1m' + name + ' '
          + '\u001b[0m'
          + args[0] + '\u001b[3' + c + 'm'
          + ' +' + exports.humanize(this.diff) + '\u001b[0m';
      } else {
        args[0] = new Date().toUTCString()
          + ' ' + name + ' ' + args[0];
      }
      return args;
    }
    
    /**
     * Invokes `console.error()` with the specified arguments.
     */
    
    function log() {
      return stream.write(util.format.apply(this, arguments) + '\n');
    }
    
    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */
    
    function save(namespaces) {
      if (null == namespaces) {
        // If you set a process.env field to null or undefined, it gets cast to the
        // string 'null' or 'undefined'. Just delete instead.
        delete process.env.DEBUG;
      } else {
        process.env.DEBUG = namespaces;
      }
    }
    
    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */
    
    function load() {
      return process.env.DEBUG;
    }
    
    /**
     * Copied from `node/src/node.js`.
     *
     * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
     * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
     */
    
    function createWritableStdioStream (fd) {
      var stream;
      var tty_wrap = process.binding('tty_wrap');
    
      // Note stream._type is used for test-module-load-list.js
    
      switch (tty_wrap.guessHandleType(fd)) {
        case 'TTY':
          stream = new tty.WriteStream(fd);
          stream._type = 'tty';
    
          // Hack to have stream not keep the event loop alive.
          // See https://github.com/joyent/node/issues/1726
          if (stream._handle && stream._handle.unref) {
            stream._handle.unref();
          }
          break;
    
        case 'FILE':
          var fs = require('fs');
          stream = new fs.SyncWriteStream(fd, { autoClose: false });
          stream._type = 'fs';
          break;
    
        case 'PIPE':
        case 'TCP':
          var net = require('net');
          stream = new net.Socket({
            fd: fd,
            readable: false,
            writable: true
          });
    
          // FIXME Should probably have an option in net.Socket to create a
          // stream from an existing fd which is writable only. But for now
          // we'll just add this hack and set the `readable` member to false.
          // Test: ./node test/fixtures/echo.js < /etc/passwd
          stream.readable = false;
          stream.read = null;
          stream._type = 'pipe';
    
          // FIXME Hack to have stream not keep the event loop alive.
          // See https://github.com/joyent/node/issues/1726
          if (stream._handle && stream._handle.unref) {
            stream._handle.unref();
          }
          break;
    
        default:
          // Probably an error on in uv_guess_handle()
          throw new Error('Implement me. Unknown stream file type!');
      }
    
      // For supporting legacy API we put the FD here.
      stream.fd = fd;
    
      stream._isStdio = true;
    
      return stream;
    }
    
    /**
     * Enable namespaces listed in `process.env.DEBUG` initially.
     */
    
    exports.enable(load());
    
  provide("debug", module.exports);
}(global));

// pakmanager:reduce-component
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
    /**
     * Reduce `arr` with `fn`.
     *
     * @param {Array} arr
     * @param {Function} fn
     * @param {Mixed} initial
     *
     * TODO: combatible error handling?
     */
    
    module.exports = function(arr, fn, initial){  
      var idx = 0;
      var len = arr.length;
      var curr = arguments.length == 3
        ? initial
        : arr[idx++];
    
      while (idx < len) {
        curr = fn.call(null, curr, arr[idx], ++idx, arr);
      }
      
      return curr;
    };
  provide("reduce-component", module.exports);
}(global));

// pakmanager:extend
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  'use strict';
    
    var hasOwn = Object.prototype.hasOwnProperty;
    var toStr = Object.prototype.toString;
    
    var isArray = function isArray(arr) {
    	if (typeof Array.isArray === 'function') {
    		return Array.isArray(arr);
    	}
    
    	return toStr.call(arr) === '[object Array]';
    };
    
    var isPlainObject = function isPlainObject(obj) {
    	if (!obj || toStr.call(obj) !== '[object Object]') {
    		return false;
    	}
    
    	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
    	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
    	// Not own constructor property must be Object
    	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
    		return false;
    	}
    
    	// Own properties are enumerated firstly, so to speed up,
    	// if last one is own, then all properties are own.
    	var key;
    	for (key in obj) {/**/}
    
    	return typeof key === 'undefined' || hasOwn.call(obj, key);
    };
    
    module.exports = function extend() {
    	var options, name, src, copy, copyIsArray, clone,
    		target = arguments[0],
    		i = 1,
    		length = arguments.length,
    		deep = false;
    
    	// Handle a deep copy situation
    	if (typeof target === 'boolean') {
    		deep = target;
    		target = arguments[1] || {};
    		// skip the boolean and the target
    		i = 2;
    	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
    		target = {};
    	}
    
    	for (; i < length; ++i) {
    		options = arguments[i];
    		// Only deal with non-null/undefined values
    		if (options != null) {
    			// Extend the base object
    			for (name in options) {
    				src = target[name];
    				copy = options[name];
    
    				// Prevent never-ending loop
    				if (target !== copy) {
    					// Recurse if we're merging plain objects or arrays
    					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
    						if (copyIsArray) {
    							copyIsArray = false;
    							clone = src && isArray(src) ? src : [];
    						} else {
    							clone = src && isPlainObject(src) ? src : {};
    						}
    
    						// Never move original objects, clone them
    						target[name] = extend(deep, clone, copy);
    
    					// Don't bring in undefined values
    					} else if (typeof copy !== 'undefined') {
    						target[name] = copy;
    					}
    				}
    			}
    		}
    	}
    
    	// Return the modified object
    	return target;
    };
    
    
  provide("extend", module.exports);
}(global));

// pakmanager:readable-stream
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  var Stream = (function (){
      try {
        return require('st' + 'ream'); // hack to fix a circular dependency issue when used with browserify
      } catch(_){}
    }());
    exports = module.exports = require('./lib/_stream_readable.js');
    exports.Stream = Stream || exports;
    exports.Readable = exports;
    exports.Writable = require('./lib/_stream_writable.js');
    exports.Duplex = require('./lib/_stream_duplex.js');
    exports.Transform = require('./lib/_stream_transform.js');
    exports.PassThrough = require('./lib/_stream_passthrough.js');
    
  provide("readable-stream", module.exports);
}(global));

// pakmanager:core-js
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  /**
     * Core.js 0.6.1
     * https://github.com/zloirock/core-js
     * License: http://rock.mit-license.org
     * © 2015 Denis Pushkarev
     */
    !function(global, framework, undefined){
    'use strict';
    
    /******************************************************************************
     * Module : common                                                            *
     ******************************************************************************/
    
      // Shortcuts for [[Class]] & property names
    var OBJECT          = 'Object'
      , FUNCTION        = 'Function'
      , ARRAY           = 'Array'
      , STRING          = 'String'
      , NUMBER          = 'Number'
      , REGEXP          = 'RegExp'
      , DATE            = 'Date'
      , MAP             = 'Map'
      , SET             = 'Set'
      , WEAKMAP         = 'WeakMap'
      , WEAKSET         = 'WeakSet'
      , SYMBOL          = 'Symbol'
      , PROMISE         = 'Promise'
      , MATH            = 'Math'
      , ARGUMENTS       = 'Arguments'
      , PROTOTYPE       = 'prototype'
      , CONSTRUCTOR     = 'constructor'
      , TO_STRING       = 'toString'
      , TO_STRING_TAG   = TO_STRING + 'Tag'
      , TO_LOCALE       = 'toLocaleString'
      , HAS_OWN         = 'hasOwnProperty'
      , FOR_EACH        = 'forEach'
      , ITERATOR        = 'iterator'
      , FF_ITERATOR     = '@@' + ITERATOR
      , PROCESS         = 'process'
      , CREATE_ELEMENT  = 'createElement'
      // Aliases global objects and prototypes
      , Function        = global[FUNCTION]
      , Object          = global[OBJECT]
      , Array           = global[ARRAY]
      , String          = global[STRING]
      , Number          = global[NUMBER]
      , RegExp          = global[REGEXP]
      , Date            = global[DATE]
      , Map             = global[MAP]
      , Set             = global[SET]
      , WeakMap         = global[WEAKMAP]
      , WeakSet         = global[WEAKSET]
      , Symbol          = global[SYMBOL]
      , Math            = global[MATH]
      , TypeError       = global.TypeError
      , RangeError      = global.RangeError
      , setTimeout      = global.setTimeout
      , setImmediate    = global.setImmediate
      , clearImmediate  = global.clearImmediate
      , parseInt        = global.parseInt
      , isFinite        = global.isFinite
      , process         = global[PROCESS]
      , nextTick        = process && process.nextTick
      , document        = global.document
      , html            = document && document.documentElement
      , navigator       = global.navigator
      , define          = global.define
      , console         = global.console || {}
      , ArrayProto      = Array[PROTOTYPE]
      , ObjectProto     = Object[PROTOTYPE]
      , FunctionProto   = Function[PROTOTYPE]
      , Infinity        = 1 / 0
      , DOT             = '.';
    
    // http://jsperf.com/core-js-isobject
    function isObject(it){
      return it !== null && (typeof it == 'object' || typeof it == 'function');
    }
    function isFunction(it){
      return typeof it == 'function';
    }
    // Native function?
    var isNative = ctx(/./.test, /\[native code\]\s*\}\s*$/, 1);
    
    // Object internal [[Class]] or toStringTag
    // http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring
    var toString = ObjectProto[TO_STRING];
    function setToStringTag(it, tag, stat){
      if(it && !has(it = stat ? it : it[PROTOTYPE], SYMBOL_TAG))hidden(it, SYMBOL_TAG, tag);
    }
    function cof(it){
      return toString.call(it).slice(8, -1);
    }
    function classof(it){
      var O, T;
      return it == undefined ? it === undefined ? 'Undefined' : 'Null'
        : typeof (T = (O = Object(it))[SYMBOL_TAG]) == 'string' ? T : cof(O);
    }
    
    // Function
    var call  = FunctionProto.call
      , apply = FunctionProto.apply
      , REFERENCE_GET;
    // Partial apply
    function part(/* ...args */){
      var fn     = assertFunction(this)
        , length = arguments.length
        , args   = Array(length)
        , i      = 0
        , _      = path._
        , holder = false;
      while(length > i)if((args[i] = arguments[i++]) === _)holder = true;
      return function(/* ...args */){
        var that    = this
          , _length = arguments.length
          , i = 0, j = 0, _args;
        if(!holder && !_length)return invoke(fn, args, that);
        _args = args.slice();
        if(holder)for(;length > i; i++)if(_args[i] === _)_args[i] = arguments[j++];
        while(_length > j)_args.push(arguments[j++]);
        return invoke(fn, _args, that);
      }
    }
    // Optional / simple context binding
    function ctx(fn, that, length){
      assertFunction(fn);
      if(~length && that === undefined)return fn;
      switch(length){
        case 1: return function(a){
          return fn.call(that, a);
        }
        case 2: return function(a, b){
          return fn.call(that, a, b);
        }
        case 3: return function(a, b, c){
          return fn.call(that, a, b, c);
        }
      } return function(/* ...args */){
          return fn.apply(that, arguments);
      }
    }
    // Fast apply
    // http://jsperf.lnkit.com/fast-apply/5
    function invoke(fn, args, that){
      var un = that === undefined;
      switch(args.length | 0){
        case 0: return un ? fn()
                          : fn.call(that);
        case 1: return un ? fn(args[0])
                          : fn.call(that, args[0]);
        case 2: return un ? fn(args[0], args[1])
                          : fn.call(that, args[0], args[1]);
        case 3: return un ? fn(args[0], args[1], args[2])
                          : fn.call(that, args[0], args[1], args[2]);
        case 4: return un ? fn(args[0], args[1], args[2], args[3])
                          : fn.call(that, args[0], args[1], args[2], args[3]);
        case 5: return un ? fn(args[0], args[1], args[2], args[3], args[4])
                          : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
      } return              fn.apply(that, args);
    }
    
    // Object:
    var create           = Object.create
      , getPrototypeOf   = Object.getPrototypeOf
      , setPrototypeOf   = Object.setPrototypeOf
      , defineProperty   = Object.defineProperty
      , defineProperties = Object.defineProperties
      , getOwnDescriptor = Object.getOwnPropertyDescriptor
      , getKeys          = Object.keys
      , getNames         = Object.getOwnPropertyNames
      , getSymbols       = Object.getOwnPropertySymbols
      , isFrozen         = Object.isFrozen
      , has              = ctx(call, ObjectProto[HAS_OWN], 2)
      // Dummy, fix for not array-like ES3 string in es5 module
      , ES5Object        = Object
      , Dict;
    function toObject(it){
      return ES5Object(assertDefined(it));
    }
    function returnIt(it){
      return it;
    }
    function returnThis(){
      return this;
    }
    function get(object, key){
      if(has(object, key))return object[key];
    }
    function ownKeys(it){
      assertObject(it);
      return getSymbols ? getNames(it).concat(getSymbols(it)) : getNames(it);
    }
    // 19.1.2.1 Object.assign(target, source, ...)
    var assign = Object.assign || function(target, source){
      var T = Object(assertDefined(target))
        , l = arguments.length
        , i = 1;
      while(l > i){
        var S      = ES5Object(arguments[i++])
          , keys   = getKeys(S)
          , length = keys.length
          , j      = 0
          , key;
        while(length > j)T[key = keys[j++]] = S[key];
      }
      return T;
    }
    function keyOf(object, el){
      var O      = toObject(object)
        , keys   = getKeys(O)
        , length = keys.length
        , index  = 0
        , key;
      while(length > index)if(O[key = keys[index++]] === el)return key;
    }
    
    // Array
    // array('str1,str2,str3') => ['str1', 'str2', 'str3']
    function array(it){
      return String(it).split(',');
    }
    var push    = ArrayProto.push
      , unshift = ArrayProto.unshift
      , slice   = ArrayProto.slice
      , splice  = ArrayProto.splice
      , indexOf = ArrayProto.indexOf
      , forEach = ArrayProto[FOR_EACH];
    /*
     * 0 -> forEach
     * 1 -> map
     * 2 -> filter
     * 3 -> some
     * 4 -> every
     * 5 -> find
     * 6 -> findIndex
     */
    function createArrayMethod(type){
      var isMap       = type == 1
        , isFilter    = type == 2
        , isSome      = type == 3
        , isEvery     = type == 4
        , isFindIndex = type == 6
        , noholes     = type == 5 || isFindIndex;
      return function(callbackfn/*, that = undefined */){
        var O      = Object(assertDefined(this))
          , that   = arguments[1]
          , self   = ES5Object(O)
          , f      = ctx(callbackfn, that, 3)
          , length = toLength(self.length)
          , index  = 0
          , result = isMap ? Array(length) : isFilter ? [] : undefined
          , val, res;
        for(;length > index; index++)if(noholes || index in self){
          val = self[index];
          res = f(val, index, O);
          if(type){
            if(isMap)result[index] = res;             // map
            else if(res)switch(type){
              case 3: return true;                    // some
              case 5: return val;                     // find
              case 6: return index;                   // findIndex
              case 2: result.push(val);               // filter
            } else if(isEvery)return false;           // every
          }
        }
        return isFindIndex ? -1 : isSome || isEvery ? isEvery : result;
      }
    }
    function createArrayContains(isContains){
      return function(el /*, fromIndex = 0 */){
        var O      = toObject(this)
          , length = toLength(O.length)
          , index  = toIndex(arguments[1], length);
        if(isContains && el != el){
          for(;length > index; index++)if(sameNaN(O[index]))return isContains || index;
        } else for(;length > index; index++)if(isContains || index in O){
          if(O[index] === el)return isContains || index;
        } return !isContains && -1;
      }
    }
    function generic(A, B){
      // strange IE quirks mode bug -> use typeof vs isFunction
      return typeof A == 'function' ? A : B;
    }
    
    // Math
    var MAX_SAFE_INTEGER = 0x1fffffffffffff // pow(2, 53) - 1 == 9007199254740991
      , pow    = Math.pow
      , abs    = Math.abs
      , ceil   = Math.ceil
      , floor  = Math.floor
      , max    = Math.max
      , min    = Math.min
      , random = Math.random
      , trunc  = Math.trunc || function(it){
          return (it > 0 ? floor : ceil)(it);
        }
    // 20.1.2.4 Number.isNaN(number)
    function sameNaN(number){
      return number != number;
    }
    // 7.1.4 ToInteger
    function toInteger(it){
      return isNaN(it) ? 0 : trunc(it);
    }
    // 7.1.15 ToLength
    function toLength(it){
      return it > 0 ? min(toInteger(it), MAX_SAFE_INTEGER) : 0;
    }
    function toIndex(index, length){
      var index = toInteger(index);
      return index < 0 ? max(index + length, 0) : min(index, length);
    }
    function lz(num){
      return num > 9 ? num : '0' + num;
    }
    
    function createReplacer(regExp, replace, isStatic){
      var replacer = isObject(replace) ? function(part){
        return replace[part];
      } : replace;
      return function(it){
        return String(isStatic ? it : this).replace(regExp, replacer);
      }
    }
    function createPointAt(toString){
      return function(pos){
        var s = String(assertDefined(this))
          , i = toInteger(pos)
          , l = s.length
          , a, b;
        if(i < 0 || i >= l)return toString ? '' : undefined;
        a = s.charCodeAt(i);
        return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
          ? toString ? s.charAt(i) : a
          : toString ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
      }
    }
    
    // Assertion & errors
    var REDUCE_ERROR = 'Reduce of empty object with no initial value';
    function assert(condition, msg1, msg2){
      if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
    }
    function assertDefined(it){
      if(it == undefined)throw TypeError('Function called on null or undefined');
      return it;
    }
    function assertFunction(it){
      assert(isFunction(it), it, ' is not a function!');
      return it;
    }
    function assertObject(it){
      assert(isObject(it), it, ' is not an object!');
      return it;
    }
    function assertInstance(it, Constructor, name){
      assert(it instanceof Constructor, name, ": use the 'new' operator!");
    }
    
    // Property descriptors & Symbol
    function descriptor(bitmap, value){
      return {
        enumerable  : !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable    : !(bitmap & 4),
        value       : value
      }
    }
    function simpleSet(object, key, value){
      object[key] = value;
      return object;
    }
    function createDefiner(bitmap){
      return DESC ? function(object, key, value){
        return defineProperty(object, key, descriptor(bitmap, value));
      } : simpleSet;
    }
    function uid(key){
      return SYMBOL + '(' + key + ')_' + (++sid + random())[TO_STRING](36);
    }
    function getWellKnownSymbol(name, setter){
      return (Symbol && Symbol[name]) || (setter ? Symbol : safeSymbol)(SYMBOL + DOT + name);
    }
    // The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
    var DESC = !!function(){
          try {
            return defineProperty({}, 'a', {get: function(){ return 2 }}).a == 2;
          } catch(e){}
        }()
      , sid    = 0
      , hidden = createDefiner(1)
      , set    = Symbol ? simpleSet : hidden
      , safeSymbol = Symbol || uid;
    function assignHidden(target, src){
      for(var key in src)hidden(target, key, src[key]);
      return target;
    }
    
    var SYMBOL_UNSCOPABLES = getWellKnownSymbol('unscopables')
      , ArrayUnscopables   = ArrayProto[SYMBOL_UNSCOPABLES] || {}
      , SYMBOL_TAG         = getWellKnownSymbol(TO_STRING_TAG)
      , SYMBOL_SPECIES     = getWellKnownSymbol('species')
      , SYMBOL_ITERATOR;
    function setSpecies(C){
      if(DESC && (framework || !isNative(C)))defineProperty(C, SYMBOL_SPECIES, {
        configurable: true,
        get: returnThis
      });
    }
    
    /******************************************************************************
     * Module : common.export                                                     *
     ******************************************************************************/
    
    var NODE = cof(process) == PROCESS
      , core = {}
      , path = framework ? global : core
      , old  = global.core
      , exportGlobal
      // type bitmap
      , FORCED = 1
      , GLOBAL = 2
      , STATIC = 4
      , PROTO  = 8
      , BIND   = 16
      , WRAP   = 32;
    function $define(type, name, source){
      var key, own, out, exp
        , isGlobal = type & GLOBAL
        , target   = isGlobal ? global : (type & STATIC)
            ? global[name] : (global[name] || ObjectProto)[PROTOTYPE]
        , exports  = isGlobal ? core : core[name] || (core[name] = {});
      if(isGlobal)source = name;
      for(key in source){
        // there is a similar native
        own = !(type & FORCED) && target && key in target
          && (!isFunction(target[key]) || isNative(target[key]));
        // export native or passed
        out = (own ? target : source)[key];
        // prevent global pollution for namespaces
        if(!framework && isGlobal && !isFunction(target[key]))exp = source[key];
        // bind timers to global for call from export context
        else if(type & BIND && own)exp = ctx(out, global);
        // wrap global constructors for prevent change them in library
        else if(type & WRAP && !framework && target[key] == out){
          exp = function(param){
            return this instanceof out ? new out(param) : out(param);
          }
          exp[PROTOTYPE] = out[PROTOTYPE];
        } else exp = type & PROTO && isFunction(out) ? ctx(call, out) : out;
        // extend global
        if(framework && target && !own){
          if(isGlobal)target[key] = out;
          else delete target[key] && hidden(target, key, out);
        }
        // export
        if(exports[key] != out)hidden(exports, key, exp);
      }
    }
    // CommonJS export
    if(typeof module != 'undefined' && module.exports)module.exports = core;
    // RequireJS export
    else if(isFunction(define) && define.amd)define(function(){return core});
    // Export to global object
    else exportGlobal = true;
    if(exportGlobal || framework){
      core.noConflict = function(){
        global.core = old;
        return core;
      }
      global.core = core;
    }
    
    /******************************************************************************
     * Module : common.iterators                                                  *
     ******************************************************************************/
    
    SYMBOL_ITERATOR = getWellKnownSymbol(ITERATOR);
    var ITER  = safeSymbol('iter')
      , KEY   = 1
      , VALUE = 2
      , Iterators = {}
      , IteratorPrototype = {}
        // Safari has byggy iterators w/o `next`
      , BUGGY_ITERATORS = 'keys' in ArrayProto && !('next' in [].keys());
    // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
    setIterator(IteratorPrototype, returnThis);
    function setIterator(O, value){
      hidden(O, SYMBOL_ITERATOR, value);
      // Add iterator for FF iterator protocol
      FF_ITERATOR in ArrayProto && hidden(O, FF_ITERATOR, value);
    }
    function createIterator(Constructor, NAME, next, proto){
      Constructor[PROTOTYPE] = create(proto || IteratorPrototype, {next: descriptor(1, next)});
      setToStringTag(Constructor, NAME + ' Iterator');
    }
    function defineIterator(Constructor, NAME, value, DEFAULT){
      var proto = Constructor[PROTOTYPE]
        , iter  = get(proto, SYMBOL_ITERATOR) || get(proto, FF_ITERATOR) || (DEFAULT && get(proto, DEFAULT)) || value;
      if(framework){
        // Define iterator
        setIterator(proto, iter);
        if(iter !== value){
          var iterProto = getPrototypeOf(iter.call(new Constructor));
          // Set @@toStringTag to native iterators
          setToStringTag(iterProto, NAME + ' Iterator', true);
          // FF fix
          has(proto, FF_ITERATOR) && setIterator(iterProto, returnThis);
        }
      }
      // Plug for library
      Iterators[NAME] = iter;
      // FF & v8 fix
      Iterators[NAME + ' Iterator'] = returnThis;
      return iter;
    }
    function defineStdIterators(Base, NAME, Constructor, next, DEFAULT, IS_SET){
      function createIter(kind){
        return function(){
          return new Constructor(this, kind);
        }
      }
      createIterator(Constructor, NAME, next);
      var entries = createIter(KEY+VALUE)
        , values  = createIter(VALUE);
      if(DEFAULT == VALUE)values = defineIterator(Base, NAME, values, 'values');
      else entries = defineIterator(Base, NAME, entries, 'entries');
      if(DEFAULT){
        $define(PROTO + FORCED * BUGGY_ITERATORS, NAME, {
          entries: entries,
          keys: IS_SET ? values : createIter(KEY),
          values: values
        });
      }
    }
    function iterResult(done, value){
      return {value: value, done: !!done};
    }
    function isIterable(it){
      var O      = Object(it)
        , Symbol = global[SYMBOL]
        , hasExt = (Symbol && Symbol[ITERATOR] || FF_ITERATOR) in O;
      return hasExt || SYMBOL_ITERATOR in O || has(Iterators, classof(O));
    }
    function getIterator(it){
      var Symbol  = global[SYMBOL]
        , ext     = it[Symbol && Symbol[ITERATOR] || FF_ITERATOR]
        , getIter = ext || it[SYMBOL_ITERATOR] || Iterators[classof(it)];
      return assertObject(getIter.call(it));
    }
    function stepCall(fn, value, entries){
      return entries ? invoke(fn, value) : fn(value);
    }
    function checkDangerIterClosing(fn){
      var danger = true;
      var O = {
        next: function(){ throw 1 },
        'return': function(){ danger = false }
      };
      O[SYMBOL_ITERATOR] = returnThis;
      try {
        fn(O);
      } catch(e){}
      return danger;
    }
    function closeIterator(iterator){
      var ret = iterator['return'];
      if(ret !== undefined)ret.call(iterator);
    }
    function safeIterClose(exec, iterator){
      try {
        exec(iterator);
      } catch(e){
        closeIterator(iterator);
        throw e;
      }
    }
    function forOf(iterable, entries, fn, that){
      safeIterClose(function(iterator){
        var f = ctx(fn, that, entries ? 2 : 1)
          , step;
        while(!(step = iterator.next()).done)if(stepCall(f, step.value, entries) === false){
          return closeIterator(iterator);
        }
      }, getIterator(iterable));
    }
    
    /******************************************************************************
     * Module : es6.symbol                                                        *
     ******************************************************************************/
    
    // ECMAScript 6 symbols shim
    !function(TAG, SymbolRegistry, AllSymbols, setter){
      // 19.4.1.1 Symbol([description])
      if(!isNative(Symbol)){
        Symbol = function(description){
          assert(!(this instanceof Symbol), SYMBOL + ' is not a ' + CONSTRUCTOR);
          var tag = uid(description)
            , sym = set(create(Symbol[PROTOTYPE]), TAG, tag);
          AllSymbols[tag] = sym;
          DESC && setter && defineProperty(ObjectProto, tag, {
            configurable: true,
            set: function(value){
              hidden(this, tag, value);
            }
          });
          return sym;
        }
        hidden(Symbol[PROTOTYPE], TO_STRING, function(){
          return this[TAG];
        });
      }
      $define(GLOBAL + WRAP, {Symbol: Symbol});
      
      var symbolStatics = {
        // 19.4.2.1 Symbol.for(key)
        'for': function(key){
          return has(SymbolRegistry, key += '')
            ? SymbolRegistry[key]
            : SymbolRegistry[key] = Symbol(key);
        },
        // 19.4.2.4 Symbol.iterator
        iterator: SYMBOL_ITERATOR || getWellKnownSymbol(ITERATOR),
        // 19.4.2.5 Symbol.keyFor(sym)
        keyFor: part.call(keyOf, SymbolRegistry),
        // 19.4.2.10 Symbol.species
        species: SYMBOL_SPECIES,
        // 19.4.2.13 Symbol.toStringTag
        toStringTag: SYMBOL_TAG = getWellKnownSymbol(TO_STRING_TAG, true),
        // 19.4.2.14 Symbol.unscopables
        unscopables: SYMBOL_UNSCOPABLES,
        pure: safeSymbol,
        set: set,
        useSetter: function(){setter = true},
        useSimple: function(){setter = false}
      };
      // 19.4.2.2 Symbol.hasInstance
      // 19.4.2.3 Symbol.isConcatSpreadable
      // 19.4.2.6 Symbol.match
      // 19.4.2.8 Symbol.replace
      // 19.4.2.9 Symbol.search
      // 19.4.2.11 Symbol.split
      // 19.4.2.12 Symbol.toPrimitive
      forEach.call(array('hasInstance,isConcatSpreadable,match,replace,search,split,toPrimitive'),
        function(it){
          symbolStatics[it] = getWellKnownSymbol(it);
        }
      );
      $define(STATIC, SYMBOL, symbolStatics);
      
      setToStringTag(Symbol, SYMBOL);
      
      $define(STATIC + FORCED * !isNative(Symbol), OBJECT, {
        // 19.1.2.7 Object.getOwnPropertyNames(O)
        getOwnPropertyNames: function(it){
          var names = getNames(toObject(it)), result = [], key, i = 0;
          while(names.length > i)has(AllSymbols, key = names[i++]) || result.push(key);
          return result;
        },
        // 19.1.2.8 Object.getOwnPropertySymbols(O)
        getOwnPropertySymbols: function(it){
          var names = getNames(toObject(it)), result = [], key, i = 0;
          while(names.length > i)has(AllSymbols, key = names[i++]) && result.push(AllSymbols[key]);
          return result;
        }
      });
      
      // 20.2.1.9 Math[@@toStringTag]
      setToStringTag(Math, MATH, true);
      // 24.3.3 JSON[@@toStringTag]
      setToStringTag(global.JSON, 'JSON', true);
    }(safeSymbol('tag'), {}, {}, true);
    
    /******************************************************************************
     * Module : es6.object.statics                                                *
     ******************************************************************************/
    
    !function(){
      var objectStatic = {
        // 19.1.3.1 Object.assign(target, source)
        assign: assign,
        // 19.1.3.10 Object.is(value1, value2)
        is: function(x, y){
          return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
        }
      };
      // 19.1.3.19 Object.setPrototypeOf(O, proto)
      // Works with __proto__ only. Old v8 can't works with null proto objects.
      '__proto__' in ObjectProto && function(buggy, set){
        try {
          set = ctx(call, getOwnDescriptor(ObjectProto, '__proto__').set, 2);
          set({}, ArrayProto);
        } catch(e){ buggy = true }
        objectStatic.setPrototypeOf = setPrototypeOf = setPrototypeOf || function(O, proto){
          assertObject(O);
          assert(proto === null || isObject(proto), proto, ": can't set as prototype!");
          if(buggy)O.__proto__ = proto;
          else set(O, proto);
          return O;
        }
      }();
      $define(STATIC, OBJECT, objectStatic);
    }();
    
    /******************************************************************************
     * Module : es6.object.prototype                                              *
     ******************************************************************************/
    
    !function(tmp){
      // 19.1.3.6 Object.prototype.toString()
      tmp[SYMBOL_TAG] = DOT;
      if(cof(tmp) != DOT)hidden(ObjectProto, TO_STRING, function(){
        return '[object ' + classof(this) + ']';
      });
    }({});
    
    /******************************************************************************
     * Module : es6.object.statics-accept-primitives                              *
     ******************************************************************************/
    
    !function(){
      // Object static methods accept primitives
      function wrapObjectMethod(key, MODE){
        var fn  = Object[key]
          , exp = core[OBJECT][key]
          , f   = 0
          , o   = {};
        if(!exp || isNative(exp)){
          o[key] = MODE == 1 ? function(it){
            return isObject(it) ? fn(it) : it;
          } : MODE == 2 ? function(it){
            return isObject(it) ? fn(it) : true;
          } : MODE == 3 ? function(it){
            return isObject(it) ? fn(it) : false;
          } : MODE == 4 ? function(it, key){
            return fn(toObject(it), key);
          } : function(it){
            return fn(toObject(it));
          };
          try { fn(DOT) }
          catch(e){ f = 1 }
          $define(STATIC + FORCED * f, OBJECT, o);
        }
      }
      wrapObjectMethod('freeze', 1);
      wrapObjectMethod('seal', 1);
      wrapObjectMethod('preventExtensions', 1);
      wrapObjectMethod('isFrozen', 2);
      wrapObjectMethod('isSealed', 2);
      wrapObjectMethod('isExtensible', 3);
      wrapObjectMethod('getOwnPropertyDescriptor', 4);
      wrapObjectMethod('getPrototypeOf');
      wrapObjectMethod('keys');
      wrapObjectMethod('getOwnPropertyNames');
    }();
    
    /******************************************************************************
     * Module : es6.function                                                      *
     ******************************************************************************/
    
    !function(NAME){
      // 19.2.4.2 name
      NAME in FunctionProto || (DESC && defineProperty(FunctionProto, NAME, {
        configurable: true,
        get: function(){
          var match = String(this).match(/^\s*function ([^ (]*)/)
            , name  = match ? match[1] : '';
          has(this, NAME) || defineProperty(this, NAME, descriptor(5, name));
          return name;
        },
        set: function(value){
          has(this, NAME) || defineProperty(this, NAME, descriptor(0, value));
        }
      }));
    }('name');
    
    /******************************************************************************
     * Module : es6.number.constructor                                            *
     ******************************************************************************/
    
    Number('0o1') && Number('0b1') || function(_Number, NumberProto){
      function toNumber(it){
        if(isObject(it))it = toPrimitive(it);
        if(typeof it == 'string' && it.length > 2 && it.charCodeAt(0) == 48){
          var binary = false;
          switch(it.charCodeAt(1)){
            case 66 : case 98  : binary = true;
            case 79 : case 111 : return parseInt(it.slice(2), binary ? 2 : 8);
          }
        } return +it;
      }
      function toPrimitive(it){
        var fn, val;
        if(isFunction(fn = it.valueOf) && !isObject(val = fn.call(it)))return val;
        if(isFunction(fn = it[TO_STRING]) && !isObject(val = fn.call(it)))return val;
        throw TypeError("Can't convert object to number");
      }
      Number = function Number(it){
        return this instanceof Number ? new _Number(toNumber(it)) : toNumber(it);
      }
      forEach.call(DESC ? getNames(_Number)
      : array('MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY'), function(key){
        key in Number || defineProperty(Number, key, getOwnDescriptor(_Number, key));
      });
      Number[PROTOTYPE] = NumberProto;
      NumberProto[CONSTRUCTOR] = Number;
      hidden(global, NUMBER, Number);
    }(Number, Number[PROTOTYPE]);
    
    /******************************************************************************
     * Module : es6.number.statics                                                *
     ******************************************************************************/
    
    !function(isInteger){
      $define(STATIC, NUMBER, {
        // 20.1.2.1 Number.EPSILON
        EPSILON: pow(2, -52),
        // 20.1.2.2 Number.isFinite(number)
        isFinite: function(it){
          return typeof it == 'number' && isFinite(it);
        },
        // 20.1.2.3 Number.isInteger(number)
        isInteger: isInteger,
        // 20.1.2.4 Number.isNaN(number)
        isNaN: sameNaN,
        // 20.1.2.5 Number.isSafeInteger(number)
        isSafeInteger: function(number){
          return isInteger(number) && abs(number) <= MAX_SAFE_INTEGER;
        },
        // 20.1.2.6 Number.MAX_SAFE_INTEGER
        MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
        // 20.1.2.10 Number.MIN_SAFE_INTEGER
        MIN_SAFE_INTEGER: -MAX_SAFE_INTEGER,
        // 20.1.2.12 Number.parseFloat(string)
        parseFloat: parseFloat,
        // 20.1.2.13 Number.parseInt(string, radix)
        parseInt: parseInt
      });
    // 20.1.2.3 Number.isInteger(number)
    }(Number.isInteger || function(it){
      return !isObject(it) && isFinite(it) && floor(it) === it;
    });
    
    /******************************************************************************
     * Module : es6.math                                                          *
     ******************************************************************************/
    
    // ECMAScript 6 shim
    !function(){
      // 20.2.2.28 Math.sign(x)
      var E    = Math.E
        , exp  = Math.exp
        , log  = Math.log
        , sqrt = Math.sqrt
        , sign = Math.sign || function(x){
            return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
          };
      
      // 20.2.2.5 Math.asinh(x)
      function asinh(x){
        return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
      }
      // 20.2.2.14 Math.expm1(x)
      function expm1(x){
        return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
      }
        
      $define(STATIC, MATH, {
        // 20.2.2.3 Math.acosh(x)
        acosh: function(x){
          return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;
        },
        // 20.2.2.5 Math.asinh(x)
        asinh: asinh,
        // 20.2.2.7 Math.atanh(x)
        atanh: function(x){
          return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
        },
        // 20.2.2.9 Math.cbrt(x)
        cbrt: function(x){
          return sign(x = +x) * pow(abs(x), 1 / 3);
        },
        // 20.2.2.11 Math.clz32(x)
        clz32: function(x){
          return (x >>>= 0) ? 32 - x[TO_STRING](2).length : 32;
        },
        // 20.2.2.12 Math.cosh(x)
        cosh: function(x){
          return (exp(x = +x) + exp(-x)) / 2;
        },
        // 20.2.2.14 Math.expm1(x)
        expm1: expm1,
        // 20.2.2.16 Math.fround(x)
        // TODO: fallback for IE9-
        fround: function(x){
          return new Float32Array([x])[0];
        },
        // 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
        hypot: function(value1, value2){
          var sum  = 0
            , len1 = arguments.length
            , len2 = len1
            , args = Array(len1)
            , larg = -Infinity
            , arg;
          while(len1--){
            arg = args[len1] = +arguments[len1];
            if(arg == Infinity || arg == -Infinity)return Infinity;
            if(arg > larg)larg = arg;
          }
          larg = arg || 1;
          while(len2--)sum += pow(args[len2] / larg, 2);
          return larg * sqrt(sum);
        },
        // 20.2.2.18 Math.imul(x, y)
        imul: function(x, y){
          var UInt16 = 0xffff
            , xn = +x
            , yn = +y
            , xl = UInt16 & xn
            , yl = UInt16 & yn;
          return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);
        },
        // 20.2.2.20 Math.log1p(x)
        log1p: function(x){
          return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
        },
        // 20.2.2.21 Math.log10(x)
        log10: function(x){
          return log(x) / Math.LN10;
        },
        // 20.2.2.22 Math.log2(x)
        log2: function(x){
          return log(x) / Math.LN2;
        },
        // 20.2.2.28 Math.sign(x)
        sign: sign,
        // 20.2.2.30 Math.sinh(x)
        sinh: function(x){
          return (abs(x = +x) < 1) ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
        },
        // 20.2.2.33 Math.tanh(x)
        tanh: function(x){
          var a = expm1(x = +x)
            , b = expm1(-x);
          return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
        },
        // 20.2.2.34 Math.trunc(x)
        trunc: trunc
      });
    }();
    
    /******************************************************************************
     * Module : es6.string                                                        *
     ******************************************************************************/
    
    !function(fromCharCode){
      function assertNotRegExp(it){
        if(cof(it) == REGEXP)throw TypeError();
      }
      
      $define(STATIC, STRING, {
        // 21.1.2.2 String.fromCodePoint(...codePoints)
        fromCodePoint: function(x){
          var res = []
            , len = arguments.length
            , i   = 0
            , code
          while(len > i){
            code = +arguments[i++];
            if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
            res.push(code < 0x10000
              ? fromCharCode(code)
              : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
            );
          } return res.join('');
        },
        // 21.1.2.4 String.raw(callSite, ...substitutions)
        raw: function(callSite){
          var raw = toObject(callSite.raw)
            , len = toLength(raw.length)
            , sln = arguments.length
            , res = []
            , i   = 0;
          while(len > i){
            res.push(String(raw[i++]));
            if(i < sln)res.push(String(arguments[i]));
          } return res.join('');
        }
      });
      
      $define(PROTO, STRING, {
        // 21.1.3.3 String.prototype.codePointAt(pos)
        codePointAt: createPointAt(false),
        // 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
        endsWith: function(searchString /*, endPosition = @length */){
          assertNotRegExp(searchString);
          var that = String(assertDefined(this))
            , endPosition = arguments[1]
            , len = toLength(that.length)
            , end = endPosition === undefined ? len : min(toLength(endPosition), len);
          searchString += '';
          return that.slice(end - searchString.length, end) === searchString;
        },
        // 21.1.3.7 String.prototype.includes(searchString, position = 0)
        includes: function(searchString /*, position = 0 */){
          assertNotRegExp(searchString);
          return !!~String(assertDefined(this)).indexOf(searchString, arguments[1]);
        },
        // 21.1.3.13 String.prototype.repeat(count)
        repeat: function(count){
          var str = String(assertDefined(this))
            , res = ''
            , n   = toInteger(count);
          if(0 > n || n == Infinity)throw RangeError("Count can't be negative");
          for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
          return res;
        },
        // 21.1.3.18 String.prototype.startsWith(searchString [, position ])
        startsWith: function(searchString /*, position = 0 */){
          assertNotRegExp(searchString);
          var that  = String(assertDefined(this))
            , index = toLength(min(arguments[1], that.length));
          searchString += '';
          return that.slice(index, index + searchString.length) === searchString;
        }
      });
    }(String.fromCharCode);
    
    /******************************************************************************
     * Module : es6.array.statics                                                 *
     ******************************************************************************/
    
    !function(){
      $define(STATIC + FORCED * checkDangerIterClosing(Array.from), ARRAY, {
        // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
        from: function(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
          var O       = Object(assertDefined(arrayLike))
            , mapfn   = arguments[1]
            , mapping = mapfn !== undefined
            , f       = mapping ? ctx(mapfn, arguments[2], 2) : undefined
            , index   = 0
            , length, result, step;
          if(isIterable(O)){
            result = new (generic(this, Array));
            safeIterClose(function(iterator){
              for(; !(step = iterator.next()).done; index++){
                result[index] = mapping ? f(step.value, index) : step.value;
              }
            }, getIterator(O));
          } else {
            result = new (generic(this, Array))(length = toLength(O.length));
            for(; length > index; index++){
              result[index] = mapping ? f(O[index], index) : O[index];
            }
          }
          result.length = index;
          return result;
        }
      });
      
      $define(STATIC, ARRAY, {
        // 22.1.2.3 Array.of( ...items)
        of: function(/* ...args */){
          var index  = 0
            , length = arguments.length
            , result = new (generic(this, Array))(length);
          while(length > index)result[index] = arguments[index++];
          result.length = length;
          return result;
        }
      });
      
      setSpecies(Array);
    }();
    
    /******************************************************************************
     * Module : es6.array.prototype                                               *
     ******************************************************************************/
    
    !function(){
      $define(PROTO, ARRAY, {
        // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
        copyWithin: function(target /* = 0 */, start /* = 0, end = @length */){
          var O     = Object(assertDefined(this))
            , len   = toLength(O.length)
            , to    = toIndex(target, len)
            , from  = toIndex(start, len)
            , end   = arguments[2]
            , fin   = end === undefined ? len : toIndex(end, len)
            , count = min(fin - from, len - to)
            , inc   = 1;
          if(from < to && to < from + count){
            inc  = -1;
            from = from + count - 1;
            to   = to + count - 1;
          }
          while(count-- > 0){
            if(from in O)O[to] = O[from];
            else delete O[to];
            to += inc;
            from += inc;
          } return O;
        },
        // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
        fill: function(value /*, start = 0, end = @length */){
          var O      = Object(assertDefined(this))
            , length = toLength(O.length)
            , index  = toIndex(arguments[1], length)
            , end    = arguments[2]
            , endPos = end === undefined ? length : toIndex(end, length);
          while(endPos > index)O[index++] = value;
          return O;
        },
        // 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
        find: createArrayMethod(5),
        // 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
        findIndex: createArrayMethod(6)
      });
      
      if(framework){
        // 22.1.3.31 Array.prototype[@@unscopables]
        forEach.call(array('find,findIndex,fill,copyWithin,entries,keys,values'), function(it){
          ArrayUnscopables[it] = true;
        });
        SYMBOL_UNSCOPABLES in ArrayProto || hidden(ArrayProto, SYMBOL_UNSCOPABLES, ArrayUnscopables);
      }
    }();
    
    /******************************************************************************
     * Module : es6.iterators                                                     *
     ******************************************************************************/
    
    !function(at){
      // 22.1.3.4 Array.prototype.entries()
      // 22.1.3.13 Array.prototype.keys()
      // 22.1.3.29 Array.prototype.values()
      // 22.1.3.30 Array.prototype[@@iterator]()
      defineStdIterators(Array, ARRAY, function(iterated, kind){
        set(this, ITER, {o: toObject(iterated), i: 0, k: kind});
      // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
      }, function(){
        var iter  = this[ITER]
          , O     = iter.o
          , kind  = iter.k
          , index = iter.i++;
        if(!O || index >= O.length){
          iter.o = undefined;
          return iterResult(1);
        }
        if(kind == KEY)  return iterResult(0, index);
        if(kind == VALUE)return iterResult(0, O[index]);
                         return iterResult(0, [index, O[index]]);
      }, VALUE);
      
      // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
      Iterators[ARGUMENTS] = Iterators[ARRAY];
      
      // 21.1.3.27 String.prototype[@@iterator]()
      defineStdIterators(String, STRING, function(iterated){
        set(this, ITER, {o: String(iterated), i: 0});
      // 21.1.5.2.1 %StringIteratorPrototype%.next()
      }, function(){
        var iter  = this[ITER]
          , O     = iter.o
          , index = iter.i
          , point;
        if(index >= O.length)return iterResult(1);
        point = at.call(O, index);
        iter.i += point.length;
        return iterResult(0, point);
      });
    }(createPointAt(true));
    
    /******************************************************************************
     * Module : es6.regexp                                                        *
     ******************************************************************************/
    
    DESC && !function(RegExpProto, _RegExp){  
      // RegExp allows a regex with flags as the pattern
      if(!function(){try{return RegExp(/a/g, 'i') == '/a/i'}catch(e){}}()){
        RegExp = function RegExp(pattern, flags){
          return new _RegExp(cof(pattern) == REGEXP && flags !== undefined
            ? pattern.source : pattern, flags);
        }
        forEach.call(getNames(_RegExp), function(key){
          key in RegExp || defineProperty(RegExp, key, {
            configurable: true,
            get: function(){ return _RegExp[key] },
            set: function(it){ _RegExp[key] = it }
          });
        });
        RegExpProto[CONSTRUCTOR] = RegExp;
        RegExp[PROTOTYPE] = RegExpProto;
        hidden(global, REGEXP, RegExp);
      }
      
      // 21.2.5.3 get RegExp.prototype.flags()
      if(/./g.flags != 'g')defineProperty(RegExpProto, 'flags', {
        configurable: true,
        get: createReplacer(/^.*\/(\w*)$/, '$1')
      });
      
      setSpecies(RegExp);
    }(RegExp[PROTOTYPE], RegExp);
    
    /******************************************************************************
     * Module : web.immediate                                                     *
     ******************************************************************************/
    
    // setImmediate shim
    // Node.js 0.9+ & IE10+ has setImmediate, else:
    isFunction(setImmediate) && isFunction(clearImmediate) || function(ONREADYSTATECHANGE){
      var postMessage      = global.postMessage
        , addEventListener = global.addEventListener
        , MessageChannel   = global.MessageChannel
        , counter          = 0
        , queue            = {}
        , defer, channel, port;
      setImmediate = function(fn){
        var args = [], i = 1;
        while(arguments.length > i)args.push(arguments[i++]);
        queue[++counter] = function(){
          invoke(isFunction(fn) ? fn : Function(fn), args);
        }
        defer(counter);
        return counter;
      }
      clearImmediate = function(id){
        delete queue[id];
      }
      function run(id){
        if(has(queue, id)){
          var fn = queue[id];
          delete queue[id];
          fn();
        }
      }
      function listner(event){
        run(event.data);
      }
      // Node.js 0.8-
      if(NODE){
        defer = function(id){
          nextTick(part.call(run, id));
        }
      // Modern browsers, skip implementation for WebWorkers
      // IE8 has postMessage, but it's sync & typeof its postMessage is object
      } else if(addEventListener && isFunction(postMessage) && !global.importScripts){
        defer = function(id){
          postMessage(id, '*');
        }
        addEventListener('message', listner, false);
      // WebWorkers
      } else if(isFunction(MessageChannel)){
        channel = new MessageChannel;
        port    = channel.port2;
        channel.port1.onmessage = listner;
        defer = ctx(port.postMessage, port, 1);
      // IE8-
      } else if(document && ONREADYSTATECHANGE in document[CREATE_ELEMENT]('script')){
        defer = function(id){
          html.appendChild(document[CREATE_ELEMENT]('script'))[ONREADYSTATECHANGE] = function(){
            html.removeChild(this);
            run(id);
          }
        }
      // Rest old browsers
      } else {
        defer = function(id){
          setTimeout(run, 0, id);
        }
      }
    }('onreadystatechange');
    $define(GLOBAL + BIND, {
      setImmediate:   setImmediate,
      clearImmediate: clearImmediate
    });
    
    /******************************************************************************
     * Module : es6.promise                                                       *
     ******************************************************************************/
    
    // ES6 promises shim
    // Based on https://github.com/getify/native-promise-only/
    !function(Promise, test){
      isFunction(Promise) && isFunction(Promise.resolve)
      && Promise.resolve(test = new Promise(function(){})) == test
      || function(asap, RECORD){
        function isThenable(it){
          var then;
          if(isObject(it))then = it.then;
          return isFunction(then) ? then : false;
        }
        function handledRejectionOrHasOnRejected(promise){
          var record = promise[RECORD]
            , chain  = record.c
            , i      = 0
            , react;
          if(record.h)return true;
          while(chain.length > i){
            react = chain[i++];
            if(react.fail || handledRejectionOrHasOnRejected(react.P))return true;
          }
        }
        function notify(record, reject){
          var chain = record.c;
          if(reject || chain.length)asap(function(){
            var promise = record.p
              , value   = record.v
              , ok      = record.s == 1
              , i       = 0;
            if(reject && !handledRejectionOrHasOnRejected(promise)){
              setTimeout(function(){
                if(!handledRejectionOrHasOnRejected(promise)){
                  if(NODE){
                    if(!process.emit('unhandledRejection', value, promise)){
                      // default node.js behavior
                    }
                  } else if(isFunction(console.error)){
                    console.error('Unhandled promise rejection', value);
                  }
                }
              }, 1e3);
            } else while(chain.length > i)!function(react){
              var cb = ok ? react.ok : react.fail
                , ret, then;
              try {
                if(cb){
                  if(!ok)record.h = true;
                  ret = cb === true ? value : cb(value);
                  if(ret === react.P){
                    react.rej(TypeError(PROMISE + '-chain cycle'));
                  } else if(then = isThenable(ret)){
                    then.call(ret, react.res, react.rej);
                  } else react.res(ret);
                } else react.rej(value);
              } catch(err){
                react.rej(err);
              }
            }(chain[i++]);
            chain.length = 0;
          });
        }
        function resolve(value){
          var record = this
            , then, wrapper;
          if(record.d)return;
          record.d = true;
          record = record.r || record; // unwrap
          try {
            if(then = isThenable(value)){
              wrapper = {r: record, d: false}; // wrap
              then.call(value, ctx(resolve, wrapper, 1), ctx(reject, wrapper, 1));
            } else {
              record.v = value;
              record.s = 1;
              notify(record);
            }
          } catch(err){
            reject.call(wrapper || {r: record, d: false}, err); // wrap
          }
        }
        function reject(value){
          var record = this;
          if(record.d)return;
          record.d = true;
          record = record.r || record; // unwrap
          record.v = value;
          record.s = 2;
          notify(record, true);
        }
        function getConstructor(C){
          var S = assertObject(C)[SYMBOL_SPECIES];
          return S != undefined ? S : C;
        }
        // 25.4.3.1 Promise(executor)
        Promise = function(executor){
          assertFunction(executor);
          assertInstance(this, Promise, PROMISE);
          var record = {
            p: this,      // promise
            c: [],        // chain
            s: 0,         // state
            d: false,     // done
            v: undefined, // value
            h: false      // handled rejection
          };
          hidden(this, RECORD, record);
          try {
            executor(ctx(resolve, record, 1), ctx(reject, record, 1));
          } catch(err){
            reject.call(record, err);
          }
        }
        assignHidden(Promise[PROTOTYPE], {
          // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
          then: function(onFulfilled, onRejected){
            var S = assertObject(assertObject(this)[CONSTRUCTOR])[SYMBOL_SPECIES];
            var react = {
              ok:   isFunction(onFulfilled) ? onFulfilled : true,
              fail: isFunction(onRejected)  ? onRejected  : false
            } , P = react.P = new (S != undefined ? S : Promise)(function(resolve, reject){
              react.res = assertFunction(resolve);
              react.rej = assertFunction(reject);
            }), record = this[RECORD];
            record.c.push(react);
            record.s && notify(record);
            return P;
          },
          // 25.4.5.1 Promise.prototype.catch(onRejected)
          'catch': function(onRejected){
            return this.then(undefined, onRejected);
          }
        });
        assignHidden(Promise, {
          // 25.4.4.1 Promise.all(iterable)
          all: function(iterable){
            var Promise = getConstructor(this)
              , values  = [];
            return new Promise(function(resolve, reject){
              forOf(iterable, false, push, values);
              var remaining = values.length
                , results   = Array(remaining);
              if(remaining)forEach.call(values, function(promise, index){
                Promise.resolve(promise).then(function(value){
                  results[index] = value;
                  --remaining || resolve(results);
                }, reject);
              });
              else resolve(results);
            });
          },
          // 25.4.4.4 Promise.race(iterable)
          race: function(iterable){
            var Promise = getConstructor(this);
            return new Promise(function(resolve, reject){
              forOf(iterable, false, function(promise){
                Promise.resolve(promise).then(resolve, reject);
              });
            });
          },
          // 25.4.4.5 Promise.reject(r)
          reject: function(r){
            return new (getConstructor(this))(function(resolve, reject){
              reject(r);
            });
          },
          // 25.4.4.6 Promise.resolve(x)
          resolve: function(x){
            return isObject(x) && RECORD in x && getPrototypeOf(x) === this[PROTOTYPE]
              ? x : new (getConstructor(this))(function(resolve, reject){
                resolve(x);
              });
          }
        });
      }(nextTick || setImmediate, safeSymbol('record'));
      setToStringTag(Promise, PROMISE);
      setSpecies(Promise);
      $define(GLOBAL + FORCED * !isNative(Promise), {Promise: Promise});
    }(global[PROMISE]);
    
    /******************************************************************************
     * Module : es6.collections                                                   *
     ******************************************************************************/
    
    // ECMAScript 6 collections shim
    !function(){
      var UID   = safeSymbol('uid')
        , O1    = safeSymbol('O1')
        , WEAK  = safeSymbol('weak')
        , LEAK  = safeSymbol('leak')
        , LAST  = safeSymbol('last')
        , FIRST = safeSymbol('first')
        , SIZE  = DESC ? safeSymbol('size') : 'size'
        , uid   = 0
        , tmp   = {};
      
      function getCollection(C, NAME, methods, commonMethods, isMap, isWeak){
        var ADDER = isMap ? 'set' : 'add'
          , proto = C && C[PROTOTYPE]
          , O     = {};
        function initFromIterable(that, iterable){
          if(iterable != undefined)forOf(iterable, isMap, that[ADDER], that);
          return that;
        }
        function fixSVZ(key, chain){
          var method = proto[key];
          if(framework)proto[key] = function(a, b){
            var result = method.call(this, a === 0 ? 0 : a, b);
            return chain ? this : result;
          };
        }
        if(!isNative(C) || !(isWeak || (!BUGGY_ITERATORS && has(proto, FOR_EACH) && has(proto, 'entries')))){
          // create collection constructor
          C = isWeak
            ? function(iterable){
                assertInstance(this, C, NAME);
                set(this, UID, uid++);
                initFromIterable(this, iterable);
              }
            : function(iterable){
                var that = this;
                assertInstance(that, C, NAME);
                set(that, O1, create(null));
                set(that, SIZE, 0);
                set(that, LAST, undefined);
                set(that, FIRST, undefined);
                initFromIterable(that, iterable);
              };
          assignHidden(assignHidden(C[PROTOTYPE], methods), commonMethods);
          isWeak || !DESC || defineProperty(C[PROTOTYPE], 'size', {get: function(){
            return assertDefined(this[SIZE]);
          }});
        } else {
          var Native = C
            , inst   = new C
            , chain  = inst[ADDER](isWeak ? {} : -0, 1)
            , buggyZero;
          // wrap to init collections from iterable
          if(checkDangerIterClosing(function(O){ new C(O) })){
            C = function(iterable){
              assertInstance(this, C, NAME);
              return initFromIterable(new Native, iterable);
            }
            C[PROTOTYPE] = proto;
            if(framework)proto[CONSTRUCTOR] = C;
          }
          isWeak || inst[FOR_EACH](function(val, key){
            buggyZero = 1 / key === -Infinity;
          });
          // fix converting -0 key to +0
          if(buggyZero){
            fixSVZ('delete');
            fixSVZ('has');
            isMap && fixSVZ('get');
          }
          // + fix .add & .set for chaining
          if(buggyZero || chain !== inst)fixSVZ(ADDER, true);
        }
        setToStringTag(C, NAME);
        setSpecies(C);
        
        O[NAME] = C;
        $define(GLOBAL + WRAP + FORCED * !isNative(C), O);
        
        // add .keys, .values, .entries, [@@iterator]
        // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
        isWeak || defineStdIterators(C, NAME, function(iterated, kind){
          set(this, ITER, {o: iterated, k: kind});
        }, function(){
          var iter  = this[ITER]
            , kind  = iter.k
            , entry = iter.l;
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
          // get next entry
          if(!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])){
            // or finish the iteration
            iter.o = undefined;
            return iterResult(1);
          }
          // return step by kind
          if(kind == KEY)  return iterResult(0, entry.k);
          if(kind == VALUE)return iterResult(0, entry.v);
                           return iterResult(0, [entry.k, entry.v]);   
        }, isMap ? KEY+VALUE : VALUE, !isMap);
        
        return C;
      }
      
      function fastKey(it, create){
        // return primitive with prefix
        if(!isObject(it))return (typeof it == 'string' ? 'S' : 'P') + it;
        // can't set id to frozen object
        if(isFrozen(it))return 'F';
        if(!has(it, UID)){
          // not necessary to add id
          if(!create)return 'E';
          // add missing object id
          hidden(it, UID, ++uid);
        // return object id with prefix
        } return 'O' + it[UID];
      }
      function getEntry(that, key){
        // fast case
        var index = fastKey(key), entry;
        if(index != 'F')return that[O1][index];
        // frozen object case
        for(entry = that[FIRST]; entry; entry = entry.n){
          if(entry.k == key)return entry;
        }
      }
      function def(that, key, value){
        var entry = getEntry(that, key)
          , prev, index;
        // change existing entry
        if(entry)entry.v = value;
        // create new entry
        else {
          that[LAST] = entry = {
            i: index = fastKey(key, true), // <- index
            k: key,                        // <- key
            v: value,                      // <- value
            p: prev = that[LAST],          // <- previous entry
            n: undefined,                  // <- next entry
            r: false                       // <- removed
          };
          if(!that[FIRST])that[FIRST] = entry;
          if(prev)prev.n = entry;
          that[SIZE]++;
          // add to index
          if(index != 'F')that[O1][index] = entry;
        } return that;
      }
    
      var collectionMethods = {
        // 23.1.3.1 Map.prototype.clear()
        // 23.2.3.2 Set.prototype.clear()
        clear: function(){
          for(var that = this, data = that[O1], entry = that[FIRST]; entry; entry = entry.n){
            entry.r = true;
            if(entry.p)entry.p = entry.p.n = undefined;
            delete data[entry.i];
          }
          that[FIRST] = that[LAST] = undefined;
          that[SIZE] = 0;
        },
        // 23.1.3.3 Map.prototype.delete(key)
        // 23.2.3.4 Set.prototype.delete(value)
        'delete': function(key){
          var that  = this
            , entry = getEntry(that, key);
          if(entry){
            var next = entry.n
              , prev = entry.p;
            delete that[O1][entry.i];
            entry.r = true;
            if(prev)prev.n = next;
            if(next)next.p = prev;
            if(that[FIRST] == entry)that[FIRST] = next;
            if(that[LAST] == entry)that[LAST] = prev;
            that[SIZE]--;
          } return !!entry;
        },
        // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
        // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
        forEach: function(callbackfn /*, that = undefined */){
          var f = ctx(callbackfn, arguments[1], 3)
            , entry;
          while(entry = entry ? entry.n : this[FIRST]){
            f(entry.v, entry.k, this);
            // revert to the last existing entry
            while(entry && entry.r)entry = entry.p;
          }
        },
        // 23.1.3.7 Map.prototype.has(key)
        // 23.2.3.7 Set.prototype.has(value)
        has: function(key){
          return !!getEntry(this, key);
        }
      }
      
      // 23.1 Map Objects
      Map = getCollection(Map, MAP, {
        // 23.1.3.6 Map.prototype.get(key)
        get: function(key){
          var entry = getEntry(this, key);
          return entry && entry.v;
        },
        // 23.1.3.9 Map.prototype.set(key, value)
        set: function(key, value){
          return def(this, key === 0 ? 0 : key, value);
        }
      }, collectionMethods, true);
      
      // 23.2 Set Objects
      Set = getCollection(Set, SET, {
        // 23.2.3.1 Set.prototype.add(value)
        add: function(value){
          return def(this, value = value === 0 ? 0 : value, value);
        }
      }, collectionMethods);
      
      function defWeak(that, key, value){
        if(isFrozen(assertObject(key)))leakStore(that).set(key, value);
        else {
          has(key, WEAK) || hidden(key, WEAK, {});
          key[WEAK][that[UID]] = value;
        } return that;
      }
      function leakStore(that){
        return that[LEAK] || hidden(that, LEAK, new Map)[LEAK];
      }
      
      var weakMethods = {
        // 23.3.3.2 WeakMap.prototype.delete(key)
        // 23.4.3.3 WeakSet.prototype.delete(value)
        'delete': function(key){
          if(!isObject(key))return false;
          if(isFrozen(key))return leakStore(this)['delete'](key);
          return has(key, WEAK) && has(key[WEAK], this[UID]) && delete key[WEAK][this[UID]];
        },
        // 23.3.3.4 WeakMap.prototype.has(key)
        // 23.4.3.4 WeakSet.prototype.has(value)
        has: function(key){
          if(!isObject(key))return false;
          if(isFrozen(key))return leakStore(this).has(key);
          return has(key, WEAK) && has(key[WEAK], this[UID]);
        }
      };
      
      // 23.3 WeakMap Objects
      WeakMap = getCollection(WeakMap, WEAKMAP, {
        // 23.3.3.3 WeakMap.prototype.get(key)
        get: function(key){
          if(isObject(key)){
            if(isFrozen(key))return leakStore(this).get(key);
            if(has(key, WEAK))return key[WEAK][this[UID]];
          }
        },
        // 23.3.3.5 WeakMap.prototype.set(key, value)
        set: function(key, value){
          return defWeak(this, key, value);
        }
      }, weakMethods, true, true);
      
      // IE11 WeakMap frozen keys fix
      if(framework && new WeakMap().set(Object.freeze(tmp), 7).get(tmp) != 7){
        forEach.call(array('delete,has,get,set'), function(key){
          var method = WeakMap[PROTOTYPE][key];
          WeakMap[PROTOTYPE][key] = function(a, b){
            // store frozen objects on leaky map
            if(isObject(a) && isFrozen(a)){
              var result = leakStore(this)[key](a, b);
              return key == 'set' ? this : result;
            // store all the rest on native weakmap
            } return method.call(this, a, b);
          };
        });
      }
      
      // 23.4 WeakSet Objects
      WeakSet = getCollection(WeakSet, WEAKSET, {
        // 23.4.3.1 WeakSet.prototype.add(value)
        add: function(value){
          return defWeak(this, value, true);
        }
      }, weakMethods, false, true);
    }();
    
    /******************************************************************************
     * Module : es6.reflect                                                       *
     ******************************************************************************/
    
    !function(){
      function Enumerate(iterated){
        var keys = [], key;
        for(key in iterated)keys.push(key);
        set(this, ITER, {o: iterated, a: keys, i: 0});
      }
      createIterator(Enumerate, OBJECT, function(){
        var iter = this[ITER]
          , keys = iter.a
          , key;
        do {
          if(iter.i >= keys.length)return iterResult(1);
        } while(!((key = keys[iter.i++]) in iter.o));
        return iterResult(0, key);
      });
      
      function wrap(fn){
        return function(it){
          assertObject(it);
          try {
            return fn.apply(undefined, arguments), true;
          } catch(e){
            return false;
          }
        }
      }
      
      function reflectGet(target, propertyKey/*, receiver*/){
        var receiver = arguments.length < 3 ? target : arguments[2]
          , desc = getOwnDescriptor(assertObject(target), propertyKey), proto;
        if(desc)return has(desc, 'value')
          ? desc.value
          : desc.get === undefined
            ? undefined
            : desc.get.call(receiver);
        return isObject(proto = getPrototypeOf(target))
          ? reflectGet(proto, propertyKey, receiver)
          : undefined;
      }
      function reflectSet(target, propertyKey, V/*, receiver*/){
        var receiver = arguments.length < 4 ? target : arguments[3]
          , ownDesc  = getOwnDescriptor(assertObject(target), propertyKey)
          , existingDescriptor, proto;
        if(!ownDesc){
          if(isObject(proto = getPrototypeOf(target))){
            return reflectSet(proto, propertyKey, V, receiver);
          }
          ownDesc = descriptor(0);
        }
        if(has(ownDesc, 'value')){
          if(ownDesc.writable === false || !isObject(receiver))return false;
          existingDescriptor = getOwnDescriptor(receiver, propertyKey) || descriptor(0);
          existingDescriptor.value = V;
          return defineProperty(receiver, propertyKey, existingDescriptor), true;
        }
        return ownDesc.set === undefined
          ? false
          : (ownDesc.set.call(receiver, V), true);
      }
      var isExtensible = Object.isExtensible || returnIt;
      
      var reflect = {
        // 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
        apply: ctx(call, apply, 3),
        // 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
        construct: function(target, argumentsList /*, newTarget*/){
          var proto    = assertFunction(arguments.length < 3 ? target : arguments[2])[PROTOTYPE]
            , instance = create(isObject(proto) ? proto : ObjectProto)
            , result   = apply.call(target, instance, argumentsList);
          return isObject(result) ? result : instance;
        },
        // 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
        defineProperty: wrap(defineProperty),
        // 26.1.4 Reflect.deleteProperty(target, propertyKey)
        deleteProperty: function(target, propertyKey){
          var desc = getOwnDescriptor(assertObject(target), propertyKey);
          return desc && !desc.configurable ? false : delete target[propertyKey];
        },
        // 26.1.5 Reflect.enumerate(target)
        enumerate: function(target){
          return new Enumerate(assertObject(target));
        },
        // 26.1.6 Reflect.get(target, propertyKey [, receiver])
        get: reflectGet,
        // 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
        getOwnPropertyDescriptor: function(target, propertyKey){
          return getOwnDescriptor(assertObject(target), propertyKey);
        },
        // 26.1.8 Reflect.getPrototypeOf(target)
        getPrototypeOf: function(target){
          return getPrototypeOf(assertObject(target));
        },
        // 26.1.9 Reflect.has(target, propertyKey)
        has: function(target, propertyKey){
          return propertyKey in target;
        },
        // 26.1.10 Reflect.isExtensible(target)
        isExtensible: function(target){
          return !!isExtensible(assertObject(target));
        },
        // 26.1.11 Reflect.ownKeys(target)
        ownKeys: ownKeys,
        // 26.1.12 Reflect.preventExtensions(target)
        preventExtensions: wrap(Object.preventExtensions || returnIt),
        // 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
        set: reflectSet
      }
      // 26.1.14 Reflect.setPrototypeOf(target, proto)
      if(setPrototypeOf)reflect.setPrototypeOf = function(target, proto){
        return setPrototypeOf(assertObject(target), proto), true;
      };
      
      $define(GLOBAL, {Reflect: {}});
      $define(STATIC, 'Reflect', reflect);
    }();
    
    /******************************************************************************
     * Module : es7.proposals                                                     *
     ******************************************************************************/
    
    !function(){
      $define(PROTO, ARRAY, {
        // https://github.com/domenic/Array.prototype.includes
        includes: createArrayContains(true)
      });
      $define(PROTO, STRING, {
        // https://github.com/mathiasbynens/String.prototype.at
        at: createPointAt(true)
      });
      
      function createObjectToArray(isEntries){
        return function(object){
          var O      = toObject(object)
            , keys   = getKeys(object)
            , length = keys.length
            , i      = 0
            , result = Array(length)
            , key;
          if(isEntries)while(length > i)result[i] = [key = keys[i++], O[key]];
          else while(length > i)result[i] = O[keys[i++]];
          return result;
        }
      }
      $define(STATIC, OBJECT, {
        // https://gist.github.com/WebReflection/9353781
        getOwnPropertyDescriptors: function(object){
          var O      = toObject(object)
            , result = {};
          forEach.call(ownKeys(O), function(key){
            defineProperty(result, key, descriptor(0, getOwnDescriptor(O, key)));
          });
          return result;
        },
        // https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-04/apr-9.md#51-objectentries-objectvalues
        values:  createObjectToArray(false),
        entries: createObjectToArray(true)
      });
      $define(STATIC, REGEXP, {
        // https://gist.github.com/kangax/9698100
        escape: createReplacer(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1', true)
      });
    }();
    
    /******************************************************************************
     * Module : es7.abstract-refs                                                 *
     ******************************************************************************/
    
    // https://github.com/zenparsing/es-abstract-refs
    !function(REFERENCE){
      REFERENCE_GET = getWellKnownSymbol(REFERENCE+'Get', true);
      var REFERENCE_SET = getWellKnownSymbol(REFERENCE+SET, true)
        , REFERENCE_DELETE = getWellKnownSymbol(REFERENCE+'Delete', true);
      
      $define(STATIC, SYMBOL, {
        referenceGet: REFERENCE_GET,
        referenceSet: REFERENCE_SET,
        referenceDelete: REFERENCE_DELETE
      });
      
      hidden(FunctionProto, REFERENCE_GET, returnThis);
      
      function setMapMethods(Constructor){
        if(Constructor){
          var MapProto = Constructor[PROTOTYPE];
          hidden(MapProto, REFERENCE_GET, MapProto.get);
          hidden(MapProto, REFERENCE_SET, MapProto.set);
          hidden(MapProto, REFERENCE_DELETE, MapProto['delete']);
        }
      }
      setMapMethods(Map);
      setMapMethods(WeakMap);
    }('reference');
    
    /******************************************************************************
     * Module : core.dict                                                         *
     ******************************************************************************/
    
    !function(DICT){
      Dict = function(iterable){
        var dict = create(null);
        if(iterable != undefined){
          if(isIterable(iterable)){
            forOf(iterable, true, function(key, value){
              dict[key] = value;
            });
          } else assign(dict, iterable);
        }
        return dict;
      }
      Dict[PROTOTYPE] = null;
      
      function DictIterator(iterated, kind){
        set(this, ITER, {o: toObject(iterated), a: getKeys(iterated), i: 0, k: kind});
      }
      createIterator(DictIterator, DICT, function(){
        var iter = this[ITER]
          , O    = iter.o
          , keys = iter.a
          , kind = iter.k
          , key;
        do {
          if(iter.i >= keys.length){
            iter.o = undefined;
            return iterResult(1);
          }
        } while(!has(O, key = keys[iter.i++]));
        if(kind == KEY)  return iterResult(0, key);
        if(kind == VALUE)return iterResult(0, O[key]);
                         return iterResult(0, [key, O[key]]);
      });
      function createDictIter(kind){
        return function(it){
          return new DictIterator(it, kind);
        }
      }
      
      /*
       * 0 -> forEach
       * 1 -> map
       * 2 -> filter
       * 3 -> some
       * 4 -> every
       * 5 -> find
       * 6 -> findKey
       * 7 -> mapPairs
       */
      function createDictMethod(type){
        var isMap    = type == 1
          , isEvery  = type == 4;
        return function(object, callbackfn, that /* = undefined */){
          var f      = ctx(callbackfn, that, 3)
            , O      = toObject(object)
            , result = isMap || type == 7 || type == 2 ? new (generic(this, Dict)) : undefined
            , key, val, res;
          for(key in O)if(has(O, key)){
            val = O[key];
            res = f(val, key, object);
            if(type){
              if(isMap)result[key] = res;             // map
              else if(res)switch(type){
                case 2: result[key] = val; break      // filter
                case 3: return true;                  // some
                case 5: return val;                   // find
                case 6: return key;                   // findKey
                case 7: result[res[0]] = res[1];      // mapPairs
              } else if(isEvery)return false;         // every
            }
          }
          return type == 3 || isEvery ? isEvery : result;
        }
      }
      function createDictReduce(isTurn){
        return function(object, mapfn, init){
          assertFunction(mapfn);
          var O      = toObject(object)
            , keys   = getKeys(O)
            , length = keys.length
            , i      = 0
            , memo, key, result;
          if(isTurn)memo = init == undefined ? new (generic(this, Dict)) : Object(init);
          else if(arguments.length < 3){
            assert(length, REDUCE_ERROR);
            memo = O[keys[i++]];
          } else memo = Object(init);
          while(length > i)if(has(O, key = keys[i++])){
            result = mapfn(memo, O[key], key, object);
            if(isTurn){
              if(result === false)break;
            } else memo = result;
          }
          return memo;
        }
      }
      var findKey = createDictMethod(6);
      function includes(object, el){
        return (el == el ? keyOf(object, el) : findKey(object, sameNaN)) !== undefined;
      }
      
      var dictMethods = {
        keys:    createDictIter(KEY),
        values:  createDictIter(VALUE),
        entries: createDictIter(KEY+VALUE),
        forEach: createDictMethod(0),
        map:     createDictMethod(1),
        filter:  createDictMethod(2),
        some:    createDictMethod(3),
        every:   createDictMethod(4),
        find:    createDictMethod(5),
        findKey: findKey,
        mapPairs:createDictMethod(7),
        reduce:  createDictReduce(false),
        turn:    createDictReduce(true),
        keyOf:   keyOf,
        includes:includes,
        // Has / get / set own property
        has: has,
        get: get,
        set: createDefiner(0),
        isDict: function(it){
          return isObject(it) && getPrototypeOf(it) === Dict[PROTOTYPE];
        }
      };
      
      if(REFERENCE_GET)for(var key in dictMethods)!function(fn){
        function method(){
          for(var args = [this], i = 0; i < arguments.length;)args.push(arguments[i++]);
          return invoke(fn, args);
        }
        fn[REFERENCE_GET] = function(){
          return method;
        }
      }(dictMethods[key]);
      
      $define(GLOBAL + FORCED, {Dict: assignHidden(Dict, dictMethods)});
    }('Dict');
    
    /******************************************************************************
     * Module : core.$for                                                         *
     ******************************************************************************/
    
    !function(ENTRIES, FN){  
      function $for(iterable, entries){
        if(!(this instanceof $for))return new $for(iterable, entries);
        this[ITER]    = getIterator(iterable);
        this[ENTRIES] = !!entries;
      }
      
      createIterator($for, 'Wrapper', function(){
        return this[ITER].next();
      });
      var $forProto = $for[PROTOTYPE];
      setIterator($forProto, function(){
        return this[ITER]; // unwrap
      });
      
      function createChainIterator(next){
        function Iter(I, fn, that){
          this[ITER]    = getIterator(I);
          this[ENTRIES] = I[ENTRIES];
          this[FN]      = ctx(fn, that, I[ENTRIES] ? 2 : 1);
        }
        createIterator(Iter, 'Chain', next, $forProto);
        setIterator(Iter[PROTOTYPE], returnThis); // override $forProto iterator
        return Iter;
      }
      
      var MapIter = createChainIterator(function(){
        var step = this[ITER].next();
        return step.done ? step : iterResult(0, stepCall(this[FN], step.value, this[ENTRIES]));
      });
      
      var FilterIter = createChainIterator(function(){
        for(;;){
          var step = this[ITER].next();
          if(step.done || stepCall(this[FN], step.value, this[ENTRIES]))return step;
        }
      });
      
      assignHidden($forProto, {
        of: function(fn, that){
          forOf(this, this[ENTRIES], fn, that);
        },
        array: function(fn, that){
          var result = [];
          forOf(fn != undefined ? this.map(fn, that) : this, false, push, result);
          return result;
        },
        filter: function(fn, that){
          return new FilterIter(this, fn, that);
        },
        map: function(fn, that){
          return new MapIter(this, fn, that);
        }
      });
      
      $for.isIterable  = isIterable;
      $for.getIterator = getIterator;
      
      $define(GLOBAL + FORCED, {$for: $for});
    }('entries', safeSymbol('fn'));
    
    /******************************************************************************
     * Module : core.delay                                                        *
     ******************************************************************************/
    
    // https://esdiscuss.org/topic/promise-returning-delay-function
    $define(GLOBAL + FORCED, {
      delay: function(time){
        return new Promise(function(resolve){
          setTimeout(resolve, time, true);
        });
      }
    });
    
    /******************************************************************************
     * Module : core.binding                                                      *
     ******************************************************************************/
    
    !function(_, toLocaleString){
      // Placeholder
      core._ = path._ = path._ || {};
    
      $define(PROTO + FORCED, FUNCTION, {
        part: part,
        only: function(numberArguments, that /* = @ */){
          var fn     = assertFunction(this)
            , n      = toLength(numberArguments)
            , isThat = arguments.length > 1;
          return function(/* ...args */){
            var length = min(n, arguments.length)
              , args   = Array(length)
              , i      = 0;
            while(length > i)args[i] = arguments[i++];
            return invoke(fn, args, isThat ? that : this);
          }
        }
      });
      
      function tie(key){
        var that  = this
          , bound = {};
        return hidden(that, _, function(key){
          if(key === undefined || !(key in that))return toLocaleString.call(that);
          return has(bound, key) ? bound[key] : (bound[key] = ctx(that[key], that, -1));
        })[_](key);
      }
      
      hidden(path._, TO_STRING, function(){
        return _;
      });
      
      hidden(ObjectProto, _, tie);
      DESC || hidden(ArrayProto, _, tie);
      // IE8- dirty hack - redefined toLocaleString is not enumerable
    }(DESC ? uid('tie') : TO_LOCALE, ObjectProto[TO_LOCALE]);
    
    /******************************************************************************
     * Module : core.object                                                       *
     ******************************************************************************/
    
    !function(){
      function define(target, mixin){
        var keys   = ownKeys(toObject(mixin))
          , length = keys.length
          , i = 0, key;
        while(length > i)defineProperty(target, key = keys[i++], getOwnDescriptor(mixin, key));
        return target;
      };
      $define(STATIC + FORCED, OBJECT, {
        isObject: isObject,
        classof: classof,
        define: define,
        make: function(proto, mixin){
          return define(create(proto), mixin);
        }
      });
    }();
    
    /******************************************************************************
     * Module : core.array                                                        *
     ******************************************************************************/
    
    $define(PROTO + FORCED, ARRAY, {
      turn: function(fn, target /* = [] */){
        assertFunction(fn);
        var memo   = target == undefined ? [] : Object(target)
          , O      = ES5Object(this)
          , length = toLength(O.length)
          , index  = 0;
        while(length > index)if(fn(memo, O[index], index++, this) === false)break;
        return memo;
      }
    });
    if(framework)ArrayUnscopables.turn = true;
    
    /******************************************************************************
     * Module : core.number                                                       *
     ******************************************************************************/
    
    !function(numberMethods){  
      function NumberIterator(iterated){
        set(this, ITER, {l: toLength(iterated), i: 0});
      }
      createIterator(NumberIterator, NUMBER, function(){
        var iter = this[ITER]
          , i    = iter.i++;
        return i < iter.l ? iterResult(0, i) : iterResult(1);
      });
      defineIterator(Number, NUMBER, function(){
        return new NumberIterator(this);
      });
      
      numberMethods.random = function(lim /* = 0 */){
        var a = +this
          , b = lim == undefined ? 0 : +lim
          , m = min(a, b);
        return random() * (max(a, b) - m) + m;
      };
    
      forEach.call(array(
          // ES3:
          'round,floor,ceil,abs,sin,asin,cos,acos,tan,atan,exp,sqrt,max,min,pow,atan2,' +
          // ES6:
          'acosh,asinh,atanh,cbrt,clz32,cosh,expm1,hypot,imul,log1p,log10,log2,sign,sinh,tanh,trunc'
        ), function(key){
          var fn = Math[key];
          if(fn)numberMethods[key] = function(/* ...args */){
            // ie9- dont support strict mode & convert `this` to object -> convert it to number
            var args = [+this]
              , i    = 0;
            while(arguments.length > i)args.push(arguments[i++]);
            return invoke(fn, args);
          }
        }
      );
      
      $define(PROTO + FORCED, NUMBER, numberMethods);
    }({});
    
    /******************************************************************************
     * Module : core.string                                                       *
     ******************************************************************************/
    
    !function(){
      var escapeHTMLDict = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;'
      }, unescapeHTMLDict = {}, key;
      for(key in escapeHTMLDict)unescapeHTMLDict[escapeHTMLDict[key]] = key;
      $define(PROTO + FORCED, STRING, {
        escapeHTML:   createReplacer(/[&<>"']/g, escapeHTMLDict),
        unescapeHTML: createReplacer(/&(?:amp|lt|gt|quot|apos);/g, unescapeHTMLDict)
      });
    }();
    
    /******************************************************************************
     * Module : core.date                                                         *
     ******************************************************************************/
    
    !function(formatRegExp, flexioRegExp, locales, current, SECONDS, MINUTES, HOURS, MONTH, YEAR){
      function createFormat(prefix){
        return function(template, locale /* = current */){
          var that = this
            , dict = locales[has(locales, locale) ? locale : current];
          function get(unit){
            return that[prefix + unit]();
          }
          return String(template).replace(formatRegExp, function(part){
            switch(part){
              case 's'  : return get(SECONDS);                  // Seconds : 0-59
              case 'ss' : return lz(get(SECONDS));              // Seconds : 00-59
              case 'm'  : return get(MINUTES);                  // Minutes : 0-59
              case 'mm' : return lz(get(MINUTES));              // Minutes : 00-59
              case 'h'  : return get(HOURS);                    // Hours   : 0-23
              case 'hh' : return lz(get(HOURS));                // Hours   : 00-23
              case 'D'  : return get(DATE);                     // Date    : 1-31
              case 'DD' : return lz(get(DATE));                 // Date    : 01-31
              case 'W'  : return dict[0][get('Day')];           // Day     : Понедельник
              case 'N'  : return get(MONTH) + 1;                // Month   : 1-12
              case 'NN' : return lz(get(MONTH) + 1);            // Month   : 01-12
              case 'M'  : return dict[2][get(MONTH)];           // Month   : Январь
              case 'MM' : return dict[1][get(MONTH)];           // Month   : Января
              case 'Y'  : return get(YEAR);                     // Year    : 2014
              case 'YY' : return lz(get(YEAR) % 100);           // Year    : 14
            } return part;
          });
        }
      }
      function addLocale(lang, locale){
        function split(index){
          var result = [];
          forEach.call(array(locale.months), function(it){
            result.push(it.replace(flexioRegExp, '$' + index));
          });
          return result;
        }
        locales[lang] = [array(locale.weekdays), split(1), split(2)];
        return core;
      }
      $define(PROTO + FORCED, DATE, {
        format:    createFormat('get'),
        formatUTC: createFormat('getUTC')
      });
      addLocale(current, {
        weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        months: 'January,February,March,April,May,June,July,August,September,October,November,December'
      });
      addLocale('ru', {
        weekdays: 'Воскресенье,Понедельник,Вторник,Среда,Четверг,Пятница,Суббота',
        months: 'Январ:я|ь,Феврал:я|ь,Март:а|,Апрел:я|ь,Ма:я|й,Июн:я|ь,' +
                'Июл:я|ь,Август:а|,Сентябр:я|ь,Октябр:я|ь,Ноябр:я|ь,Декабр:я|ь'
      });
      core.locale = function(locale){
        return has(locales, locale) ? current = locale : current;
      };
      core.addLocale = addLocale;
    }(/\b\w\w?\b/g, /:(.*)\|(.*)$/, {}, 'en', 'Seconds', 'Minutes', 'Hours', 'Month', 'FullYear');
    
    /******************************************************************************
     * Module : core.global                                                       *
     ******************************************************************************/
    
    $define(GLOBAL + FORCED, {global: global});
    
    /******************************************************************************
     * Module : js.array.statics                                                  *
     ******************************************************************************/
    
    // JavaScript 1.6 / Strawman array statics shim
    !function(arrayStatics){
      function setArrayStatics(keys, length){
        forEach.call(array(keys), function(key){
          if(key in ArrayProto)arrayStatics[key] = ctx(call, ArrayProto[key], length);
        });
      }
      setArrayStatics('pop,reverse,shift,keys,values,entries', 1);
      setArrayStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
      setArrayStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
                      'reduce,reduceRight,copyWithin,fill,turn');
      $define(STATIC, ARRAY, arrayStatics);
    }({});
    
    /******************************************************************************
     * Module : web.dom.itarable                                                  *
     ******************************************************************************/
    
    !function(NodeList){
      if(framework && NodeList && !(SYMBOL_ITERATOR in NodeList[PROTOTYPE])){
        hidden(NodeList[PROTOTYPE], SYMBOL_ITERATOR, Iterators[ARRAY]);
      }
      Iterators.NodeList = Iterators[ARRAY];
    }(global.NodeList);
    
    /******************************************************************************
     * Module : core.log                                                          *
     ******************************************************************************/
    
    !function(log, enabled){
      // Methods from https://github.com/DeveloperToolsWG/console-object/blob/master/api.md
      forEach.call(array('assert,clear,count,debug,dir,dirxml,error,exception,' +
          'group,groupCollapsed,groupEnd,info,isIndependentlyComposed,log,' +
          'markTimeline,profile,profileEnd,table,time,timeEnd,timeline,' +
          'timelineEnd,timeStamp,trace,warn'), function(key){
        log[key] = function(){
          if(enabled && key in console)return apply.call(console[key], console, arguments);
        };
      });
      $define(GLOBAL + FORCED, {log: assign(log.log, log, {
        enable: function(){
          enabled = true;
        },
        disable: function(){
          enabled = false;
        }
      })});
    }({}, true);
    }(typeof self != 'undefined' && self.Math === Math ? self : Function('return this')(), true);
  provide("core-js", module.exports);
}(global));

// pakmanager:util
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    var formatRegExp = /%[sdj%]/g;
    exports.format = function(f) {
      if (!isString(f)) {
        var objects = [];
        for (var i = 0; i < arguments.length; i++) {
          objects.push(inspect(arguments[i]));
        }
        return objects.join(' ');
      }
    
      var i = 1;
      var args = arguments;
      var len = args.length;
      var str = String(f).replace(formatRegExp, function(x) {
        if (x === '%%') return '%';
        if (i >= len) return x;
        switch (x) {
          case '%s': return String(args[i++]);
          case '%d': return Number(args[i++]);
          case '%j':
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return '[Circular]';
            }
          default:
            return x;
        }
      });
      for (var x = args[i]; i < len; x = args[++i]) {
        if (isNull(x) || !isObject(x)) {
          str += ' ' + x;
        } else {
          str += ' ' + inspect(x);
        }
      }
      return str;
    };
    
    
    // Mark that a method should not be used.
    // Returns a modified function which warns once by default.
    // If --no-deprecation is set, then it is a no-op.
    exports.deprecate = function(fn, msg) {
      // Allow for deprecating things in the process of starting up.
      if (isUndefined(global.process)) {
        return function() {
          return exports.deprecate(fn, msg).apply(this, arguments);
        };
      }
    
      if (process.noDeprecation === true) {
        return fn;
      }
    
      var warned = false;
      function deprecated() {
        if (!warned) {
          if (process.throwDeprecation) {
            throw new Error(msg);
          } else if (process.traceDeprecation) {
            console.trace(msg);
          } else {
            console.error(msg);
          }
          warned = true;
        }
        return fn.apply(this, arguments);
      }
    
      return deprecated;
    };
    
    
    var debugs = {};
    var debugEnviron;
    exports.debuglog = function(set) {
      if (isUndefined(debugEnviron))
        debugEnviron = process.env.NODE_DEBUG || '';
      set = set.toUpperCase();
      if (!debugs[set]) {
        if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
          var pid = process.pid;
          debugs[set] = function() {
            var msg = exports.format.apply(exports, arguments);
            console.error('%s %d: %s', set, pid, msg);
          };
        } else {
          debugs[set] = function() {};
        }
      }
      return debugs[set];
    };
    
    
    /**
     * Echos the value of a value. Trys to print the value out
     * in the best way possible given the different types.
     *
     * @param {Object} obj The object to print out.
     * @param {Object} opts Optional options object that alters the output.
     */
    /* legacy: obj, showHidden, depth, colors*/
    function inspect(obj, opts) {
      // default options
      var ctx = {
        seen: [],
        stylize: stylizeNoColor
      };
      // legacy...
      if (arguments.length >= 3) ctx.depth = arguments[2];
      if (arguments.length >= 4) ctx.colors = arguments[3];
      if (isBoolean(opts)) {
        // legacy...
        ctx.showHidden = opts;
      } else if (opts) {
        // got an "options" object
        exports._extend(ctx, opts);
      }
      // set default options
      if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
      if (isUndefined(ctx.depth)) ctx.depth = 2;
      if (isUndefined(ctx.colors)) ctx.colors = false;
      if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
      if (ctx.colors) ctx.stylize = stylizeWithColor;
      return formatValue(ctx, obj, ctx.depth);
    }
    exports.inspect = inspect;
    
    
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    inspect.colors = {
      'bold' : [1, 22],
      'italic' : [3, 23],
      'underline' : [4, 24],
      'inverse' : [7, 27],
      'white' : [37, 39],
      'grey' : [90, 39],
      'black' : [30, 39],
      'blue' : [34, 39],
      'cyan' : [36, 39],
      'green' : [32, 39],
      'magenta' : [35, 39],
      'red' : [31, 39],
      'yellow' : [33, 39]
    };
    
    // Don't use 'blue' not visible on cmd.exe
    inspect.styles = {
      'special': 'cyan',
      'number': 'yellow',
      'boolean': 'yellow',
      'undefined': 'grey',
      'null': 'bold',
      'string': 'green',
      'date': 'magenta',
      // "name": intentionally not styling
      'regexp': 'red'
    };
    
    
    function stylizeWithColor(str, styleType) {
      var style = inspect.styles[styleType];
    
      if (style) {
        return '\u001b[' + inspect.colors[style][0] + 'm' + str +
               '\u001b[' + inspect.colors[style][1] + 'm';
      } else {
        return str;
      }
    }
    
    
    function stylizeNoColor(str, styleType) {
      return str;
    }
    
    
    function arrayToHash(array) {
      var hash = {};
    
      array.forEach(function(val, idx) {
        hash[val] = true;
      });
    
      return hash;
    }
    
    
    function formatValue(ctx, value, recurseTimes) {
      // Provide a hook for user-specified inspect functions.
      // Check that value is an object with an inspect function on it
      if (ctx.customInspect &&
          value &&
          isFunction(value.inspect) &&
          // Filter out the util module, it's inspect function is special
          value.inspect !== exports.inspect &&
          // Also filter out any prototype objects using the circular check.
          !(value.constructor && value.constructor.prototype === value)) {
        var ret = value.inspect(recurseTimes, ctx);
        if (!isString(ret)) {
          ret = formatValue(ctx, ret, recurseTimes);
        }
        return ret;
      }
    
      // Primitive types cannot have properties
      var primitive = formatPrimitive(ctx, value);
      if (primitive) {
        return primitive;
      }
    
      // Look up the keys of the object.
      var keys = Object.keys(value);
      var visibleKeys = arrayToHash(keys);
    
      if (ctx.showHidden) {
        keys = Object.getOwnPropertyNames(value);
      }
    
      // IE doesn't make error fields non-enumerable
      // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
      if (isError(value)
          && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
        return formatError(value);
      }
    
      // Some type of object without properties can be shortcutted.
      if (keys.length === 0) {
        if (isFunction(value)) {
          var name = value.name ? ': ' + value.name : '';
          return ctx.stylize('[Function' + name + ']', 'special');
        }
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
        }
        if (isDate(value)) {
          return ctx.stylize(Date.prototype.toString.call(value), 'date');
        }
        if (isError(value)) {
          return formatError(value);
        }
      }
    
      var base = '', array = false, braces = ['{', '}'];
    
      // Make Array say that they are Array
      if (isArray(value)) {
        array = true;
        braces = ['[', ']'];
      }
    
      // Make functions say that they are functions
      if (isFunction(value)) {
        var n = value.name ? ': ' + value.name : '';
        base = ' [Function' + n + ']';
      }
    
      // Make RegExps say that they are RegExps
      if (isRegExp(value)) {
        base = ' ' + RegExp.prototype.toString.call(value);
      }
    
      // Make dates with properties first say the date
      if (isDate(value)) {
        base = ' ' + Date.prototype.toUTCString.call(value);
      }
    
      // Make error with message first say the error
      if (isError(value)) {
        base = ' ' + formatError(value);
      }
    
      if (keys.length === 0 && (!array || value.length == 0)) {
        return braces[0] + base + braces[1];
      }
    
      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
        } else {
          return ctx.stylize('[Object]', 'special');
        }
      }
    
      ctx.seen.push(value);
    
      var output;
      if (array) {
        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
      } else {
        output = keys.map(function(key) {
          return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
        });
      }
    
      ctx.seen.pop();
    
      return reduceToSingleString(output, base, braces);
    }
    
    
    function formatPrimitive(ctx, value) {
      if (isUndefined(value))
        return ctx.stylize('undefined', 'undefined');
      if (isString(value)) {
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return ctx.stylize(simple, 'string');
      }
      if (isNumber(value))
        return ctx.stylize('' + value, 'number');
      if (isBoolean(value))
        return ctx.stylize('' + value, 'boolean');
      // For some reason typeof null is "object", so special case here.
      if (isNull(value))
        return ctx.stylize('null', 'null');
    }
    
    
    function formatError(value) {
      return '[' + Error.prototype.toString.call(value) + ']';
    }
    
    
    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
      var output = [];
      for (var i = 0, l = value.length; i < l; ++i) {
        if (hasOwnProperty(value, String(i))) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
              String(i), true));
        } else {
          output.push('');
        }
      }
      keys.forEach(function(key) {
        if (!key.match(/^\d+$/)) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
              key, true));
        }
      });
      return output;
    }
    
    
    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
      var name, str, desc;
      desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
      if (desc.get) {
        if (desc.set) {
          str = ctx.stylize('[Getter/Setter]', 'special');
        } else {
          str = ctx.stylize('[Getter]', 'special');
        }
      } else {
        if (desc.set) {
          str = ctx.stylize('[Setter]', 'special');
        }
      }
      if (!hasOwnProperty(visibleKeys, key)) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (ctx.seen.indexOf(desc.value) < 0) {
          if (isNull(recurseTimes)) {
            str = formatValue(ctx, desc.value, null);
          } else {
            str = formatValue(ctx, desc.value, recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (array) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = ctx.stylize('[Circular]', 'special');
        }
      }
      if (isUndefined(name)) {
        if (array && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = ctx.stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = ctx.stylize(name, 'string');
        }
      }
    
      return name + ': ' + str;
    }
    
    
    function reduceToSingleString(output, base, braces) {
      var numLinesEst = 0;
      var length = output.reduce(function(prev, cur) {
        numLinesEst++;
        if (cur.indexOf('\n') >= 0) numLinesEst++;
        return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
      }, 0);
    
      if (length > 60) {
        return braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];
      }
    
      return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }
    
    
    // NOTE: These type checking functions intentionally don't use `instanceof`
    // because it is fragile and can be easily faked with `Object.create()`.
    function isArray(ar) {
      return Array.isArray(ar);
    }
    exports.isArray = isArray;
    
    function isBoolean(arg) {
      return typeof arg === 'boolean';
    }
    exports.isBoolean = isBoolean;
    
    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;
    
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    
    function isNumber(arg) {
      return typeof arg === 'number';
    }
    exports.isNumber = isNumber;
    
    function isString(arg) {
      return typeof arg === 'string';
    }
    exports.isString = isString;
    
    function isSymbol(arg) {
      return typeof arg === 'symbol';
    }
    exports.isSymbol = isSymbol;
    
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    
    function isRegExp(re) {
      return isObject(re) && objectToString(re) === '[object RegExp]';
    }
    exports.isRegExp = isRegExp;
    
    function isObject(arg) {
      return typeof arg === 'object' && arg !== null;
    }
    exports.isObject = isObject;
    
    function isDate(d) {
      return isObject(d) && objectToString(d) === '[object Date]';
    }
    exports.isDate = isDate;
    
    function isError(e) {
      return isObject(e) &&
          (objectToString(e) === '[object Error]' || e instanceof Error);
    }
    exports.isError = isError;
    
    function isFunction(arg) {
      return typeof arg === 'function';
    }
    exports.isFunction = isFunction;
    
    function isPrimitive(arg) {
      return arg === null ||
             typeof arg === 'boolean' ||
             typeof arg === 'number' ||
             typeof arg === 'string' ||
             typeof arg === 'symbol' ||  // ES6 symbol
             typeof arg === 'undefined';
    }
    exports.isPrimitive = isPrimitive;
    
    exports.isBuffer = require('./support/isBuffer');
    
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
    
    
    function pad(n) {
      return n < 10 ? '0' + n.toString(10) : n.toString(10);
    }
    
    
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                  'Oct', 'Nov', 'Dec'];
    
    // 26 Feb 16:19:34
    function timestamp() {
      var d = new Date();
      var time = [pad(d.getHours()),
                  pad(d.getMinutes()),
                  pad(d.getSeconds())].join(':');
      return [d.getDate(), months[d.getMonth()], time].join(' ');
    }
    
    
    // log is just a thin wrapper to console.log that prepends a timestamp
    exports.log = function() {
      console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
    };
    
    
    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * The Function.prototype.inherits from lang.js rewritten as a standalone
     * function (not on Function.prototype). NOTE: If this file is to be loaded
     * during bootstrapping this function needs to be rewritten using some native
     * functions as prototype setup using normal JavaScript does not work as
     * expected during bootstrapping (see mirror.js in r114903).
     *
     * @param {function} ctor Constructor function which needs to inherit the
     *     prototype.
     * @param {function} superCtor Constructor function to inherit prototype from.
     */
    exports.inherits = require('inherits');
    
    exports._extend = function(origin, add) {
      // Don't do anything if add isn't an object
      if (!add || !isObject(add)) return origin;
    
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    };
    
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    
  provide("util", module.exports);
}(global));

// pakmanager:querystring/decode
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    'use strict';
    
    // If obj.hasOwnProperty has been overridden, then calling
    // obj.hasOwnProperty(prop) will break.
    // See: https://github.com/joyent/node/issues/1707
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    
    module.exports = function(qs, sep, eq, options) {
      sep = sep || '&';
      eq = eq || '=';
      var obj = {};
    
      if (typeof qs !== 'string' || qs.length === 0) {
        return obj;
      }
    
      var regexp = /\+/g;
      qs = qs.split(sep);
    
      var maxKeys = 1000;
      if (options && typeof options.maxKeys === 'number') {
        maxKeys = options.maxKeys;
      }
    
      var len = qs.length;
      // maxKeys <= 0 means that we should not limit keys count
      if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
      }
    
      for (var i = 0; i < len; ++i) {
        var x = qs[i].replace(regexp, '%20'),
            idx = x.indexOf(eq),
            kstr, vstr, k, v;
    
        if (idx >= 0) {
          kstr = x.substr(0, idx);
          vstr = x.substr(idx + 1);
        } else {
          kstr = x;
          vstr = '';
        }
    
        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);
    
        if (!hasOwnProperty(obj, k)) {
          obj[k] = v;
        } else if (Array.isArray(obj[k])) {
          obj[k].push(v);
        } else {
          obj[k] = [obj[k], v];
        }
      }
    
      return obj;
    };
    
  provide("querystring/decode", module.exports);
}(global));

// pakmanager:querystring/encode
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    'use strict';
    
    var stringifyPrimitive = function(v) {
      switch (typeof v) {
        case 'string':
          return v;
    
        case 'boolean':
          return v ? 'true' : 'false';
    
        case 'number':
          return isFinite(v) ? v : '';
    
        default:
          return '';
      }
    };
    
    module.exports = function(obj, sep, eq, name) {
      sep = sep || '&';
      eq = eq || '=';
      if (obj === null) {
        obj = undefined;
      }
    
      if (typeof obj === 'object') {
        return Object.keys(obj).map(function(k) {
          var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
          if (Array.isArray(obj[k])) {
            return obj[k].map(function(v) {
              return ks + encodeURIComponent(stringifyPrimitive(v));
            }).join(sep);
          } else {
            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
          }
        }).join(sep);
    
      }
    
      if (!name) return '';
      return encodeURIComponent(stringifyPrimitive(name)) + eq +
             encodeURIComponent(stringifyPrimitive(obj));
    };
    
  provide("querystring/encode", module.exports);
}(global));

// pakmanager:querystring
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  'use strict';
    
    exports.decode = exports.parse =  require('querystring/decode');
    exports.encode = exports.stringify =  require('querystring/encode');
    
  provide("querystring", module.exports);
}(global));

// pakmanager:fs
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  console.log("I'm `fs` modules");
    
  provide("fs", module.exports);
}(global));

// pakmanager:docker-api-wrapper
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  'use strict';
    
    Object.defineProperty(exports, '__esModule', {
        value: true
    });
    
    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
    
    var _http = require('http');
    
    var _http2 = _interopRequireDefault(_http);
    
    var _util = require('util');
    
    var _util2 = _interopRequireDefault(_util);
    
    var _querystring = require('querystring');
    
    var _querystring2 = _interopRequireDefault(_querystring);
    
    var _async = require('async');
    
    var _async2 = _interopRequireDefault(_async);
    
    var _fs = require('fs');
    
    var _fs2 = _interopRequireDefault(_fs);
    
    var _superagent = require('superagent');
    
    var _superagent2 = _interopRequireDefault(_superagent);
    
    var _libContainer = require('./lib/Container');
    
    var _libContainer2 = _interopRequireDefault(_libContainer);
    
    var Container = _libContainer2['default'];
    
    exports.Container = Container;
    
    var DockerApi = (function () {
        function DockerApi(serverIp, port) {
            _classCallCheck(this, DockerApi);
    
            this.serverIp = serverIp;
            this.port = port;
        }
    
        _createClass(DockerApi, [{
            key: 'performRequest',
            value: function performRequest(endpoint, method, querydata, postdata, callback) {
                var querydataString = _querystring2['default'].stringify(querydata);
                var postdataString = JSON.stringify(postdata) || {};
                var headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': postdataString.length
                };
    
                if (querydataString != '') {
                    endpoint += '?' + querydataString;
                }
    
                var options = {
                    host: this.serverIp,
                    port: this.port,
                    path: endpoint,
                    method: method,
                    headers: headers
                };
    
                console.log(options);
                var req = _http2['default'].request(options, function (res) {
                    res.setEncoding('utf-8');
                    var responseString = '';
    
                    res.on('data', function (data) {
                        responseString += data;
                    });
                    res.on('end', function () {
                        if (callback != null) {
                            var resData = {
                                statusCode: res.statusCode,
                                data: responseString
                            };
                            callback(resData);
                        }
                    });
                });
                req.write(postdataString);
                req.end();
            }
        }, {
            key: 'queryRunningProcess',
            value: function queryRunningProcess(containerId, callback) {
                this.performRequest(_util2['default'].format('/containers/%s/stats', containerId), 'GET', null, null, callback);
            }
        }, {
            key: 'queryContainerChanges',
            value: function queryContainerChanges(containerId, callback) {
                this.performRequest(_util2['default'].format('/containers/%s/changes', containerId), 'GET', null, null, callback);
            }
        }, {
            key: 'queryInspectContainer',
            value: function queryInspectContainer(containerId, callback) {
                this.performRequest(_util2['default'].format('/containers/%s/json', containerId), 'GET', null, null, callback);
            }
        }, {
            key: 'stopContainer',
            value: function stopContainer(containerId, callback) {
                this.performRequest(_util2['default'].format('/containers/%s/stop', containerId), 'POST', null, null, callback);
            }
        }, {
            key: 'stopAllContainers',
            value: function stopAllContainers(callback) {
                var that = this;
                _async2['default'].series([function (cb) {
                    that.performRequest('/containers/json', 'GET', { all: 0 }, null, function (data) {
                        cb(null, data);
                    });
                }], function (err, results) {
                    if (err) throw err;
                    var containers = JSON.parse(results[0].data);
                    if (containers.length == 0) {
                        var resData = {
                            statusCode: 304,
                            data: 'containers already stopped'
                        };
                        callback(resData);
                    } else {
                        _async2['default'].each(containers, function (container, cb) {
                            that.stopContainer(container.Id, function (data) {
                                cb();
                            });
                        }, function (err) {
                            if (err) throw err;
                            var resData = {
                                statusCode: 200,
                                data: 'done'
                            };
                            callback(resData);
                        });
                    }
                });
            }
        }, {
            key: 'startContainer',
            value: function startContainer(containerId, callback) {
                var that = this;
                var inspectedContainers = [];
                _async2['default'].series([function (cb) {
                    that.performRequest('/containers/json', 'GET', { all: 1 }, null, function (data) {
                        cb(null, data);
                    });
                }], function (err, results) {
                    if (err) throw err;
                    var containers = JSON.parse(results[0].data);
                    _async2['default'].each(containers, function (container, cb) {
                        that.queryInspectContainer(container.Id, function (inspectedCont) {
                            inspectedContainers.push(JSON.parse(inspectedCont.data));
                            cb();
                        });
                    }, function (err) {
                        if (err) throw err;
                        that.beginStartContainer(containerId, inspectedContainers, that);
                        var resData = {
                            statusCode: 200,
                            data: 'done'
                        };
                        callback(resData);
                    });
                });
            }
        }, {
            key: 'beginStartContainer',
            value: function beginStartContainer(containerId, inspectedContainers, scope) {
                scope.performRequest(_util2['default'].format('/containers/%s/json', containerId), 'GET', null, null, function (container) {
                    var inspectInfo = JSON.parse(container.data);
                    if (inspectInfo.HostConfig.Links == null) {
                        console.log('Starting Id: ' + containerId);
                        scope.performRequest(_util2['default'].format('/containers/%s/start', containerId), 'POST', null, null, null);
                    } else {
                        inspectInfo.HostConfig.Links.forEach(function (link) {
                            for (var index = 0; index < inspectedContainers.length; index++) {
                                var inspectedCont = inspectedContainers[index];
                                if (inspectedCont.Name === link.split(':')[0]) {
                                    console.log('Starting Id: ' + inspectedCont.Id);
                                    scope.beginStartContainer(inspectedCont.Id, inspectedContainers, scope);
                                    break;
                                }
                            }
                        });
                        console.log('Starting Id: ' + containerId);
                        scope.performRequest(_util2['default'].format('/containers/%s/start', containerId), 'POST', null, null, null);
                    }
                });
            }
        }, {
            key: 'createContainer',
            value: function createContainer(createdRequest, callback) {
                console.log(JSON.stringify(createdRequest));
                this.performRequest('/containers/create', 'POST', null, createdRequest, callback);
            }
    
            //image api
        }, {
            key: 'getAllImages',
            value: function getAllImages(querydata, callback) {
                this.performRequest('/images/json', 'GET', querydata, null, callback);
            }
        }, {
            key: 'removeImage',
            value: function removeImage(imageId, callback) {
                this.performRequest(_util2['default'].format('/images/%s', imageId), 'DELETE', null, null, callback);
            }
        }, {
            key: 'createImage',
            value: function createImage(querydata, callback) {
                this.performRequest('/images/create', 'POST', querydata, null, callback);
            }
        }, {
            key: 'buildImage',
            value: function buildImage(filePath, callback) {
                var endpoint = '/build';
                var options = {
                    hostname: this.serverIp,
                    port: this.port,
                    path: endpoint,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/tar'
                    }
                };
                var req = _http2['default'].request(options, function (res) {
                    console.log('STATUS: ' + res.statusCode);
                    console.log('HEADERS: ' + JSON.stringify(res.headers));
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        console.log('BODY: ' + chunk);
                    });
                    res.on('end', function () {
                        callback();
                    });
                });
                _fs2['default'].createReadStream(filePath).pipe(req);
            }
        }, {
            key: 'searchImage',
            value: function searchImage(imageName, callback) {
                this.performRequest('/images/search', 'GET', { term: imageName }, null, callback);
            }
        }, {
            key: 'queryInspectImage',
            value: function queryInspectImage(imageName, callback) {
                this.performRequest(_util2['default'].format('/images/%s/json', imageName), 'GET', null, null, callback);
            }
    
            //misc api
        }, {
            key: 'getVersion',
            value: function getVersion(callback) {
                this.performRequest('/version', 'GET', null, null, callback);
            }
        }, {
            key: 'getSystemWideInfo',
            value: function getSystemWideInfo(callback) {
                this.performRequest('/info', 'GET', null, null, callback);
            }
        }]);
    
        return DockerApi;
    })();
    
    exports['default'] = DockerApi;
    
  provide("docker-api-wrapper", module.exports);
}(global));