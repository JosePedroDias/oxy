var fs  = require('fs'),
    url = require('url');

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

module.exports = function(req, res, cfgAll) {
    var name = 'replaceWithFile';
    var cfg = cfgAll[name];

    return cfg.some(function(o) {
        if (o.from === req.url) {
            res.setHeader('Content-Type',
                o.mime ||
                mimes[ o.to.split('.').pop().toLowerCase() ] ||
                'text/html'
            );

            fs.readFile(o.to, function(err, data) {
                if (err) { throw err; }
                res.end(data);
            })

            return name;
        }
    });
};
