fastDev.namespace("fastDev.Util");

/**
 * 符串类型数据处理工具类
 * @class fastDev.Util.StringUtil
 * @author 袁刚
 * @singleton
 */
fastDev.Util.StringUtil = {
    /**
     * 将str中的html符号转义
     * @param {String} str 需要转义的字符串
     * @return {String}
     */
    unhtml: function (str) {
        return str ? str.replace(/[&<">]/g, function (m) {
            return {
                '<': '&lt;',
                '&': '&amp',
                '"': '&quot;',
                '>': '&gt;'
            }[m];
        }) : '';
    },
    /**
     * 删除字符串首尾空格
     * @param {String} str 字符串
     * @return {String}
     */
    trim: function (str) {
        return str ? (str += "").trim ? str.trim() : str.replace(/(^\s*)|(\s*$)/g, "") : str;
        //return (str && str.replace) ? str.replace(/(^\s*)|(\s*$)/g, "") : str;
    },
    /**
     * 删除字符串左边空格
     * @param {String} str 字符串
     * @return {String}
     */
    ltrim: function (str) {
        return (str && str.replace) ? str.replace(/(^\s*)/g, '') : str;
    },
    /**
     * 删除字符串右边空格
     * @param {String} str 字符串
     * @return {String}
     */
    rtrim: function (str) {
        return (str && str.replace) ? str.replace(/(\s*$)/g, '') : str;
    },
    /**
     * 去除HTML标签
     * @param {String} str 待处理字符串
     * @return {String}
     */
    trimHtml: function (str) {
        return (str && str.replace) ? str.replace(/<(\S*?)[^>]*>.*?|< .*? \/>/g, "") : str;
    },
    /**
     * 获取含中文字符串长度
     * @param {String} str 字符串
     * @return {Number}
     */
    getChLength: function (str) {
        return (str && str.replace) ? str.replace(/[^\x00-\xff]/g, '..').length : 0;
    },
    /**
     * 将以"-"分隔的日期格式字符串转换为日期对象
     * @param {String} str 待处理字符串
     * @return {Date}
     */
    strParseDate: function (strdate) {
        return new Date(Date.parse(strdate.replace(/-/g, "/")));
    },
    /**
     * 将目标字符串中可能会影响正则表达式构造的字符串进行转义。
     * @param {string} source 待转换字符串
     * @return {string}
     * 给以下字符前加上“\”进行转义：.*+?^=!:${}()|[]/\
     */
    escapeReg: function (source) {
        return String(source).replace(new RegExp("([.*+?^=!:\\${}()|[\\]\/\\\\])", "g"), '\\$1');
    },
    /**
     * 对目标字符串进行html编码
     * @param {string} source 目标字符串
     * @return {string}
     * 编码字符有5个：&<>"'
     */
    encodeHTML: function (source) {
        return String(source).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },

    /**
     * 对目标字符串进行html解码
     * @param {string} source 目标字符串
     * @return {string}
     */
    decodeHTML: function (str) {
        str = String(str).replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, "&");
        //处理转义的中文和实体字符
        return str.replace(/&#([\d]+);/g, function (_0, _1) {
            return String.fromCharCode(parseInt(_1, 10));
        });
    },
    /**
     * 字符串第一个字符大写
     * @param {String} str 待转换字符串
     * @return {String}
     */
    capitalize: function (all, letter) {
        if (letter) {
            return (letter + "").toUpperCase();
        } else {
            return all.replace(/./, function (str) {
                return str.toUpperCase();
            });
        }
    },
    /**
     * 将一个带px、%、em的单位值转换为整型数值
     * em单位以当前文档的字体样式（font-size）属性值转换
     * 默认情况下，1em 等于 16px
     * @param {String|Number} val 需要截除单位的值
     * @param {Number|DomObject} [max] 百分比数值转换时的被乘数，或者DOMObject对象，以便在需要时才获取元素的尺寸值
     * @param {String} [fnName] 函数名
     * @return {Number}
     */
    stripUnits: function (val, max, fnName) {
        if ( !! val || val === 0) {
            if (typeof val === 'number') {
                return parseFloat(val);
            } else if (typeof val === "string") {
                var num = /^(-?\d+\.?\d+|-?\d)(px|%|em)?$/.exec(val.toLowerCase().replace(/(^\s*)|(\s*$)/g, ''));
                if ( !! num) {
                    if (num[2] === '%') {
                        return (max === 0 ? 0 : max ? max.alias === "DomObject" ? max[fnName]() : max : 100) * num[1] / 100;
                    } else if (num[2] === 'em') {
                        return num[1] * fastDev.Util.StringUtil.stripUnits(fastDev(document.body).css('font-size') || 16, 16);
                    }
                    return parseFloat(num[1]);
                }
            }
        }
        return NaN;
    },
    /**
     * 高亮关键字
     * @param {Element} node 元素节点，其子节点上的关键字会一并处理
     * @param {RegExp} regx 匹配用的正则表达式（若关键字中包含正则表达式的元字符时，需注意要将关键字中的正则表达式元字符作转义处理）
     * @param {String} [nodeName="em"] 用于包裹文本的节点名称
     * @param {String} [className="ui-highlight"] 需添加的高亮样式名
     * @param {Object} [css] 行内样式值，必须使用普通对象形式传参
     * @private
     */
    highlight: function (node, regx, nodeName, className, css) {
        if (node.nodeType === 3) {
            var match = node.data.match(regx);
            if (match) {
                // 默认使用em标签
                var highlight = document.createElement(nodeName || "em");
                // 默认高亮样式名ui-highlight
                highlight.className = className || "ui-highlight";
                // 添加行内样式
                if (fastDev.isPlainObject(css)) {
                    for (var name in css) {
                        if (css[name] !== undefined) {
                            fastDev.Dom.css(highlight, name, css[name]);
                        }
                    }
                }
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1;
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // 处理包含子元素的节点
        !/(script|style)/i.test(node.tagName) && // 排除脚本和样式节点
        !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // 排除已经高亮的节点
            for (var i = 0; i < node.childNodes.length; i++) {
                i += fastDev.Util.StringUtil.highlight(node.childNodes[i], regx, nodeName, className);
            }
        }
        return 0;
    }
};

