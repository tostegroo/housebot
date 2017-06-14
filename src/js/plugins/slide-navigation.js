(function($)
{
    $.fn.slidefy = function(options) 
    {
        $this = $(this);
        $this.currentIndex = 0;
        $this.containerWidth = $this.width();
        $this.totalItens = 0;

        var $options = $.extend(
        {
            prevButton: null,
            nextButton: null,
            initialIndex: 0,
            strip: $(this).find(">:first-child")
        }, options);

        $this.totalItens = $options.strip.find('.slideitem').length;
        $this.currentIndex = $options.initialIndex;

        if($options.prevButton!=null)
        {
            $options.prevButton.on('click', function()
            {
                if(!$(this).hasClass('disabled'))
                    $this.navigate($this.currentIndex-1);
            });
        }

        if($options.nextButton!=null)
        {
            $options.nextButton.on('click', function()
            {
                if(!$(this).hasClass('disabled'))
                    $this.navigate($this.currentIndex+1);
            });
        }

        $this.navigate = function navigate(index)
        {
            index = (index==undefined) ? $this.currentIndex : index;

            if(index<=0)
            {
                index = 0;
                if($options.prevButton!=null)
                    $options.prevButton.addClass('disabled');
            }
            else
            {
                if($options.prevButton!=null)
                    $options.prevButton.removeClass('disabled');
            }

            if(index>=$this.totalItens-1)
            {
                index = $this.totalItens-1;

                if($options.nextButton!=null)
                    $options.nextButton.addClass('disabled');
            }
            else
            {
                if($options.nextButton!=null)
                    $options.nextButton.removeClass('disabled');
            }

            var curretnElement = $($('.slideitem').get(index));
            if(curretnElement.attr('data-update')!=undefined && curretnElement.attr('data-update')!='')
                $("*").find("[data-toupdate='true']").text(curretnElement.attr('data-update'));

            TweenMax.to($options.strip, 0.8, {left:-index * $this.containerWidth, ease:Quart.easeInOut});

            $this.currentIndex = index;
        }

        $this.navigate($this.currentIndex);

        return $this;
    }
})(jQuery);