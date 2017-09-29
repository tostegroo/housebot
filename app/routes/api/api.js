var fs = require("fs");

module.exports = function(app)
{
    var routePath="./routes/api/";
    fs.readdirSync(routePath).forEach(function(folder)
    {
        var versionRoute = routePath+folder;
        if(fs.lstatSync(versionRoute).isDirectory())
        {
            fs.readdirSync(versionRoute).forEach(function(file)
            {
                var route = './'+folder+'/'+file;
                require(route)(app);
            });
        }
    });
}
