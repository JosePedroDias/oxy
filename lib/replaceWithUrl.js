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
        
        if (!to && o.from === req.url) {
            to = o.to;
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
