/**
 * 	var store = new Storage('a', 5000);
     store.set({'a': 2});
     store.get() ; // {a: '2'}
 **/
define(function () {
    // function Storage(key, lifeTime) {
    //     this.key = key;
    //     this.lifeTime = lifeTime || 0;
    //     this.setLiftTime();
    // }
    // Storage.prototype = {
    //     constructor: Storage,
    //     setLiftTime: function (){
    //         var time = new Date().getTime() + this.lifeTime;
            
    //         if (!window.localStorage.getItem(this.key) && this.lifeTime > 0) {
    //             this.setAttr('timeout',  time);
    //         }
    //     },
    //     set: function (value) {
    //         // value  {key : value}
    //         //简单包装一下，方便还原的时候，类型一致，因为localstorage仅支持string类型数据.
    //         var data = {
    //             "value": value || this.value
    //         };
    //         data = JSON.stringify(value);

    //         window.localStorage.setItem(this.key, data);
    //     },
    //     get: function () {
    //         var data = window.localStorage.getItem(this.key);
    //         if (!data) return null;
    //         data = JSON.parse(data);

    //         // 是否过期
    //         if (this.lifeTime == 0) {
    //             return data;
    //         } else {
    //             if (new Date().getTime() <= this._getAttr('timeout')) {
    //                 return data;
    //             } else {
    //                 window.localStorage.removeItem(this.key);
    //                 return false;
    //             }
    //         }
    //     },
    //     //移除
    //     remove: function () {
    //         window.localStorage.removeItem(this.key);
    //         return true
    //     },
    //     //获取单个
    //     getAttr: function (key) {
    //         var all = this.get() || {};
    //         if (all[key]) {
    //             return all[key];
    //         }
    //         return null;
    //     },
    //     //设置单个.
    //     setAttr: function (key, val) {
    //         var all = this.get() || {};
    //         all[key] = val;
    //         this.set(all);
    //         return all;
    //     },
    //     _getAttr: function (key) {
    //         var data = window.localStorage.getItem(this.key) || {};
    //         data = JSON.parse(data);

    //         if (data[key]) {
    //             return data[key];
    //         }
    //         return null;
    //     }
    // };

    function Storage(key, lifeTime) {
        this.key = key;
        this.lifeTime = lifeTime || 0;
        this._setLiftTime();
    }
    Storage.prototype = {
        constructor: Storage,
        _setLiftTime: function (){
            var time = new Date().getTime() + this.lifeTime,
                data = {
                    "value": null,
                    "timeout": time
                };

            if (!window.localStorage.getItem(this.key) && this.lifeTime > 0) {
                data = JSON.stringify(data);
                window.localStorage.setItem(this.key, data);
            }
        },
        _isTimeout: function (){
            var data = this._getTimeOut();

            if (data) {
                return (new Date().getTime() <= data.timeout);
            } else {
                return null;
            }
        },
        _getTimeOut: function () {
            var data = window.localStorage.getItem(this.key);
            if(!data) return null;
            data = JSON.parse(data);

            return data;
        },
        _parseData: function(){
            var data = window.localStorage.getItem(this.key);
            if(!data) return null;
            data = JSON.parse(data);

            return data.value;
        },
        set: function (value) {
            var data = {
                "value": value || null
            };

            if(this.lifeTime != 0) {
                data.timeout = this._getTimeOut() ?  this._getTimeOut().timeout : new Date().getTime() + this.lifeTime;
            }

            data = JSON.stringify(data);
            window.localStorage.setItem(this.key, data);
        },
        get: function () {
            var data = this._parseData();

            // 是否过期
            if (this.lifeTime == 0) {
                return data;
            } else {
                if (this._isTimeout()) {
                    return data;
                } else {
                    this.remove();
                    return false;
                }
            }
        },
        getAttr: function (key) {
            var all = this._parseData() || {};
            if(all[key] != undefined){
                return all[key];
            }
            return null;
        },
        setAttr: function (key, val) {
            var all = this._parseData() || {};
            all[key] = val;
            this.set(all);
            return all;
        },
        remove: function(){
            window.localStorage.removeItem(this.key);
            return true;
        }
    };

    return Storage;
});