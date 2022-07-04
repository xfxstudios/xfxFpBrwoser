//version=1.2

var Base64 = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = Base64._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },
    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    },
    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.toString().replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    },
    sha256crypt: async function(message, key){
        const g = str => new Uint8Array([...unescape(encodeURIComponent(str))].map(c => c.charCodeAt(0))),
        k = g(key),
        m = g(message),
        c = await crypto.subtle.importKey('raw', k, { name: 'HMAC', hash: 'SHA-256' },true, ['sign']),
        s = await crypto.subtle.sign('HMAC', c, m);
        return btoa(String.fromCharCode(...new Uint8Array(s)));
    },
    include : function(file) {
        let dd = document.getElementsByTagName('script');
        dd = [].slice.call(dd)
        let _l = dd.map((item)=>{ return item.getAttribute('src'); })
            if(!_l.includes(file)){
                var script  = document.createElement('script');
                script.src  = file;
                script.type = 'text/javascript';
                script.defer = true;
                let _title = document.getElementsByTagName('style')[0];
                let _head = document.getElementsByTagName('head').item(0)
                _head.insertBefore(script, _title);
            }
            
    },
    _setToken : async function(data){
        const header = {
            "alg": "HS256",
            "typ": "JWT",
            "kid": "vpaas-magic-cookie-1fc542a3e4414a44b2611668195e2bfe/4f4910"
        }
        const encodedHeaders = Base64.encode(JSON.stringify(header))
    
        const encodedPlayload = Base64.encode(JSON.stringify({data:data}))
    
        const signature = Base64.sha256crypt(`${encodedHeaders}.${encodedPlayload}`,"xfxfp14624982brjs");
    
        const encodedSignature = Base64.encode(signature)
    
        const jwt = `${encodedHeaders}.${encodedPlayload}.${encodedSignature}`;
    
        return jwt;
    
    }
};

(function (name, context, definition) {
    "use strict";
    if (typeof module !== "undefined" && module.exports) { module.exports = definition(); }
    else if (typeof define === "function" && define.amd) { define(definition); }
    else { context[name] = definition(); }
})("Xfxfp", this, function() {
    
    var Xfxfp = function(){};

    Xfxfp.prototype = {
        extend: function(source, target) {
            if (source == null) { return target; }
            for (var k in source) {
                if(source[k] != null && target[k] !== source[k]) {
                    target[k] = source[k];
                }
            }
            return target;
        },
        _init(){
            return new Promise(async (resolve, reject) => {
                await Base64.include('http://unpkg.com/clientjs@0.2.1/dist/client.min.js');
                setTimeout(() => {
                    resolve(true);
                }, 500);
            })
        }, 
        getDeviceData(){
        
            return new Promise((resolve, reject) => {
                
                const client = new ClientJS();
        
                const fingerprint = {
                    hash: client.getFingerprint()
                };
                
                const browserInfo = {
                    userAgent: client.getUserAgent(),
                    userAgentLowerCase: client.getUserAgentLowerCase(),
                    browserInfo: client.getBrowserData(),
                    browser:client.getBrowser(),
                    browserVersion:client.getBrowserVersion(),
                    browserMajorVersion:client.getBrowserMajorVersion(),
                    isIE:client.isIE(),
                    isChrome:client.isChrome(),
                    isFirefox:client.isFirefox(),
                    isSafari:client.isSafari(),
                    isOpera: client.isOpera(),
                    plugins:client.getPlugins(),
                    isLocalStorage: client.isLocalStorage(),
                    isSessionStorage: client.isSessionStorage(),
                    isCookie: client.isCookie(),
                    getLanguage: client.getLanguage(),
                    getTimeZone: client.getTimeZone()
                }
        
                const engineInfo = {
                    engine: client.getEngine(),
                    engineVersion: client.getEngineVersion(),
                }
        
                const osInfo = {
                    oS: client.getOS(),
                    oSVersion: client.getOSVersion(),
                    isWindows: client.isWindows(),
                    isMac: client.isMac(),
                    isLinux: client.isLinux(),
                    isUbuntu: client.isUbuntu(),
                    isSolaris: client.isSolaris(),
                }
        
                const deviceInfo = {
                    device: client.getDevice(),
                    deviceType: client.getDeviceType(),
                    deviceVendor: client.getDeviceVendor(),
                    cpu: client.getCPU()
                }
        
                const mobileInfo = {
                    isMobile: client.isMobile(),
                    isMobileMajor:client.isMobileMajor(),
                    isMobileAndroid:client.isMobileAndroid(),
                    isMobileOpera:client.isMobileOpera(),
                    isMobileWindows:client.isMobileWindows(),
                    isMobileBlackBerry:client.isMobileBlackBerry(),
                    isMobileIOS:client.isMobileIOS(),
                    isIphone:client.isIphone(),
                    isIpad:client.isIpad(),
                    isIpod: client.isIpod()
                }
        
                const screenInfo = {
                    screenPrint:client.getScreenPrint(),
                    colorDepth: client.getColorDepth(),
                    currentResolution:client.getCurrentResolution(),
                    availableResolution:client.getAvailableResolution(),
                    deviceXDPI:client.getDeviceXDPI(),
                    deviceYDPI:client.getDeviceYDPI()
                }
        
                const fontInfo = {
                    mimeTypes: client.getMimeTypes(),
                    isMimeTypes: client.isMimeTypes(),
                    isFont: client.isFont(),
                    getFonts: client.getFonts(),
                }
        
                const generalInfo = {
                    systemLanguage : client.getSystemLanguage(),
                    isCanvas: client.isCanvas(),
                    getCanvasPrint: client.getCanvasPrint(),
                }
        
                let _data = {...fingerprint, ...browserInfo, ...engineInfo, ...osInfo, ...deviceInfo, ...mobileInfo, ...screenInfo, ...fontInfo, ...generalInfo};
    
                resolve(_data);
            })
    
        }, 
        getHash(){
            return new Promise((resolve, reject) => {
                let client = new ClientJS();
                resolve(client.getFingerprint());
            })
        },
        getFingerprint(){
            return new Promise(async (resolve, reject) => {
                Base64._setToken(await this.getDeviceData())
                .then((tk) => { 
                    resolve(tk); 
                });
            })
        }, 
        validFingerprint(){}
    }
    return Xfxfp;
});