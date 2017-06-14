(function(window)
{
    var home = {};
    home.el = {
        body: $('body'),
        header: $('header'),
        footer: $('footer'),
        slideContainer: null
    }

    home.init = function init()
    {
        home.onResize();
        $(window).resize(function(e)
        {
            home.onResize(e);
        });

        $('#btspeech').on('click', function()
        {
            if($(this).hasClass('started'))
            {
                $(this).removeClass('started');
                $(this).html('Start');
                home.stopRecording();
            }
            else
            {
                $(this).addClass('started');
                $(this).html('Stop');
                home.startRecording();
            }
        });

        home.stopRecording('Waiting...');
    };

    home.startRecording = function()
    {
        $('#text').removeClass('error');
        var url = root_path + '/start'
        $.ajax(
        {
            url: url,
            data: {filePath: 'C:/house-bot/app/files/audio.wav'},
            type: 'POST',
            success: function(data)
            {
                var html = '';
                if(data.status==true)
                    html = 'Speech...';
                else
                    html = 'Error';

                $('#text').html(html);
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                $('#text').html('Error!').addClass('error');
            }
        });
    }

    home.stopRecording = function(initialText)
    {
        initialText = initialText || '';
        $('#text').removeClass('error');
        var url = root_path + '/stop'
        $.ajax(
        {
            url: url,
            type: 'POST',
            success: function(data)
            {
                var html = initialText;
                if(data.status==true)
                {
                    if(data.text)
                        html += '<span>Transcription: ' + data.text + '</span><br><br>';

                    if(data.data)
                    {
                        for (item of data.data)
                        {
                            var script = '';
                            if(item.hasOwnProperty('script'))
                                script = ', and then execute the script: ' + JSON.stringify(item.script);

                            if(item.hasOwnProperty('text'))
                                html += item.text + script + '<br>';
                        }
                    }

                }
                else
                    html = 'Error';

                $('#text').html(html);
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                $('#text').html('Error!').addClass('error');
            }
        });
    }

    home.onScroll = function onScroll(e){};

    home.onResize = function onResize(e)
    {
        var windowHeight = $(window).height();
        var headerHeight = home.el.header.height();
        var footerHeight = home.el.footer.height();
    };

    window.home = home;
} (window));
