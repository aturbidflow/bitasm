/**
 *
 * BITASM Framework
 * Most useless framework you ever tried.
 *
 * @file BITASM Framework
 * @author Artem Flo
 * @version 0.1.050
 *
 */

var ONSCR,ASMBOOT,
    LOADSTEP = function(cur,total){
        if (GETBYID('loading-state')){
            GETBYID('loading-state').innerHTML = 'Loading (' + Math.round((cur / total) * 100) +'%)'
        }
    },
    adminMail = adminMail || '%put your mail here%',
    soundEnabled = true;


String.prototype.matchAll = function(regexp) {
  var matches = [];
  this.replace(regexp, function() {
    var arr = ([]).slice.call(arguments, 0);
    var extras = arr.splice(-2);
    arr.index = extras[0];
    arr.input = extras[1];
    matches.push(arr);
  });
  return matches.length ? matches : null;
};

(function(){
    //CONSTS
    var ADR_LENGTH = 8,
    //GLOBAL VARS
        $screen,
    //REGISTERS
        ignore404Image = false,
        saveScreen = true,
        ignoreEmptiness = false,
        currentScreen = 1,
        totalLoadElements = 0,
        currentLoadedElements = 0,
        loadTimer = 0,
        HALT = false,
    //COLLECTIONS
        previousScreen = [1],
        sysSoundsCollection = [
            '/sounds/info.mp3',
            '/sounds/warning.mp3',
            '/sounds/error.mp3',
            '/sounds/critical.mp3'
            ],
        systemSounds = [],
        systemErrors = [
            //Unknown
            ['%addr%'],
            //Warnings
            [
                'Address 0x%addr% is empty'
            ],
            //Errors
            [
                'Image "%data%"" can`t be loaded',
                'WEB-404, Page "%data%" can not be found.',
                'Your connection is too slow. Some unloaded elements could appear.'
            ],
            //Critical
            [
            'Address 0x%addr% did not found',
            'Object is not in memory: %addr%',
            'Empty object',
            'Data for repeat is not set: %addr%'
            ]
        ],
        systemMessages = [
            '<a href="javascript:ALRT.hide()" class="button alert-button">Ok</a>',
            '<a href="javascript:ALRT.hide()" class="button alert-button">Close</a>',
            'You may have to restart the application and contact administrator by ' + adminMail + '. But you can go further by clicking this button > <a href="#" class="button alert-button" id="sys-continue">Continue</a>',
            'You need to hard reset the application by pressing Ctrl+F5. If the problem persists try to write to ' + adminMail,
        ],
    //OBJECTS
        sysAlert = EL('div');

/*
========================= BOOT =================================
*/

    BOOTWAIT(ONBOOT)
    window.onresize = ONRSZ
    window.onhashchange =GETSCR

/*
========================= TRASH =================================
*/

    function ONBOOT(){
        WAIT(GETSCR)
        if (ASMBOOT){ ASMBOOT() }
    }

    function ONRSZ(){
        POSSCR()
    }

    function GETSCR(){
        D('=> [ Screen change ]')
        SCR(ACSPAGE())
    }

    function ACSPAGE(){
        var href = SCREND(SCRNAME()),
            scr = GETBYCLS((href))[0]

        if (!scr && href != 'scr'){
            ERR021(window.location.hash.replace('#',''),function(){
                window.location.hash = '#'
            })
        } else if (href == 'scr'){ 
            return 1
        } else {
            return POPADR(scr)
        }
    }

    function SCRNAME(){
        return 'scr' + window.location.hash.replace('#','').replace(/\//g,'-');
    }

    function PREVSCR(el){
        if (previousScreen.length < 1){
            previousScreen.push[1]
        }
        return previousScreen.pop()
    }

    function SCREND(name){
        if (name[name.length - 1] == '-'){
            return name.substring(0,name.length - 1)
        } else {
            return name
        }
    }

    function INCLOAD(){
        currentLoadedElements += 1
        loadTimer = new Date().getTime()

        LOADSTEP(currentLoadedElements,totalLoadElements)
    }

    function BOOTWAIT(callback){
        if (document.body && asmDB != undefined){
            $screen = MEM(0)
            POSSCR()

            EXPRT()
            PAGERS()
            TMPLFORCE()
    
            WAITMEDIA(callback)
        } else {
            setTimeout(function(){
                BOOTWAIT(callback)
            },0)
        }
    }

    function WAITMEDIA(callback){
        var media = [],
            imgs = GETBYTAG('img'),
            ximgs = GETBYTAG('ximg'),
            bgimgs = document.body.innerHTML.matchAll(new RegExp('background-image: url ?\\(\\\'?\\\"?([^\\(\\\'\\\"]+)\\\"?\\\'?\\)','g')),
            syssnds = sysSoundsCollection,
            snds = GETBYTAG('audio');

        media = media
            .concat(LDR(TOARR(imgs),LDIMG()))
            .concat(LDR(TOARR(ximgs),LDXIMG()))
            .concat(LDR(bgimgs,LDBGIMG()))
            .concat(LDR(syssnds,LDSYSSND()))
            .concat(LDR(TOARR(snds),LDSND()))

        totalLoadElements = media.length

        MEDIA(media,0,ONMEDIALOADED)

        function ONMEDIALOADED(){
            if (currentLoadedElements < totalLoadElements){
                if (new Date().getTime() < loadTimer + 5000){
                    setTimeout(ONMEDIALOADED,100)
                } else {
                    ERR('022',['',function(){
                        ALRT.close()
                        callback()
                    }])
                }
            } else {
                callback()
            }
        }

        function MEDIA(arr, index, ondone){
            var cback;
            if (arr[index].handlers.before){
                arr[index].data = arr[index].handlers.before(arr[index].data)
            }

            arr[index].data.onerror = MEDIAERR

            if (index == arr.length -1){
                arr[index].data.onload = LASTMEDIA
                arr[index].data.oncanplaythrough = LASTMEDIA
            } else {
                arr[index].data.onload = NEXTMEDIA
                arr[index].data.oncanplaythrough = NEXTMEDIA
                MEDIA(arr,index + 1,ondone)  
            }

            arr[index].handlers.load(arr[index].data)

            function MEDIAERR(){
                var CB;
                D('Error loading media: #' + this.getAttribute('id') + ' (' + this.getAttribute('src') + ')')

                if (index == arr.length -1){
                    CB = LASTMEDIA
                } else {
                    CB = NEXTMEDIA
                }

                if (arr[index].handlers.error){
                    arr[index].handlers.error(arr[index].data,CB)
                } else {
                    CB.call(arr[index].data)
                }
            }

            function LASTMEDIA(){
                this.onerror = null;
                this.onload = null;
                this.oncanplaythrough = null;
                if (arr[index].handlers.done){
                    arr[index].handlers.done(this)
                }
                INCLOAD();
                ondone();
            }

            function NEXTMEDIA(){
                this.onerror = null;
                this.onload = null;
                this.oncanplaythrough = null;
                if (arr[index].handlers.done){
                    arr[index].handlers.done(this)
                }
                D('Media (' + this.tagName + ')"' + this.getAttribute('src') + '" loaded.');
                INCLOAD();              
            }
        }
    }

    function LDR(arr,callback){
        return MAPRET(arr,function(e){
            return {
                data: e,
                handlers: callback
            }
        })
    }

    function LDXIMG(){
        var h = LDIMG();

        h.before = function(el){
            if (el.getAttribute('src').indexOf('%') < 0){
                el = XIMG(el)
            }

            return el;
        }

        h.load = function(el){
            if (el.getAttribute('src').indexOf('%') > -1){
                el.onload()
            }            
        }

        return h;
    }

    function LDBGIMG(){
        function IMGB(data){
            var el = EL('ximg');
            el.setAttribute('src',data[1]);
            return el;
        }

        function IMGL(el){
            if (el.getAttribute('src').indexOf('%') < 0){
                el = XIMG(el)
            } else {
                el.onload()
            }
        }

        return {
            before: IMGB,
            load: IMGL
        }
    }

    function LDIMG(){
        function IMGB(el){
            D('Waiting for "' + el.getAttribute('src') + '" image...')
            return el;
        }

        function IMGL(el){
            IMGRFR(el)
        }

        function IMGE(el,callback){
            if (!ignore404Image && !el.src.match('%')){
                ERR020(
                    el.src,
                    function(){
                        callback()
                        ALRT.close()
                    }
                );
            } else {
                callback()
            }
        }
        return {
            before: IMGB,
            load: IMGL,
            error: function(){},
            done: function(){}
        }
    }

    function LDSYSSND(){
        function SNDL(el){
            el.load()
        }

        function SNDB(data){
            var snd = new Audio();
            snd.setAttribute('src',data)
            snd.setAttribute('index',systemSounds.length);
            systemSounds[systemSounds.length] = ''
            return snd;
        }

        function SNDD(el){
            systemSounds[el.getAttribute('index')] = el
        }

        return {
            before: SNDB,
            load: SNDL,
            done: SNDD
        }
    }

    function LDSND(){
        function SNDL(el){
            el.load()
        }

        return {
            load: SNDL
        }
    }

    function POSSCR(){
        $screen.style.top = window.innerHeight / 2 - ($screen.clientHeight || $screen.height || $screen.innerHeight) / 2 + 'px'
    }

    function EXPRT(){
        window.D = D
        window.EL = EL
        window.GETBYCLS = GETBYCLS
        window.GETBYTAG = GETBYTAG
        window.GETBYID = GETBYID
        window.ERR = ERR
        window.LSTNTAG = LSTNTAG
        window.LSTNCLS = LSTNCLS
        window.MEM = MEM
        window.MAP = MAP
        window.MAPREP = MAPRET
        window.SCR = SCR
        window.SCRBACK = SCRBACK
        window.SND = SND
        window.SYSSND = SYSSND
        window.WAIT = WAIT
        window.ALRT = ALRT.init()
    }

/*
========================= SCREENS =================================
*/

    function SCR(addr){
        var scrData = MEM(ADR(addr,'0'));

        SCRSAV()

        if (scrData){
            SCREMPT(scrData) ? ERR('010',addr) : (ignoreEmptiness = false) || SCRSHW(addr);
        }

        function SCRSHW(addr){
            $screen.innerHTML = scrData.innerHTML
            if (ONSCR){
                ONSCR(ADR(addr,'0'))
            }
            TMPLS($screen)
            SHRDS($screen)
        }

        function SCRSAV(){
            if (saveScreen){
                previousScreen.push(currentScreen)
            } else {
                saveScreen = true
            }
            currentScreen = addr
        }

        function SCREMPT(scr){
            return (!ignoreEmptiness && scr.innerHTML.replace(/\s/g, '') == '')
        }
    }

    function SCRBACK(e){
        e.preventDefault();
        saveScreen = false
        window.location.hash = '#/' + MEM(ADR(PREVSCR())).className.match(/scr-([^ ]+)/,'')[1].replace(/-/g,'/');
    }

/*
========================= PAGER =================================
*/

    function PAGERS(){
        MAP(GETBYCLS('pager'),PGR)
    }

    function PGR(pager){
        var db = GETDB(pager.getAttribute('data')),
            perpage = pager.getAttribute('data-perpage'),
            pagesCount = Math.ceil(db.data.length / perpage),
            scr = pager.innerHTML, out = '',i;

        scr = TMPLSLOW(scr)

        for (i = 0; i < pagesCount; i++){
            out += PGCTRLS(TMPLVAR(TMPLVAR(TMPLVAR(PAGE(scr,i),'min',i * perpage),'max',(i + 1) * perpage),'page',i + 1),i + 1,pagesCount)
        }

        pager.innerHTML = out;
        TMPLRPT(pager,undefined,true)
    }

    function PAGE(content,page){
        var tmp = EL('div'),
            scr;
        tmp.innerHTML = content
        scr = GETBYCLS(content.match(/scr-[^ \"]+/)[0],tmp)[0]
        INCID(scr,page)
        SETPAGECLS(scr,page)

        return TMPLIF(scr.outerHTML,'page',page + 1);
    }

    function PGCTRLS(page, pageNum, pagesCount){
        return NEXTCTRL(PREVCTRL(page,pageNum),pageNum,pagesCount)
    }

    function NEXTCTRL(page,pageNum,pagesCount){
        if (pageNum == pagesCount){
            return TMPLVAR(page,'nextPage','last')
        } else {
            return TMPLVAR(page,'nextPage',pageNum + 1)
        }
    }

    function PREVCTRL(page,pageNum){
        if (pageNum == 2){
            return TMPLVAR(page,'prevPage','')
        } else {
            return TMPLVAR(page,'prevPage',pageNum - 1)
        }
    }

    function INCID(el,c){
        el.setAttribute('id','addr0x' + ADR(parseInt(el.getAttribute('id').replace('addr0x','')) + c))
    }

    function SETPAGECLS(page,pageNum){
        if (pageNum > 0){
            var cls = page.className.match(/scr-[^ \"\']+/)[0];
            page.className = page.className.replace(cls,cls + '-' + (pageNum + 1))
        }
    }

    function GETDB(str){
        var vars = str.split('\/'),
            out = {
                top: '',
                parent: '',
                data: ''
            }

        if (vars.length > 1){
            out.top = vars[0]
            out.parent = vars[1]
            out.data = asmDB[vars[0]][vars[1]]
        } else {
            out.top = vars[0]
            out.parent = vars[0]
            out.data = asmDB[vars[0]]
        }

        return out
    }

/*
========================= SHAREDS =================================
*/

    function SHRDS(el){
        MAP(GETBYCLS('shared'),function(e,i,a){
            SHRD(e)
        })
    }

    function SHRD(el){
        if (el.className.indexOf('%') < 0){
            var addr = el.className.match(/shr-([0-9]+)/)[1],
                sharedData = MEM(ADR(addr,'1'));

            if (sharedData){
                el.innerHTML = sharedData.innerHTML
            }
        }
    }

/*
========================= TEMPLATES =================================
*/

    function TMPLFORCE(callback){
        var i,
            forced = GETBYCLS('force-template');

        for (i = 0; i < forced.length; i++){
            TMPLS(forced[i],'',false)
        }
    }

    function TMPLS(el,data,ximg){
        if (ximg = undefined){
            ximg = true;
        }

        MAP(GETBYCLS('template',el),function(e){
            TMPL(e,data,ximg)
        })
    }

    function TMPLSLOW(str){
        var el = EL('div'),
            i,templates;

        el.innerHTML = str
        templates= GETBYCLS('template',el)

        for (i=0;i<templates.length;i++){
            str = str.replace(templates[i].outerHTML,TMPLLOW(templates[i]))
        }

        return str;
    }

    function TMPLLOW(el){
        var addr = el.className.replace(/(template| |tmpl-)/g,''),
            tmpl = MEM(ADR(addr,'2')),
            data = JSON.parse(el.getAttribute('data-vars')),out;

        out = tmpl.innerHTML
        tmpl = tmpl.cloneNode()
        tmpl.innerHTML = out

        tmpl.innerHTML = TMPLVARS(tmpl.innerHTML,data)

        return tmpl.innerHTML
    }

    function TMPL(el,data,ximg){
        var addr = el.className.replace(/(template| |tmpl-)/g,''),
            tmpl = MEM(ADR(addr,'2')),vars,out,key,
            top = '', parent = '';

        out = tmpl.innerHTML
        tmpl = tmpl.cloneNode()
        tmpl.innerHTML = out

        if (ximg == undefined){
            ximg = true
        }

        if (tmpl){
            if (el.innerHTML == '$item'){
                vars = data
            } else if (el.getAttribute('data-vars')) {
                vars = JSON.parse(el.getAttribute('data-vars'))
            }else {
                vars = GETDB(el.innerHTML)
                parent = vars.parent
                top = vars.top
                vars = vars.data
            }

            TMPLRPT(tmpl,vars)

            for (key in vars){
                tmpl.innerHTML = TMPLIF(tmpl.innerHTML,key,vars[key])
            }

            tmpl.innerHTML = TMPLVAR(tmpl.innerHTML,'parent',parent)
            tmpl.innerHTML = TMPLVAR(tmpl.innerHTML,'top',top)
            tmpl.innerHTML = TMPLVAR(tmpl.innerHTML,'timestamp',new Date().getTime())

            if (!(vars instanceof Array)){
                var i;
                for (key in vars){
                    tmpl.innerHTML = TMPLVAR(tmpl.innerHTML,key,vars[key])
                }
            }

            el.className = el.className.replace('template','templed')

            if (tmpl.innerHTML.match(/ximg/g)){
                D('Images added:', tmpl.innerHTML.match(/ximg/g).length)
            }

            if (ximg){
                el.innerHTML = tmpl.innerHTML.replace(/ximg/g,'img');
            } else {
                el.innerHTML = tmpl.innerHTML
            }

            if (el.getAttribute('data-vars')){
                el.innerHTML = TMPLVARS(el.innerHTML,JSON.parse(el.getAttribute('data-vars')))
            }
        }
    }

    function TMPLRPT(tmpl,vars){
        var repeats = GETBYCLS('repeat',tmpl),
            i,j,key,iTmpl,item,
            min, max, items = '';

        for (i = 0; i < repeats.length; i++){
            items = ''
            iTmpl = repeats[i].innerHTML;

            if (vars == undefined){
                if (repeats[i].getAttribute('data') == undefined){
                    ERR('033',repeats[i].className)
                    break;
                } else {
                    vars = GETDB(repeats[i].getAttribute('data')).data
                }
            }

            min = parseInt(repeats[i].className.indexOf('min-') > -1 ? repeats[i].className.match(/min-([0-9]+)/)[1] : 0);
            max = parseInt(repeats[i].className.indexOf('max-') > -1 ? repeats[i].className.match(/max-([0-9]+)/)[1] : vars.length);

            max = Math.min(max,vars.length)

            for (j = min; j < max; j++){
                item = iTmpl

                if (item.indexOf('%template') > -1){
                    item = PUTTMPL(item)
                }

                if (item.indexOf('subtemplate') > -1){
                    item = item.replace(/subtemplate/g,'template')
                }

                for (key in vars[j]){
                    item = TMPLVAR(TMPLIF(item,key,vars[j][key]),key,vars[j][key])
                }

                items += TMPLVAR(TMPLVAR(item,'sindex',j),'index',ZRS(j,3))
            }
            repeats[i].innerHTML = items
            //repeats[i].className = repeats[i].className.replace('repeat','repeated')
        }
    }

    function PUTTMPL(str){
        var addrs = str.match(/%template-[0-9]+%/gi),i,tmp;

        for (i = 0; i < addrs.length; i++){
            tmp = addrs[i];
            addrs[i] = [];
            addrs[i][0] = tmp;
            addrs[i][1] = /template-([0-9]+)/.exec(tmp)[1];
        }

        for (i = 0; i < addrs.length; i++){
            str = str.replace(addrs[i][0],MEM(ADR(addrs[i][1],'2')).innerHTML);
        }

        return str
    }

    function TMPLIF(str,key,val){
        var temp = EL('div'),
            toR, toS, i;

        temp.innerHTML = str
        toR = (val ? 'if-not-' + key : 'if-' + key)
        toS = (val ? 'if-' + key : 'if-not-' + key)

        MAP(GETBYCLS(toR,temp),function(e){
            e.parentNode.removeChild(e)
        })

        if (typeof val == 'number' || typeof val == 'string'){
            toR = 'if-' + key + '-not-' + val
            toS = 'if-' + key + '-' + val

            MAP(GETBYCLS(toR,temp),function(e){
                e.parentNode.removeChild(e)
            })

            MAP(temp.querySelectorAll('[class^=if-' + key + ']'),function(e){
                if (!e.className.match(toS) && !e.className.match(new RegExp('if-' + key + '-not-' + '[^-]+'))){
                    e.parentNode.removeChild(e)
                }
            })
        }

        return temp.innerHTML.replace(new RegExp(' ?if(-not)?-' + key + '((-not)?-[^\\\'\\\"]+)? ?','g'),'');
    }

    function TMPLVAR(str,key,val){
        return str.replace(new RegExp('%' + key + '%','g'),val)
    }

    function TMPLVARS(str,arr){
        for (key in arr){
            str = TMPLVAR(str,key,arr[key])
        }

        return str;
    }

/*
========================= ALERTS =================================
*/

    var ALRT = {
        visible: false,
        init: function(){
            STLS(sysAlert,{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: 'auto',
                display: 'none'
            })

            sysAlert.className = 'sysAlert'
            ALRT.append()

            return {
                show: ALRT.show,
                hide: ALRT.close
            }
        },
        append: function(){
            $screen ? $screen.appendChild(sysAlert) : setTimeout(ALRT.append,0)
        },
        show: function(color,data,callback,onshow){
            if (!CHOF(sysAlert,$screen)){
                ALRT.append()
            }

            if (!ALRT.visible){
                ALRT.visible = true
                onshow()
                setTimeout(function(){
                    sysAlert.style.backgroundColor = color
                    sysAlert.innerHTML = data
                    sysAlert.style.display ='block'

                    if (callback){
                        if (GETBYID('sys-continue')){
                            GETBYID('sys-continue').addEventListener('click',function(e){
                                e.preventDefault()
                                callback()
                            })
                        }
                    }
                },100)
            } else {
                setTimeout(function(){
                    ALRT.show(color,data,callback,onshow)
                },100)
            }
        },
        close: function(){
            sysAlert.style.display = 'none'
            ALRT.visible = false
        }
    }

/*
========================= ERRORS =================================
*/

    /*  Error codes (memory 0x9xyzzzzz)
        XYZ[Z+]
        X - type (0 - system, 1 - data, 2 - graphics)
        Y - state (0 - unknown/info, 1 - warning, 2 - error, 3 - critical)
        Z - code
    */

    function ERR020(img,callback){
        ERR('020',[img,function(){
            callback()
            ALRT.close()
        }])
    }

    function ERR021(href,callback){
        ERR('021',[href,function(){
            callback()
            ALRT.close()
        }])
    }

    function ERR030(addr){
        ERR('030',addr)
        return false;
    }

    function ERR031(obj){
        ERR('031',obj.innerHTML)
        return false;
    }

    function ERR032(){
        ERR('032','0')
        return false;
    }

    function ERR(code,data){
        if (document.body.className.indexOf('critical') < 0){
            ERRSHW(ERRTYPE(new ERROBJ(code.toString(),data)))
        }
    }

    function ERROBJ(code,data){
        this.data = data
        this.code = code
        this.type = code[0]
        this.state = code[1]
        this.num = code[2]
        this.string = ''
        this.message = systemMessages[this.state]
        this.bg = ERRBG(this.state)
        this.msg = function(){
        return " \
            <h1>Error was occured</h1><br/> \
            <p>Was catched a following error:<br/> \
            " + this.code + ': ' + this.string + "<br/><br/> \
            " + this.message
        }
    }

    function ERRSHW(err){
        D('Error: (' + err.code + ') ' + err.string);
        if (err.state > 2){
            ERRFTL(err)
        } else {
            ERRALRT(err)
        }
    }

    function ERRFTL(err){
        $screen.style.backgroundColor = err.bg
        $screen.innerHTML = err.msg()
        document.body.className = document.body.className + ' critical'
        SYSSND(err.state)
        HALT = true
    }

    function ERRALRT(err){
        if (err.data instanceof Array){
            ALRT.show(err.bg,err.msg(),err.data[1],function(){
                SYSSND(err.state)
            })
        } else {
            ALRT.show(err.bg,err.msg(),'',function(){
                SYSSND(err.state)
            })
        }
    }

    function ERRTYPE(err){
        if (err.type < 1) {
            return SYSERR(err);
        } else {
            return DEFERR(err);
        }
    }

    function SYSERR(err){
        if (err.state == '2'){
            err.string = systemErrors[2][err.num].replace(/%data%/,err.data[0])
        } else {
            err.string = systemErrors[err.state][err.num].replace(/%addr%/,ADR(err.data))
        }
        return err;
    }

    function DEFERR(err){
        var errd = MEM(ADR(err.code,'9'));
        if (errd){
            return ERRDEF(errd,err)
        }
    }

    function ERRUNK(err){
        err.state = '0'
        err.string = 'Message: ' + err.data
        return err;
    }

    function ERRDEF(errd,err){
        if (err.data instanceof Array){
            GETBYTAG('span',errd)[0].innerHTML = err.data[0]
        } else {
            GETBYTAG('span',errd)[0].innerHTML = err.data
        }
        err.string = errd.innerHTML
        return err;
    }

    function ERRBG(state){
        switch (state){
            case '3':
                return '#c74f1d';
            case '2':
                return '#a3484d';
            case '1':
                return '#fda63f';
            case '0':
            default:
                return '#008894';
        }
    }

/*
========================= SYSTEM =================================
*/

    function SND(addr){
        PLY(MEM(ADR(addr,'3')))
    }

    function SYSSND(index){
        PLY(systemSounds[index])
    }

    function PLY(snd){
        if (snd && soundEnabled){
            snd.pause()
            snd.currentTime = 0
            snd.play()
        }
    }

    function MEM(addr){
        addr = ADR(addr)
        D('Accessing 0x' + addr);
        return CHKMEM(addr)
    }

    function CHKMEM(addr){
        var el = GETMEM(addr)
        if (el == undefined){
            ERR030(addr)
            return false;
        } else {
            return el;
        }
    }

    function CHKADR(el){
        if (el == null){
            ERR032()
            return false
        } else if (el.getAttribute('id') == ''){
            ERR031(el)
            return false
        } else {
            return el
        }
    }

    function GETMEM(addr){
        return GETBYID('addr0x' + addr)
    }

    function POPADR(el){
        if (CHKADR(el)){
            return parseInt(el.getAttribute('id').replace('addr0x',''))
        }
    }

    function ADR(addr,prefix){
        if (prefix !== undefined){
            return ADRPRFX(addr.toString(),prefix)
        } else {
            return ADRSMPL(addr.toString())
        }
    }

    function ADRPRFX(addr,prefix){
        addr = ZRS(addr, ADR_LENGTH - 1)
        return prefix + addr;
    }

    function ADRSMPL(addr){
        return ZRS(addr,ADR_LENGTH)
    }

    function WAIT(callback,timeout){
        if (timeout == undefined){
            timeout = 1000;
        }

        setTimeout(function(){
            callback.apply(this,arguments)
        },timeout)
    }

    function MAP(arr,callback){
        if (arr){
            for (var i = 0; i < arr.length; i++){
                callback(arr[i],i,arr)
            }
        }
    }

    function MAPRET(arr,callback){
        var out = [];
        if (arr){
            for (var i = 0; i < arr.length; i++){
                out[i] = callback(arr[i],i,arr)
            }
        }
        return out;
    }

/*
========================= TOOLS ==================================
*/

    //Shorhand for console.log
    function D(){
        console.log.apply(console,arguments)
    }

    //Leading zeros
    function ZRS(num,count){
        while(num.toString().length < count){
            num = '0' + num;
        }
       
        return num;
    }

    function TOARR(collection){
        return Array.prototype.slice.call(collection)
    }

    //Apply style set to an element
    function STLS(el,styles){
        for (var s in styles){
            if (el.style.hasOwnProperty(s)){
                el.style[s] = styles[s]
            }
        }
    }

    //Refresh img element
    function IMGRFR(img){
        img.src = img.src
    }

    //Check if c is child of p
    function CHOF(c,p){while((c=c.parentNode)&&c!==p);return !!c}

    //Replace ximg placeholders with img elements
    function XIMG(ximg){
        var img = document.createElement('img'),i,attr;

        for(i = 0; i < ximg.attributes.length; i++){
            img.onerror = ximg.onerror
            img.onload = ximg.onload
            attr = ximg.attributes[i]
            if (attr.nodeValue.indexOf('%') < 0){
                img.setAttribute(attr.nodeName,attr.nodeValue)
            }
        }

        if (ximg.parentNode){
            ximg.parentNode.insertBefore(img,ximg)
            ximg.parentNode.removeChild(ximg)
        }

        return img;
    }

    function IFEL(el){
        return el || document;
    }

    function GETBYID(id){
        return document.getElementById(id)
    }

    function GETBYCLS(cls,el){
        return IFEL(el).getElementsByClassName(cls)
    }

    function GETBYTAG(tag,el){
        return IFEL(el).getElementsByTagName(tag)
    }

    function EL(tag){
        return document.createElement(tag)
    }

    //Add listeners to created elements by tag
    function LSTNTAG(tag,evType,callback){
        document.addEventListener("DOMNodeInserted", function(e){
            if (e.target.tagName == tag.toUpperCase()){
                e.target.addEventListener(evType,callback)
            }
        }, false)
    }

    //Add listeners to created elements by class
    function LSTNCLS(cls,evType, callback){
        document.addEventListener("DOMNodeInserted", function(e){
            if (e.target.className){
                if (e.target.className.indexOf(cls) > -1){
                    e.target.addEventListener(evType,callback)
                }
            }
        }, false)
    }
})()