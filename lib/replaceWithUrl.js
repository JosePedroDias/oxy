var httpProxy = require('http-proxy'),
    url       = require('url');

var proxy = new httpProxy.RoutingProxy();

module.exports = function(req, res, cfgAll, log, warn, error) {
    var name = 'replaceWithUrl';
    var cfg = cfgAll[name];
    var to;
    
    var responded = cfg.some(function(o) {
        if (typeof o.from === 'function') {
            to = o.from(req.url, req);
        }
        
        if (!to && o.from instanceof RegExp) {
            var m = o.from.exec(req.url);
            if (m) {
                to = o.to;
                for (var i = 1, f = m.length; i < f; ++i) {
                    to = to.replace(new RegExp('\\$' + i, 'g'), m[i]); 
                }
                o.from.lastIndex = 0;
            }
        }
        
        if (!to && o.from === req.url) {
            to = o.to;
        }
        
        if (!to && o.partialMatch && req.url.indexOf(o.from) === 0) {
            to = req.url.replace(o.from, o.to);
        }
        
        if (to) {
            req.url = to;
            var parsed = url.parse(req.url);
            proxy.proxyRequest(req, res, {
                host: parsed.hostname,
                port: parsed.port || 80,
            });
            return true;
        }
    });

    return responded ? name : false;
};
