// 农历日期功能扩展
fastDev.apply(fastDev.Ui.DatePicker, {
    /*
     * 显示农历提示标签
     * @param {Array} name 日期项名
     * @return {String} tips
     * @private
     */
    showLunarTips: function (name) {
        var global = this._global,
            month = name[2] === "prev" ? global.month - 1 : name[2] === "next" ? global.month + 1 : global.month,
            year = month < 0 ? global.year - 1 : month > 11 ? global.year + 1 : global.year,
            date = new Date(year, month = month < 0 ? 11 : month > 11 ? 0 : month, name[0]);
        return this.getLunarTips(date);
    },
    /*
     * 获取农历提示信息
     * @param {Date} date 阳历日期
     * @return {String}
     * @private
     */
    getLunarTips: function (date) {
        if (date.getTime() < new Date(1900, 0, 31).getTime()) {
            return "";
        }
        var lunarDate = this.getLunarDate(date),
            solarTerm, festival, tips = [];
        if (lunarDate.isLeap) {
            tips.push("闰");
        }
        tips.push(this.localeMonth[lunarDate.month - 1] + "月");
        tips.push(this.getLocaleDate(lunarDate.date));
        tips.push(" " + lunarDate.zodiac + "年");
        // 二十四节气
        solarTerm = this.getSolarTerm(date);
        if ( !! solarTerm) {
            tips.push(" " + solarTerm);
        }
        // 佳节
        festival = this.getFestival(lunarDate, date);
        if ( !! festival) {
            tips.push(" " + festival);
        }
        return tips.join("");
    },
    /*
     * 获取月历（即阴历）日期
     * @param {Date} date 阳历日期
     * @return {Object}
     * @private
     */
    getLunarDate: function (date) {
        var year, month, day, leap, isLeap, days,
        // 根据世界时，取得阳历日期与1900年1月1日0点0时0分所相差的天数
        offset = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
        for (year = 1900; year < 2100 && offset > 0; year += 1) {
            days = this.getDaysOfLunarYear(year);
            offset -= days;
        }
        if (offset < 0) {
            offset += days;
            year -= 1;
        }
        leap = this.getLeapMonthOfYear(year);
        isLeap = false;
        for (month = 1; month < 13 && offset > 0; month += 1) {
            if (leap > 0 && month === leap + 1 && isLeap === false) {
                month -= 1;
                isLeap = true;
                days = this.getLeapDaysOfYear(year);
            } else {
                days = this.getDaysOfLunarMonth(year, month);
            }
            if (isLeap === true && month === leap + 1) {
                isLeap = false;
            }
            offset -= days;
        }
        if (offset === 0 && leap > 0 && month === leap + 1) {
            if (isLeap) {
                isLeap = false;
            } else {
                isLeap = true;
                month += 1;
            }
        }
        if (offset < 0) {
            offset += days;
            month -= 1;
        }
        day = offset + 1;
        return {
            year: year,
            month: month,
            date: day,
            isLeap: isLeap,
            zodiac: this.zodiac[(year - 4) % 12]
        };
    },
    /*
     * 获取阴历在给定年的总天数
     * @param {Number} year 农历年份
     * @return {Number}
     * @private
     */
    getDaysOfLunarYear: function (year) {
        var table = this.lunarTable,
            sum = 348;
        for (var i = 0x8000; i > 0x8; i >>= 1) {
            sum += (table[year - 1900] & i) ? 1 : 0;
        }
        return sum + this.getLeapDaysOfYear(year);
    },
    /*
     * 获取农历某年某月份的总天数
     * @param {Number} year 农历年份
     * @param {Number} month 农历月份
     * @return {Number}
     * @private
     */
    getDaysOfLunarMonth: function (year, month) {
        return (this.lunarTable[year - 1900] & (0x10000 >> month)) ? 30 : 29;
    },
    /*
     * 获取当前年闰月的总天数
     * @param {Number} year 农历年份
     * @return {Number}
     * @private
     */
    getLeapDaysOfYear: function (year) {
        return this.getLeapMonthOfYear(year) ? (this.lunarTable[year - 1899] & 0xf) === 0xf ? 30 : 29 : 0;
    },
    /*
     * 获取当前年闰月所在月份
     * @param {Number} year 农历年份
     * @return {Number} 0-12，0表示无闰月
     * @private
     */
    getLeapMonthOfYear: function (year) {
        var leapMonth = this.lunarTable[year - 1900] & 0xf;
        return leapMonth === 0xf ? 0 : leapMonth;
    },
    /*
     * 获取当前年指定序号的节气所在的阳历日子
     * 节气序号从0开始，依次为"小寒"、"大寒"、...
     * @param {Number} year 阳历年份
     * @param {Number} num 节气序号
     * @return {Number}
     * @private
     */
    getDayWithSolarTerm: function (year, num) {
        return (this.solarTermBase[num] + Math.floor(this.solarTermOS.charAt((Math.floor(this.solarTermIdx.charCodeAt(year - 1900)) - 48) * 24 + num)));
    },
    /*
     * 获取当天所拥有的二十四节气值
     * @param {Date} date 当前阳历日期
     * @return {String} 当前日期无节气则返回空字符串
     * @private
     */
    getSolarTerm: function (date) {
        var year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate(),
            num = date.getMonth() * 2;
        if (this.getDayWithSolarTerm(year, num) === day || this.getDayWithSolarTerm(year, ++num) === day) {
            return this.solarTerm[num];
        }
        return "";
    },
    /*
     * 获取节日信息
     * @param {Date} solar 当前阳历日期
     * @param {Object} lunar 当前农历日期
     * @return {String} 当前日期无佳节，则返回空字符串
     * @private
     */
    getFestival: function (lunar, solar) {
        var small = this.getDaysOfLunarMonth(lunar.year, lunar.month) === 29,
            month = solar.getMonth() + 1,
            date = solar.getDate(),
            res = "",
            festi, day, i;
        if (!lunar.isLeap) {
            for (i in this.lunarFestival) {
                festi = this.lunarFestival[i].split(" ");
                if (parseInt(festi[0], 10) === lunar.month) {
                    if (((day = parseInt(festi[1], 10)) === lunar.date)) {
                        res = festi[2];
                        break;
                    }
                    if (small && lunar.month === 12 && lunar.date === 29 && day === 30) {
                        res = festi[2];
                        break;
                    }
                }
            }
        }
        for (i in this.solarFestival) {
            festi = this.solarFestival[i].split(" ");
            if (parseInt(festi[0], 10) === month && parseInt(festi[1], 10) === date) {
                res = res ? res + " " + festi[2] : festi[2];
                break;
            }
        }
        return res;
    },
    /*
     * 获取本地化日期（中文）
     * @param {Number} day 日子
     * @return {String}
     * @private
     */
    getLocaleDate: function (day) {
        switch (day) {
            case 10:
                return '初十';
            case 20:
                return '二十';
            case 30:
                return '三十';
            default:
                return ['初', '十', '廿', '卅'][Math.floor(day / 10)] + ["日", '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][day % 10];
        }
    },
    // 使用的是查表方式，每一个数组元素即保存了一个年份的农历信息（转换成二进制，每位一个信息点）
    lunarTable: [0x4bd8, 0x4ae0, 0xa570, 0x54d5, 0xd260, 0xd950, 0x5554, 0x56af, 0x9ad0, 0x55d2, 0x4ae0, 0xa5b6, 0xa4d0, 0xd250, 0xd295, 0xb54f, 0xd6a0, 0xada2, 0x95b0, 0x4977, 0x497f, 0xa4b0, 0xb4b5, 0x6a50, 0x6d40, 0xab54, 0x2b6f, 0x9570, 0x52f2, 0x4970, 0x6566, 0xd4a0, 0xea50, 0x6a95, 0x5adf, 0x2b60, 0x86e3, 0x92ef, 0xc8d7, 0xc95f, 0xd4a0, 0xd8a6, 0xb55f, 0x56a0, 0xa5b4, 0x25df, 0x92d0, 0xd2b2, 0xa950, 0xb557, 0x6ca0, 0xb550, 0x5355, 0x4daf, 0xa5b0, 0x4573, 0x52bf, 0xa9a8, 0xe950, 0x6aa0, 0xaea6, 0xab50, 0x4b60, 0xaae4, 0xa570, 0x5260, 0xf263, 0xd950, 0x5b57, 0x56a0, 0x96d0, 0x4dd5, 0x4ad0, 0xa4d0, 0xd4d4, 0xd250, 0xd558, 0xb540, 0xb6a0, 0x95a6, 0x95bf, 0x49b0, 0xa974, 0xa4b0, 0xb27a, 0x6a50, 0x6d40, 0xaf46, 0xab60, 0x9570, 0x4af5, 0x4970, 0x64b0, 0x74a3, 0xea50, 0x6b58, 0x5ac0, 0xab60, 0x96d5, 0x92e0, 0xc960, 0xd954, 0xd4a0, 0xda50, 0x7552, 0x56a0, 0xabb7, 0x25d0, 0x92d0, 0xcab5, 0xa950, 0xb4a0, 0xbaa4, 0xad50, 0x55d9, 0x4ba0, 0xa5b0, 0x5176, 0x52bf, 0xa930, 0x7954, 0x6aa0, 0xad50, 0x5b52, 0x4b60, 0xa6e6, 0xa4e0, 0xd260, 0xea65, 0xd530, 0x5aa0, 0x76a3, 0x96d0, 0x4afb, 0x4ad0, 0xa4d0, 0xd0b6, 0xd25f, 0xd520, 0xdd45, 0xb5a0, 0x56d0, 0x55b2, 0x49b0, 0xa577, 0xa4b0, 0xaa50, 0xb255, 0x6d2f, 0xada0, 0x4b63, 0x937f, 0x49f8, 0x4970, 0x64b0, 0x68a6, 0xea5f, 0x6b20, 0xa6c4, 0xaaef, 0x92e0, 0xd2e3, 0xc960, 0xd557, 0xd4a0, 0xda50, 0x5d55, 0x56a0, 0xa6d0, 0x55d4, 0x52d0, 0xa9b8, 0xa950, 0xb4a0, 0xb6a6, 0xad50, 0x55a0, 0xaba4, 0xa5b0, 0x52b0, 0xb273, 0x6930, 0x7337, 0x6aa0, 0xad50, 0x4b55, 0x4b6f, 0xa570, 0x54e4, 0xd260, 0xe968, 0xd520, 0xdaa0, 0x6aa6, 0x56df, 0x4ae0, 0xa9d4, 0xa4d0, 0xd150, 0xf252, 0xd520],
    // 十二生肖
    zodiac: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"],
    localeMonth: ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"],
    // 二十四节气
    solarTerm: ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"],
    solarTermBase: [4, 19, 3, 18, 4, 19, 4, 19, 4, 20, 4, 20, 6, 22, 6, 22, 6, 22, 7, 22, 6, 21, 6, 21],
    solarTermIdx: "0123415341536789:;<9:=<>:=1>?012@015@015@015AB78CDE8CD=1FD01GH01GH01IH01IJ0KLMN;LMBEOPDQRST0RUH0RVH0RWH0RWM0XYMNZ[MB\\]PT^_ST`_WH`_WH`_WM`_WM`aYMbc[Mde]Sfe]gfh_gih_Wih_WjhaWjka[jkl[jmn]ope]qph_qrh_sth_W",
    solarTermOS: "211122112122112121222211221122122222212222222221222122222232222222222222222233223232223232222222322222112122112121222211222122222222222222222222322222112122112121222111211122122222212221222221221122122222222222222222222223222232222232222222222222112122112121122111211122122122212221222221221122122222222222222221211122112122212221222211222122222232222232222222222222112122112121111111222222112121112121111111222222111121112121111111211122112122112121122111222212111121111121111111111122112122112121122111211122112122212221222221222211111121111121111111222111111121111111111111111122112121112121111111222111111111111111111111111122111121112121111111221122122222212221222221222111011111111111111111111122111121111121111111211122112122112121122211221111011111101111111111111112111121111121111111211122112122112221222211221111011111101111111110111111111121111111111111111122112121112121122111111011111121111111111111111011111111112111111111111011111111111111111111221111011111101110111110111011011111111111111111221111011011101110111110111011011111101111111111211111001011101110111110110011011111101111111111211111001011001010111110110011011111101111111110211111001011001010111100110011011011101110111110211111001011001010011100110011001011101110111110211111001010001010011000100011001011001010111110111111001010001010011000111111111111111111111111100011001011001010111100111111001010001010000000111111000010000010000000100011001011001010011100110011001011001110111110100011001010001010011000110011001011001010111110111100000010000000000000000011001010001010011000111100000000000000000000000011001010001010000000111000000000000000000000000011001010000010000000",
    // 传统佳节
    lunarFestival: ["01 01 春节", "01 15 元宵节", "05 05 端午节", "07 07 七夕", "07 15 中元节", "08 15 中秋节", "09 09 重阳节", "12 08 腊八节", "12 23 小年", "12 30 除夕"],
    // 公历节日
    solarFestival: ["01 01 元旦", "02 14 情人节", "03 08 妇女节", "03 12 植树节", "03 15 消费者权益日", "04 01 愚人节", "05 01 劳动节", "05 04 青年节", "06 01 儿童节", "08 01 建军节", "09 10 教师节", "10 01 国庆节", "12 24 平安夜", "12 25 圣诞节"]
});