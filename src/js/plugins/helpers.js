(function(window)
{
    var helpers = {};

    helpers.scrollToByID = function(id, time) 
    {
        time = (time==undefined) ? 100 : time;
        $('html,body').animate(
        {
            scrollTop: $("#" + id).offset().top
        }, time);
    };

    helpers.scrollToByPos = function(pos, callback) 
    {
        if(!callback)
            callback = '';

        $('html,body').stop(true, true).animate(
        {
            scrollTop: pos
        }, 1000, 'easeInOutQuart', callback);
    };

    helpers.makeSlug = function(string)
    {
        var newstring = "";
        if(string)
        {
            string = string.toString();
            newstring = string.toLowerCase();
            newstring = newstring.replaceAll('+', ' ');
            newstring = $.trim(newstring);
            newstring = newstring.replaceAll(' ', '-');
            newstring = newstring.replaceAll('//', '/');
            newstring = accent_fold(newstring);
            
            function accent_fold(s)
            {
                var ret = '';
                var accent_map = 
                {
                    'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', // a
                    'ç': 'c',                                                   // c
                    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',                     // e
                    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',                     // i
                    'ñ': 'n',                                                   // n
                    'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o', // o
                    'ß': 's',                                                   // s
                    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',                     // u
                    'ÿ': 'y'                                                    // y
                };
                if (!s) { return ''; }

                for (var i = 0; i < s.length; i++) 
                    ret += accent_map[s.charAt(i)] || s.charAt(i);
                
                return ret;
            }
        }
        return  newstring;
    }

    helpers.openPopUp = function (page, name, width, height)
    {
        w = formHelper.getWindowWidth();
        h = formHelper.getWindowHeight();
        half_w = w/2;
        half_h = h/2;
        height = (height == undefined) ? 800 :  height;
        width = (width == undefined) ? 500 :  width;
        height2 = height/2;
        width2 = width/2;
        half1 = half_h-height2;
        half2 = half_w-width2;
        popup = window.open(page, '_blank','height=' + height + ', width=' + width + ', top='+half1+', left='+half2+'');
        if(popup)
            if (window.focus) {popup.focus()}
        else
           alert('pop up foi bloqueado tente novamente.');
    };
    
    window.helpers = helpers;
} (window));

Array.prototype.clean = function(deleteValue) 
{
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

String.prototype.replaceAll = function(target, replacement) 
{
    return this.split(target).join(replacement);
};

jQuery.fn.sortElements = (function()
{
    var sort = [].sort;
    return function(comparator, getSortable) 
    {
        getSortable = getSortable || function(){return this;};
        var placements = this.map(function()
        {
            var sortElement = getSortable.call(this),
                parentNode = sortElement.parentNode,
                nextSibling = parentNode.insertBefore(
                    document.createTextNode(''),
                    sortElement.nextSibling
                );
 
            return function() 
            {
                if (parentNode === this) {
                    throw new Error(
                        "You can't sort elements if any one is a descendant of another."
                    );
                }
                parentNode.insertBefore(this, nextSibling);
                parentNode.removeChild(nextSibling);
            };
        });
 
        return sort.call(this, comparator).each(function(i){
            placements[i].call(getSortable.call(this));
        });
    };
})();