/**
 * 数字类型数据处理工具类
 * @class fastDev.Util.NumberUtil
 * @author 袁刚
 * @singleton
 */
fastDev.Util.NumberUtil = {
    /**
     * 为目标数字添加逗号分隔
     * @param {number} source 需要处理的数字
     * @param {number} length (Optional) 两次逗号之间的数字位数，默认为3位
     * @return {string}
     */
    comma: function (source, length) {
        if (!length || length < 1) {
            length = 3;
        }

        source = String(source).split(".");
        source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{' + length + '})+$)', 'ig'), "$1,");
        return source.join(".");
    },

    /**
     * 对目标数字进行0补齐处理
     * @param {number} source 需要处理的数字
     * @param {number} length 需要输出的长度
     * @return {string}
     */
    pad: function (source, length) {
        var pre = "",
            negative = (source < 0),
            string = String(Math.abs(source));

        if (string.length < length) {
            pre = (new Array(length - string.length + 1)).join('0');
        }

        return (negative ? "-" : "") + pre + string;
    },
    /**
     * 生成随机整数
     * @param {Number} min 随机整数的最小值
     * @param {Number} max 随机整数的最大值
     * @return {Number}
     */
    randomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    /**
     * 数字格式化
     * @param {Number} value 待格式化数字
     * @param {String} format 目标格式(0,0.00)
     * @return {String}
     */
    format: function (value, format) {
        if (!fastDev.isString(format)) {
            return value;
        }

        if (!/^\d+\.?\d+$/.test(value)) {
            return value;
        }

        value = parseFloat(value);

        var hasComma = -1 < format.indexOf(','),
            psplit = format.split('.');

        if (psplit.length > 1) {
            value = value.toFixed(psplit[1].length);
        } else {
            value = value.toFixed(0);
        }

        var fnum = value.toString();

        if (hasComma) {
            psplit = fnum.split('.');

            var cnum = psplit[0],
                parr = [],
                j = cnum.length,
                m = Math.floor(j / 3),
                n = cnum.length % 3 || 3;

            for (var i = 0; i < j; i += n) {
                if (i !== 0) {
                    n = 3;
                }
                parr[parr.length] = cnum.substr(i, n);
                m -= 1;
            }

            fnum = parr.join(',');

            if (psplit[1]) {
                fnum += '.' + psplit[1];
            }
        }

        return fnum;
    }
};

