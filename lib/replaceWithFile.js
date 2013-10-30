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

    var responded = cfg.some(function(o) {
        if (o.from === req.url) {
            res.setHeader('Content-Type',
                o.mime ||
                mimes[ o.to.split('.').pop().toLowerCase() ] ||
                'text/html'
            );

            fs.readFile(o.to, function(err, data) {
                if (err) {
                    var msg = ['Proxy plugin ', name, ': problem reading ', o.to].join('');
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
