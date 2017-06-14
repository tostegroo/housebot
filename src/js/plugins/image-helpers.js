(function(window)
{
    var imageHelper = {};

    imageHelper.cropImage = function(img_width, img_height, container_width, container_height, pct) 
    {
        var style = {left:0, top:0, width:0, height:0};
        var prop = img_width/img_height;
        var c_prop = container_width/container_height;
        var width = 0;
        var height = 0;
        if(prop>c_prop)
        {
            height = container_height;
            width = container_height * prop;
        } else {
            width = container_width;
            height = container_width / prop;
        }
        width = (pct==true) ? (width/container_width) * 100 : width;
        height = (pct==true) ? (height/container_height) * 100 : height;
        
        var left = (pct==true) ? (100 - width) / 2 : (container_width - width) / 2;
        var top = (pct==true) ? (100 - height) / 2 : (container_height - height) / 2;
        style =  {left:left, top:top, width:width, height:height};
        return style;
    }

    imageHelper.fitImage = function(img_width, img_height, container_width, container_height, pct, inside) 
    {
        var style = {left:0, top:0, width:0, height:0};
        var prop = (inside==true) ? container_width/container_height : img_width/img_height;
        var c_prop = (inside==true) ? img_width/img_height : container_width/container_height;
        var img_prop = img_width/img_height;
        
        var width = 0;
        var height = 0;
        
        if(prop>c_prop)
        {
            height = container_height;
            width = container_height * img_prop;
        }else
        {
            width = container_width;
            height = container_width / img_prop;
        }
        width = (pct==true) ? (width/container_width) * 100 : width;
        height = (pct==true) ? (height/container_height) * 100 : height;
        
        var left = (pct==true) ? (100 - width) * 0.5 : (container_width - width) * 0.5;
        var top = (pct==true) ? (100 - height) * 0.5 : (container_height - height) * 0.5;
        style =  {left:left, top:top, width:width, height:height};
        return style;
    }
    window.imageHelper = imageHelper;
} (window));

(function($)
{  
    $.fn.isLoaded = function() 
    {
        return this
                 .filter("img")
                 .filter(function() { return this.complete; }).length > 0;
    };
})(jQuery);

(function($)
{ 
    $.fn.fitContainer = function(inside, callback) 
    {
        var $_callback = (callback==undefined) ? null : callback;
        var $_inside = (inside==undefined) ? false : inside;
        var $_elm = $(this);
        
        $(window).resize(function(e)
        {
            window.setTimeout(function()
            {
                fit();  
            }, 500);
        });
        fit();
        
        function fit()
        {
            $_elm.each(function(index, element) 
            {
                var elmm = ($(this).get(0).tagName == 'IMG') ? $(this) : $(this).find('img');
                elmm.removeClass('hasimg').stop(true, true).fadeOut(0);
                var ceml = $(this);
                    
                if(elmm.isLoaded())
                {
                    resizeImage(ceml, $_inside);
                    
                    if($_callback!=null)
                        $_callback();
                }else
                {
                    elmm.load(function() 
                    {
                        resizeImage(ceml, $_inside);
                        
                        if($_callback!=null)
                            $_callback();
                    });
                }
            }); 
        }
        function resizeImage(element, inside)
        {
            element.attr('style','');
            element.css({width:'auto', height:'auto'});
            
            var elm_width = (element.get(0).tagName == 'IMG') ? element.width() : element.find('img').width();
            var elm_height = (element.get(0).tagName == 'IMG') ? element.height() : element.find('img').height();
            var container_width = element.parents().width();
            var container_height = element.parents().height();
            
            var style = imageHelper.fitImage(elm_width, elm_height, container_width, container_height, false, inside);
            if(style.width!=0 && style.height!=0)
            {
                element.attr('style','');
                element.css({'position':'absolute', top:style.top, left:style.left, width:style.width, height:style.height});
                
                if(element.get(0).tagName != 'IMG')
                    element.find('img').css({'width':'100%', 'height':'100%'});
            }
            element.addClass('hasimg').stop(true, true).fadeIn(200);
        }
        
        return $_elm;
    }
})(jQuery);