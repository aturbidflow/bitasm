var asmDB = (function(){

    var structures = {
            simple: ['id','title','content'],
            complex: ['id','title','content','hidden']
        },

        data = {
            simple: [
                [1,'It can be described','In two words'],
                [2,'Every element','Matches a structure']
            ],
            complex: {
                one: [
                    ['Fields can be filled with anything','No matter, what','But sometimes it should be boolean',false],
                    [4,'or something other',1,true]
                ],
                two: [
                    ['Simple', 'and complex', 'type of data tables'],
                    ['Sometimes could be','not filled.','Empty values will be filled with "false"']
                ]
            }
        }

    return fillDB();

    function fillDB(){
        var i,key,sub,st,dat,out = {};

        for (key in structures){
            st = structures[key];
            dat = data[key];

            if (dat instanceof Array){
                out[key] = [];
                for (i = 0; i < dat.length; i++){
                    out[key][i] = fillStr(st,dat[i]);
                }
            } else {
                out[key] = {};
                for (sub in dat){
                    out[key][sub] = [];
                    if (dat.hasOwnProperty(sub)){
                        for(i = 0; i < dat[sub].length; i++){
                            out[key][sub][i] = fillStr(st,dat[sub][i])
                        }
                    }
                }
            }
        }

        return out;

        function fillStr(str,dtf){
            var i,item = {};

            for (i = 0; i < str.length; i++){
                if (dtf[i] !== undefined){
                    item[str[i]] = dtf[i];
                } else {
                    item[str[i]] = false
                }
            }

            return item;
        }
    }

})()