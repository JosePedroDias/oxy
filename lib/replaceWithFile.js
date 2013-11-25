var fs     = require('fs'),
    url    = require('url');

var mimes = {
    jpg:  'image/jpeg',
    png:  'image/png',
    gif:  'image/gif',
    css:  'text/css',
    html: 'text/html',
    js:   'text/javascript',
    json: 'application/json',
    xml:  'text/xml',
    txt:  'text/plain'
};



module.exports = function(req, res, cfgAll, log, warn, error) {
    var name = 'replaceWithFile';
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
        
        if (!to && o.partialMatch && req.url.indexOf(o.from) !== -1) {
            to = req.url.replace(o.from, o.to);
        }
        
        if (to) {
            res.setHeader('Content-Type',
                o.mime ||
                mimes[ to.split('.').pop().toLowerCase() ] ||
                'text/html'
            );

            fs.readFile(to, function(err, data) {
                if (err) {
                    var msg = ['Proxy plugin ', name, ': problem reading ', to].join('');
                    error(msg);
                    res.writeHead(404);
                    return res.end(msg);
                }
                res.end(data);
            });

            return true;
        }
    });

    return responded ? name : false;
};
