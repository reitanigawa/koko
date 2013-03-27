var fs            = require('fs'),
    async         = require('async'),
    http          = require('http'),
    express       = require('express'),
    emptyPort     = require('empty-port'),
    colors        = require('colors'),
    child_process = require('child_process');

var Koko = function (root, opt) {
    var app = express();
    var port, url;

    colors.setTheme({
        info  : 'green',
        warn  : 'yellow',
        error : 'red'
    });

    if (!fs.existsSync(root)) {
        console.error('%s does\'nt exist.'.error, root);
        process.exit();
    }

    console.log('document root\t: %s'.info, root);

    app.configure(function(){
        app.use(express.static(root));
    });

    async.waterfall([function (next) {
        emptyPort({}, next);
    }, function (p, next) {
        port = p;
        url = 'http://localhost:' + port;

        http.createServer(app).listen(port, next);
    }, function (next) {
        console.log('[listen %d]'.info, port);

        if (!opt.autoOpen) {
            return next();
        }

        console.log('[open %s]'.info, url);
        child_process.exec('open ' + url, next);
    }], function (err) {
            if (err) {
                console.error((err + '').error);
                process.exit();
            }
    });
};

module.exports = Koko;