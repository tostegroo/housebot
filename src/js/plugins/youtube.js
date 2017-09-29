(function($)
{  
    $.fn.yt_render = function(video_id, options) 
    {
        var $this = $(this);
        
        var $_options = $.extend(
        {
            controls:1,
            showinfo:0,
            autoplay:0,
            onStartVideo:null,
            onHalfVideo:null,
            onFinishVideo:null
        }, options);
        
        $this.player = null;
        $this.player_interval = null;
        $this.player_play = null;
        $this.video_id = video_id;
        $this.$_id = getID();
        
        function render()
        {
            var v_width = $this.attr('width');
            var v_height = $this.attr('height');
            
            if($this.player==null)
            {
                $this.player = new YT.Player($this.video_id, {
                    width: v_width,
                    height: v_height,
                    videoId: $this.video_id,
                    playerVars: {
                        controls: $_options.controls,
                        showinfo: $_options.showinfo,
                        modestbranding: 1,
                        wmode: "opaque",
                        autoplay: $_options.autoplay
                    },
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange' : onPlayerState
                    }
                });
            }
        };
        
        function playerState(state, id) {}   
        function onPlayerReady(event) {}
        function onPlayerState(state) 
        {
            var id = state.target.getVideoUrl();
            id = id.split('v=')[1];
            var ampersandPosition = id.indexOf('&');
            if(ampersandPosition != -1) 
            {
                id = id.substring(0, ampersandPosition);
            }
            
            if (state.data == 1)
            {
                if ($this.player_play == null)
                    $this.player_play = true;
                    
            } else if (state.data == 0) 
            {
                if($_options.onFinishVideo!=null)
                    $_options.onFinishVideo($this);
                    
            }else if (state.data == 3)
            {
                if($_options.onStartVideo!=null)
                    $_options.onStartVideo($this);
                    
                if ($this.player_interval == null)
                {
                    $this.player_interval = window.setInterval(function()
                    {                        
                        if ($this.player.getPlayerState() == 1)
                        {
                            if ($this.player.getCurrentTime() > ($this.player.getDuration() / 2))
                            {
                                if($_options.onHalfVideo!=null)
                                    $_options.onHalfVideo($this);
                                
                                window.clearInterval($this.player_interval);
                            }
                        }
                    }, 1000);
                }
            }
        }
        function getID(){return '_' + Math.random().toString(36).substr(2, 9);}
        
        $this.stopVideo = function()
        {
            if($this.player != null)
                $this.player.pauseVideo();
        };
        $this.playVideo = function()
        {
            if($this.player != null)
            {
                $this.player.seekTo(0);
                $this.player.playVideo();
            }
        };
        render();
    };
})(jQuery);