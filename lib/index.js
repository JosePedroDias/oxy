var http      = require('http'),
    httpProxy = require('http-proxy'),
    url       = require('url');



var cfg = {
    port:     8080,
    logLevel: 1, // 0=nothing, 1=changed request, 2=all requests
    replaceWithFile: [
        {
            from: 'http://h.s.sl.pt/v2011/imgs/2011/bg_weatherloc.svg',
            to:   '/Volumes/HD93/Media/best of/IMG_9720.JPG'
            // mime can be specified too
        }
    ],
    replaceWithUrl: [
        {
            from: 'http://i.s.sl.pt/v2011/XL_dadf4f8d8bce31fa22df6026f11eda7d.jpg',
            to:   'http://i.s.sl.pt/v2011/XL_79611931073d68505087328628e8d0e3.jpg'
        }
    ]
};



var ts = function() {
    return new Date().toISOString().substring(11, 19);
};



var proxy = new httpProxy.RoutingProxy();



var plugins = [];
var keys = Object.keys(cfg);
keys.forEach(function(k) {
    if (k === 'port' || k === 'logLevel') { return; }
    try {
        plugins.push( require('./' + k) );
    } catch (ex) {
        console.log('plugin not found: ' + k + '!');
    }
});



http.createServer(
    function(req, res) {
        var handled = plugins.some(
            function(plugin) {
                return plugin(req, res, cfg)
            }
        );

        if (!handled) {
            var parsed = url.parse(req.url);
            proxy.proxyRequest(req, res, {
                host: parsed.hostname,
                port: parsed.port || 80,
            });
        }

        if (cfg.logLevel === 2) {
            console.log([ts(), ' ', handled || '...', ' ', req.url.substring(0, 60)].join(''));
        }
        else if (cfg.logLevel === 1 && handled) {
            console.log([ts(), ' ', handled, ' ', req.url.substring(0, 60)].join(''));
        }
    }
).listen(cfg.port);

