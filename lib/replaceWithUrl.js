var httpProxy = require('http-proxy'),
    url       = require('url');

var proxy = new httpProxy.RoutingProxy();

module.exports = function(req, res, cfgAll) {
    var name = 'replaceWithUrl';
    var cfg = cfgAll[name];

    return cfg.some(function(o) {
        if (o.from === req.url) {
            req.url = o.to;
            var parsed = url.parse(req.url);
            proxy.proxyRequest(req, res, {
                host: parsed.hostname,
                port: parsed.port || 80,
            });
            return name;
        }
    });
};
