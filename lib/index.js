var http      = require('http'),
    httpProxy = require('http-proxy'),
    url       = require('url');



module.exports = function(cfg) {

    var ts = function() {
        return new Date().toISOString().substring(11, 19);
    };

    var log = function(msg) {
        console.log([ts(), ' ', msg].join(''));
    };

    var warn, err;
    if (cfg.monochrome) {
        warn  = function(msg) { console.warn( [ts(), ' ', msg].join('')); };
        error = function(msg) { console.error([ts(), ' ', msg].join('')); };
    }
    else {
        warn  = function(msg) { console.warn( [ts(), ' \x1B[33m', msg, '\x1B[39m'].join('')); }; // yellow
        error = function(msg) { console.error([ts(), ' \x1B[31m', msg, '\x1B[39m'].join('')); }; // red
    }



    var proxy = new httpProxy.RoutingProxy();



    console.log('\x1B[34m' + ' ___   _     _   ');
    console.log('/ / \\ \\ \\_/ \\ \\_/');
    console.log('\\_\\_/ /_/ \\  |_| \n' + '\x1B[39m');



    var plugins = [];
    var keys = Object.keys(cfg);
    var skips = 'port logLevel monochrome'.split(' ');
    keys.forEach(function(k) {
        if (skips.indexOf(k) !== -1) { return; }
        try {
            plugins.push( require('./' + k) );
            log('starting plugin ' + k + '...');
        } catch (ex) {
            throw 'plugin not found: ' + k + '!';
        }
    });



    http.createServer(
        function(req, res) {
            var handled = false;

            plugins.some(
                function(plugin) {
                    var v = plugin(req, res, cfg, log, warn, error);
                    handled = v;
                    return v;
                }
            );

            if (!handled) {
                var parsed = url.parse(req.url);
                proxy.proxyRequest(req, res, {
                    host: parsed.hostname,
                    port: parsed.port || 80,
                });
            }

            var msg = [handled || '...', ' ', req.url.substring(0, 60)].join('');
            if (cfg.logLevel === 2) {
                if (handled) { log(msg);  }
                else {         warn(msg); }
            }
            else if (cfg.logLevel === 1 && handled) {
                warn(msg);
            }
        }
    ).listen(cfg.port);

    log('running on port ' + cfg.port + '.');

};