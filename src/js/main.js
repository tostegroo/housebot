(function(window)
{
    var main = {};
    main.ajax = null;
    main.el = {
        body: $('body'),
        header: $('header'),
        footer: $('footer')
    }

    main.init = function init()
    {
        main.onResize();
        $(window).resize(function(e)
        {
            main.onResize(e);
        });

        main.setEvents();
        main.initScripts();
    };

    main.setEvents = function setEvents()
    {
        if(window.home)
            window.home.init();
    }

    main.changeContent = function changeContent(container, url, data)
    {
        if(main.ajax!=null)
            main.ajax.abort();

        $('#page-loader-container').addClass('show');
        TweenMax.to(container, 0.6, {autoAlpha:0, left:-50, ease:Quart.easeInOut, onComplete:function()
        {
            if(container)
                container.html('');

            main.ajax = $.ajax(
            {
                url: url,
                data: data,
                type: 'POST',
                success: function(html)
                {
                    main.changeUrl(url);

                    if(container && html!=undefined && html!='')
                        container.html(html);

                    if($('.item-tab-link').length>0)
                    {
                        $('.item-tab-link').off().on('click', function(e)
                        {
                            var url = $(this).attr('href');
                            main.changeContent($('#view-content'), url);

                            $('.item-tab-link').children('li').removeClass('selected');
                            $(this).children('li').addClass('selected');

                            e.preventDefault();
                            return false;
                        });
                    }

                    main.initScripts();
                },
                error: function(jqXHR, textStatus, errorThrown){},
                complete: function()
                {
                    $('#page-loader-container').removeClass('show');
                    TweenMax.to(container, 0.6, {autoAlpha:1, left:0, ease:Quart.easeInOut});
                }
            });
        }});
    }

    main.initScripts = function initScripts()
    {
        $('.page-scripts').each(function(index, el)
        {
            if(!$(this).hasClass('initiate'))
            {
                var pscript = $(this).attr('data-script');
                var pfunction = $(this).attr('data-function');

                if(window[pscript] && window[pscript][pfunction])
                    window[pscript][pfunction]();

                $(this).addClass('initiate');
            }
        });
    }

    main.onScroll = function onScroll(e)
    {

    };

    main.onResize = function onResize(e)
    {
        var windowHeight = $(window).height();
        var headerHeight = main.el.header.height();
        var footerHeight = main.el.footer.height();
    };

    window.main = main;
} (window));

$(document).ready(function($)
{
    main.init();
});