/**
 * 日期对象处理工具类
 * @class fastDev.Util.DateUtil
 * @author 袁刚
 * @singleton
 */

fastDev.Util.DateUtil = {
    /**
     * 对目标日期对象进行格式化
     * @param {Date} date 日期对象
     * @param {string} pattern 日期格式化规则
     * @return {String}
     * <p>格式表达式，变量含义:</p>
     * <p>-yyyy: 带 0 补齐的四位年表示</p>
     * <p>-yy: 带 0 补齐的两位年表示</p>
     * <p>-MM: 带 0 补齐的两位月表示</p>
     * <p>-M: 不带 0 补齐的月表示</p>
     * <p>-dd: 带 0 补齐的两位日表示</p>
     * <p>-d: 不带 0 补齐的日表示</p>
     * <p>-hh: 带 0 补齐的两位 12 进制时表示</p>
     * <p>-h: 不带 0 补齐的 12 进制时表示</p>
     * <p>-HH: 带 0 补齐的两位 24 进制时表示</p>
     * <p>-H: 不带 0 补齐的 24 进制时表示</p>
     * <p>-mm: 带 0 补齐两位分表示</p>
     * <p>-m: 不带 0 补齐分表示</p>
     * <p>-ss: 带 0 补齐两位秒表示</p>
     * <p>-s: 不带 0 补齐秒表示</p>
     * <p>-ms: 毫秒</p>
     */
    format: function (date, pattern) {
        if (!fastDev.isString(pattern)) {
            return date.toString();
        }

        if (fastDev.isString(date)) {
            var m;
            if (m = /(\d+)[^\d](\d+)[^\d](\d+)(?:\s(\d+)[^\d](\d+)[^\d](\d+)|)(?:\.(\d+)|)/.exec(date)) {
                date = new Date(m[1], +m[2] - 1, m[3], m[4] || 0, m[5] || 0, m[6] || 0, m[7] || 0);
            }
        }
        if (!fastDev.isDate(date)) {
            return "";
        }

        function replacer(patternPart, result) {
            pattern = pattern.replace(patternPart, result);
        }

        var pad = fastDev.Util.NumberUtil.pad,
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            date2 = date.getDate(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds(),
            milliSeconds = date.getMilliseconds();

        replacer(/yyyy/g, pad(year, 4));
        replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
        replacer(/MM/g, pad(month, 2));
        replacer(/M/g, month);
        replacer(/dd/g, pad(date2, 2));
        replacer(/d/g, date2);

        replacer(/HH/g, pad(hours, 2));
        replacer(/H/g, hours);
        replacer(/hh/g, pad(hours % 12, 2));
        replacer(/h/g, hours % 12);
        replacer(/ms/g, milliSeconds);
        replacer(/mm/g, pad(minutes, 2));
        replacer(/m/g, minutes);
        replacer(/ss/g, pad(seconds, 2));
        replacer(/s/g, seconds);

        return pattern;

    },
    /**
     * 将目标字符串转换成日期对象
     * @param {string} source 目标字符串
     * @return {Date} 转换后的日期对象
     * <p>可转换日期格式:</p>
     * <p>-2010/5/10</p>
     * <p>-July,2010,3,23:</p>
     * <p>-Tuesday November 9 1996 7:30 PM</p>
     * <p>-2010-01-01 12:23:39</p>
     */
    parse: function (source) {
        var reg = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+\\$");
        if ('string' === typeof source) {
            if (reg.test(source) || isNaN(Date.parse(source))) {
                var d = source.split(/ |T/),
                    d1 = d.length > 1 ? d[1].split(/[^\d]/) : [0, 0, 0],
                    d0 = d[0].split(/[^\d]/);
                return new Date(d0[0] - 0, d0[1] - 1, d0[2] - 0, d1[0] - 0, d1[1] - 0, d1[2] - 0);
            } else {
                return new Date(source);
            }
        }

        return new Date();
    }
};

/**
 * URL格式数据处理工具类
 * @class fastDev.Util.UrlUtil
 * @author 袁刚
 * @singleton
 */
fastDev.Util.UrlUtil = {
    /**
     * 根据参数名从目标URL中获取参数值
     * @param {string} url url地址
     * @param {string} key 要获取的参数名
     * @return {String|null}
     */
    getQueryValue: function (url, key) {
        var reg = new RegExp("(^|&|\\?|#)" + fastDev.Util.StringUtil.escapeReg(key) + "=([^&#]*)(&|\\$|#)", "");
        var match = url.match(reg);
        if (match) {
            return match[2];
        }
        return null;
    },
    /**
     * 将json对象解析成地址栏参数格式字符串,特殊字符将被被编码
     * @param {Object} json 需要解析的json对象
     * @param {Function} replacer_opt (Optional) 对值进行特殊处理的函数(默认采用{@link #escapeSymbol}进行处理)
     * @return {string} - 解析结果字符串，其中值将被URI编码，{a:'&1 '} ==> "a=%261%20"。
     */
    jsonToQuery: function (json, encode) {
        var result = [],
            itemLen;
        fastDev.each(json, function (key, item) {
            result.push(key + '=' + fastDev.Util.JsonUtil.parseString(item, encode));
        });

        return result.join('&');
    },
    /**
     * 解析目标URL中的参数成json对象
     * @param {string} url 地址字符串
     * @return {JsonObject}
     */
    queryToJson: function (url) {
        var query = url.substr(url.lastIndexOf('?') + 1),
            params = query.split('&'),
            len = params.length,
            result = {}, i = 0,
            key, value, item, param;

        for (; i < len; i++) {
            if (!params[i]) {
                continue;
            }
            param = params[i].split('=');
            key = param[0];
            value = param[1];

            item = result[key];
            if ('undefined' === typeof item) {
                result[key] = value;
            } else if (fastDev.ArrayUtil.isArray(item)) {
                item.push(value);
            } else { // 这里只可能是string了
                result[key] = [item, value];
            }
        }

        return result;
    },
    /**
     * 对字符串进行%#&+=以及和\s匹配的所有字符进行url转义
     * @param {string} source 需要转义的字符串.
     * @return {string}
     */
    escapeSymbol: function (source) {

        return String(source).replace(/[#%&+=\/\\\ \　\f\r\n\t]/g, function (all) {
            return '%' + (0x100 + all.charCodeAt()).toString(16).substring(1).toUpperCase();
        });
    }
};

/**
 * json工具类
 * @class fastDev.Util.JsonUtil
 * @author 袁刚
 * @singleton
 */
fastDev.Util.JsonUtil = {
    /**
     * 将Json格式字符串转换为Json对象
     * @param {String} str Json格式字符串
     * @return {JsonObject}
     */
    parseJson: function (str, jsonStr) {
        if (!str) {
            return null;
        }
        if (typeof str === "string") {
            jsonStr = fastDev.Util.StringUtil.trim(str.replace(/(^\r*\n*\t*\s*)|(\r*\n*\t*\s*$)/g, ""));
        } else {
            return str;
        }
        try {
            if (window.JSON && window.JSON.parse) {
                return window.JSON.parse(jsonStr);
            }
        } catch (e) {}

        if (/^\[[\w\W]+\]$|^\{[\w\W]*\}$/.test(jsonStr)) {
            return fastDev.Util.ObjectUtil.parseObject("return (" + jsonStr + ")")();

            //return (new Function("return " + str))();
        } else {
            return str;
            //throw "数据格式错误[" + str + "]";
        }
    },
    /**
     * 将JsonObject对象转换为Json格式字符串
     * @param {JsonObject} object Json对象
     * @param {Boolean} encode 是否转换时做编码
     * @return {String}
     */
    parseString: function (obj, encode, json) {
        if (fastDev.isString(obj)) {
            obj = encode ? encodeURIComponent(obj) : obj;
            if (json) {
                obj = "\"" + obj + "\"";
            }
            return obj;
        }

        if (window.JSON) {
            try {
                if (encode) {
                    return JSON.stringify(obj, function (k, v) {
                        if (fastDev.isString(v)) {
                            return encodeURIComponent(v);
                        }
                        return v;
                    });
                }
                return JSON.stringify(obj);
            } catch (e) {}
        }

        var data = [];
        if (fastDev.isArray(obj)) {
            for (var i = 0, dataItem; dataItem = obj[i]; i++) {
                data.push(this.parseString(dataItem, encode, true));
            }
            return "[" + data.join(",") + "]";
        }

        if (fastDev.isPlainObject(obj)) {
            for (var p in obj) {
                data.push('"' + p + '":' + this.parseString(obj[p], encode, true));
            }
            return "{" + data.join(",") + "}";
        }

        return obj + "";
    }
};

/**
 * 对象处理工具类
 * @class fastDev.Util.ObjectUtil
 * @author 袁刚
 * @singleton
 */
fastDev.Util.ObjectUtil = {
    /**
     * 将字符串转换为对象
     * @return {Object}
     */
    parseObject: function () {
        return Function.apply(window, arguments);
    }
};

/**
 * 定位工具类
 * @class fastDev.Util.position
 * @author 程伟
 * @singleton
 */
fastDev.Util.position = {
    /**
     * 当前页面可通过fastDev访问的顶层页面window对象
     * @type {Window}
     */
    top: (function () {
        var top = window,
            test = function (name) {
                try {
                    return window[name].fastDev && !window[name].document.getElementsByTagName("frameset").length;
                } catch (e) {
                    return false;
                }
            };
        return test("top") ? window.top : test("parent") ? window.parent : top;
    })(),
    /**
     * 将目标元素定位至参照元素在当前可视区域的附近
     * <p>支持跨级定位
     * @param {DomObject} target 目标元素（必须是DomObject对象）
     * @param {DomObject} reference 参照元素（必须是DomObject对象）
     * @param {Window} [context=window] 定位所处的窗口对象 ，默认为当前窗口对象
     * @param {Number} [margin=0] 目标元素与参照元素之间的额外边距值（为0时目标元素将紧贴着参照元素定位展现）
     * @param {Boolean} [allowAdjustHeight=true] 是否允许调节目标元素的高度
     * @param {String} [direction="auto"] 设置自定义弹出方向，为以下枚举值：auto（自动）、up（始终向上弹）、down（始终向下弹）
     * @return {DomObject} target 目标元素
     */
    locate: function (target, reference, context, margin, allowAdjustHeight, direction) {
        if (!target || !reference || target.alias !== "DomObject" || reference.alias !== "DomObject" || !target.elems[0] || !reference.elems[0]) {
            return target;
        }
        margin = parseInt(margin, 10) || 0;
        allowAdjustHeight = (allowAdjustHeight === false || /up|down/.test(direction)) ? false : true;
        context = fastDev.isWindow(context) ? context : window;
        var ref = reference.elems[0], path;
        if (context !== window && !(path = ref.locateReferencePath)) {
            var id = "@ref" + fastDev.getID(),
                selector = ref.tagName.toLowerCase() + "[locateReferenceId='" + id + "']";
            reference.attr("locateReferenceId", id);
            path = ref.locateReferencePath = !context.fastDev ? [] : fastDev.Util.position.getIframePath(function (fastDev) {
                return fastDev(selector).hasElem();
            }, context);
        }
        var rect = fastDev.Util.position.getBoundingRect(reference, path),
            top = rect.top + reference.outerHeight(true) + margin,
            height = target.outerHeight(true),
            fast = context.fastDev,
            win = fast(context),
            doc = fast(context.document),
            winHeight = win.height(),
            winWidth = win.width(),
            docLeft = doc.scrollLeft(),
            docTop = doc.scrollTop(),
            upper = rect.top - docTop - margin,
            lower = docTop + winHeight - top,
            decrease = upper < height && lower < height,
            upTop = rect.top - height - margin,
            offset = {
                left: Math.max(docLeft, Math.min(rect.left, winWidth - target.outerWidth(true) + docLeft)),
                top: direction === "up" ? upTop : direction === "down" ? top : (lower > height || (decrease && !allowAdjustHeight)) ? top : upper > lower ? upTop : top
            }, targetHeight;
        if (decrease && allowAdjustHeight) {
            targetHeight = target.height();
            offset.height = Math.max(Math.max(targetHeight - height + (upper > lower ? upper : lower) - 2, Math.min(20, targetHeight)), 0);
            offset.top += upper > lower ? targetHeight - offset.height : 0;
        }
        return target.css(offset);
    },
    /**
     * 获取目标元素相对于浏览器窗口的绝对坐标以及目标元素的（内容）宽高信息
     * <p>若目标元素未处于当前可视区域内，则计算可能会出现偏差
     * @param {DomObject} target 目标元素，必须为DomObject对象
     * @param {Array} path 目标元素的路径信息，可以通过fastDev.Util.position.getIframePath函数来获取
     * @return {Object} 目标元素相对于浏览器窗口的绝对left、top、width、height信息
     */
    getBoundingRect: function (target, path) {
        for (var nodes = (path = path || []).slice(0), parent = (nodes[0] || "").parent, doc = parent ? parent.fastDev(parent.document) : fastDev(), offset = {
            left: 0,
            top: 0
        }, topDoc = doc, node, elem, position; node = nodes.shift(); doc = node.document) {
            position = (elem = node.iframe).offset();
            offset.left += (position.left - doc.scrollLeft() + (parseInt(elem.css("marginLeft"), 10) || 0) + (parseInt(elem.css("borderLeftWidth"), 10) || 0) + (parseInt(elem.css("paddingLeft"), 10) || 0));
            offset.top += (position.top - doc.scrollTop() + (parseInt(elem.css("marginTop"), 10) || 0) + (parseInt(elem.css("borderTopWidth"), 10) || 0) + (parseInt(elem.css("paddingTop"), 10) || 0));
        }
        position = (target || fastDev()).offset();
        position.left -= path.length ? (doc = fastDev(target.elems[0].ownerDocument)).scrollLeft() : 0;
        position.top -= path.length ? doc.scrollTop() : 0;
        return {
            left: offset.left + position.left + topDoc.scrollLeft(),
            top: offset.top + position.top + topDoc.scrollTop(),
            width: target.width(),
            height: target.height()
        };
    },
    /**
     * 从指定窗口或有权访问的顶层窗口开始，获取目标Iframe的路径信息
     * <p>用于匹配目标Iframe的回调函数，返回true值则表示匹配成功，不返回或者返回非true值，则表示匹配失败
     * <p>若查找路径上用于匹配的Iframe跨域或者未引入fastDev库，则该Iframe直接被判定为非路径节点，即所有结果路径上的Iframe必须引入fastDev库且非跨域，查找结果才是有效的
     * @param {Function} callback 用于判定当前Iframe是否是要找的iframe，该函数内的作用域为当前Iframe内部子页面的window对象
     * @param {fastDev} callback.fast 当前待判定Iframe内部子页面的fastDev对象
     * @param {DomObject} callback.iframe 当前待判定Iframe的DomObject对象
     * @param {Window} [context=top] 用于查找的起始窗口对象，未指定时则默认从有权访问的最顶层窗口开始查找
     * @return {Array[Object]} 目标Iframe从指定窗口或顶层窗口起的路径信息，每一路径子节点（数组元素）包含以下属性
     * <p>-iframe : 当前iframe节点的DomObject对象</p>
     * <p>-parent : 当前iframe的父页面窗口对象
     * <p>-window : 当前iframe内部子页面的window的DomObject对象</p>
     * <p>-document : 当前iframe内部子页面的document的DomObject对象</p>
     */
    getIframePath: function (callback, context) {
        if (typeof callback !== "function") {
            throw "回调函数未指定";
        }
        var top = fastDev.isWindow(context) ? context : fastDev.Util.position.top,
            nodes = arguments[2] || [],
            flag = arguments[3] || [];
        if (flag[0] = callback.call(top, top.fastDev) === true) {
            return nodes;
        }
        var elems = top.fastDev("iframe").elems,
            iframe;
        while (!flag[0] && (iframe = elems.shift())) {
            try {
                context = iframe.contentWindow;
                nodes.push({
                    "parent": top,
                    "iframe": top.fastDev(iframe),
                    "window": context.fastDev(context),
                    "document": context.fastDev(context.document)
                });
                if (flag[0] = callback.call(context, context.fastDev, top.fastDev(iframe)) === true) {
                    break;
                }
                fastDev.Util.position.getIframePath.call(null, callback, context, nodes, flag);
                if (!flag[0]) {
                    nodes.pop();
                }
            } catch (e) {
                // iframe跨域或者未加载fastDev库
            }
        }
        return nodes;
    }
};