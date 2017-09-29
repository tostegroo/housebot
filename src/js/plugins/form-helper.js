(function(window)
{
    var formHelper = {};

    formHelper.validateEmail = function(email) 
    { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    formHelper.validateName = function(nome){
        var nome_array = nome.split(" ");
        nome_array = formHelper.cleanArray(nome_array, "");
        if (nome_array.length > 1){
            return true;
        } else {
            return false;
        }
    }

    formHelper.fuzzyTime = function(timeValue, options){
        fuzzyTime.defaultOptions = {
            relativeTime : 48,
            monthNames : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            amPm : ['AM', 'PM'],
            ordinalSuffix : function(n) {return ['','','',''][n<4 || (n>20 && n % 10<4) ? n % 10 : 0]}
        };

        function fuzzyTime (timeValue, options) {
            var options=options||fuzzyTime.defaultOptions,
                date=parseDate(timeValue),
                delta=parseInt(((new Date()).getTime()-date.getTime())/1000),
                relative=options.relativeTime,
                cutoff=+relative===relative ? relative*60*60 : Infinity;

            if (relative===false || delta>cutoff)
                return formatDate(date, options)+ ' &agrave;s '+formatTime(date, options);

            if (delta<60) return 'alguns segundos atr&aacute;s';
                var minutes=parseInt(delta/60 +0.5);
            if (minutes <= 1) return '+- um minuto atr&aacute;s';
                var hours=parseInt(minutes/60 +0.5);
            if (hours<1) return 'h&aacute; '+minutes+' minutos';
            if (hours==1) return '+- uma hora atr&aacute;s';
                var days=parseInt(hours/24 +0.5);
            if (days<1) return 'h&aacute; '+hours+' horas';
            if (days==1) return 'ontem &agrave;s '+formatTime(date, options);
                var weeks=parseInt(days/7 +0.5);
            if (weeks<2) return 'h&aacute; '+days+' dias &agrave;s '+ formatTime(date, options);
                var months=parseInt(weeks/4.34812141 +0.5);
            if (months<2) return 'h&aacute; '+ weeks+' semanas';
                var years=parseInt(months/12 +0.5);
            if (years<2) return 'h&aacute; '+months+' meses';
                return years+' anos';
        }

        function parseDate (str) {
            var v=str.replace(/[T\+]/g,' ').split(' ');
            return new Date(Date.parse(v[0] + " " + v[1] )); //+ " UTC"));
        }

        function formatTime (date, options) {
            var h=date.getHours(), m=''+date.getMinutes(), am=options.amPm;
            //return (h>12 ? h-12 : h)+':'+(m.length==1 ? '0' : '' )+m+' '+(h<12 ? am[0] : am[1]);
            return h+':'+(m.length==1 ? '0' : '' )+m;
        }

        function formatDate (date, options) {
            var mon=options.monthNames[date.getMonth()],
            day=date.getDate(),
            year=date.getFullYear(),
            thisyear=(new Date()).getFullYear(),
            suf=options.ordinalSuffix(day);
            return day+suf+(thisyear!=year ? ', '+year : '')+' '+mon;
        }
        return fuzzyTime;
    };

    window.formHelper = formHelper;
}(window));