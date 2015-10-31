var asmDB = (function(){

    var structures = {
            menu: ['title','link','external','image'],
            audio: ['title','album','mp3'],
            albums: ['id','type','title','image','description','audio','license','link'],
            art: ['id','title','image'],
            social: ['title','icon','link']
        },

        data = {
            social: {
                personal: [
                    ['About.me','L','http://vk.com/aturbidflow'],
                    ['VK','A','http://vk.com/aturbidflow'],
                    ['Twitter','B','https://twitter.com/aturbidflow'],
                    ['Facebook','C','https://www.facebook.com/iamartemwolf'],
                    ['Instagram','E','https://instagram.com/aturbidflow/'],
                    ['Pinterest','I','https://pinterest.com/aturbidflow'],
                    ['Deviantart','K','http://artemwolf.deviantart.com/']
                ],
                links: [
                    ['VK','A','http://vk.com/kubikami'],
                    ['Twitter','B','http://twitter.com/kubikami'],
                    ['Facebook','C','https://www.facebook.com/kubikami/'],
                    ['Soundcloud','J','http://soundcloud.com/kubikami/'],
                    ['Bandcamp','M','http://kubikami.bandcamp.com'],
                    ['YouTube','F','http://www.youtube.com/channel/UCJxBOSWl6jkXp3qWpBN_NpQ'],
                    ['last.fm','G','lastfm.ru/music/kubikámi']
                ]
            },
            menu: {
                index: [
                    ['About','about',false],
                    ['Music','albums',false],
                    ['Art','art',false],
                    ['Stuff','stuff',false],
                    ['Contacts','contact',false]
                ],
                art: [
                    ['Pixel Tattoo','art/tattoo',false],
                    ['GIF','art/gif',false],
                    ['Digital Art','art/digital',false],
                    ['Albums Covers','art/covers',false],
                    ['Pixelart made to&nbsp;order','art/order',false]
                ],
                stuff: [
                    ['Fonts','fonts',false],
                    ['Artfield - Lowbit Arts Festival','http://artfield.me',true]
                ],
                fonts: [
                    ['kubikami big','http://fontstruct.com/fontstructions/show/1117086',true,'/assets/images/font-big.png'],
                    ['kubikami small','http://fontstruct.com/fontstructions/show/1117060',true,'/assets/images/font-small.png']
                ]
            },
            audio: {
                zhb: [
                    ["Железобетон","zhelezobeton","audio/Zhelezobeton.mp3"]
                ],
                field: [
                    ["The Field of Art (single version)","thefieldofart","audio/thefieldofart.mp3"]
                ],
                lsq: [
                    ["Little Sleepy Quark","littlesleepyquark","audio/littlesleepyquark.mp3"]
                ],
                release: [
                    ["Release the Pain (single version)","releasethepain","audio/Release_the_Pain_Single.mp3"]
                ],
                redraven: [
                    ["The Book of the Red Raven (single version)","redraven","audio/redraven.mp3"]
                ],
                orange: [
                    ["Orange Skyline","orangeskyline","audio/orangeskyline.mp3"]
                ],
                theeye: [
                    ["The Eye","theeye","audio/theeye.mp3"]
                ],
                unicloud: [
                    ["Unicloud","unicloud","audio/unicloud.mp3"]
                ],
                polyfeel: [
                    ["Polyfeel Symphony","polyfeel","audio/polyfeel.mp3"]
                ],
                harshtag: [
                    ["The New Song","harshtag","audio/thenewsong.mp3"],
                    ["City of the Lost Children","harshtag","audio/cityofthe.mp3"]
                ],
                thegame: [
                    ["The Game Title","thegame","audio/thegametitle.mp3"],
                    ["The Game Main Theme","thegame","audio/thegametheme.mp3"]
                ],
                ost: [
                    ["v.1","thegameost","audio/thegameost1.mp3"],
                    ["v.2","thegameost","audio/thegameost2.mp3"],
                    ["v.3","thegameost","audio/thegameost3.mp3"]
                ],
                spring: [
                    ["Birds return early after the heroes. Eclipse","spring","audio/breathe.mp3"],
                    ["Your outlines unseen, rage fading away in the haze","spring","audio/yourfaith.mp3"],
                    ["But ever after life is vivifying emberseeds","spring","audio/bealive.mp3"],
                    ["Enforcing place in light or giving you embrace",'spring',"audio/epilogue.mp3"]
                ],
                wintertale: [
                    ["Snowfall",'wintertale',"audio/snowfall.mp3"],
                    ["Snowflake","wintertale","audio/snowflake.mp3"],
                    ["Wintertale","wintertale","audio/wintertale.mp3"]
                ],
                moveon: [
                    ["00:28",'moveon',false],
                    ["04:43",'moveon',false],
                    ["11:09","moveon",false],
                    ["15:13",'moveon',false],
                    ['19:17',"moveon",false]
                ],
                atf: [
                    ['Young Brave Little Prince Knight','atf','audio/YBLPK.mp3'],
                    ['Kepler-452 Ray','atf','audio/kepler452.mp3'],
                    ['flo.one (Bonus)','atf','audio/floone.mp3']
                ],
                plate: [
                    ["I've lost my license plate in the woods again","ivelostmylicenseplate","audio/licenseplate.mp3"]
                ],
                colors: [
                    ['The Field of Art','25colorsperline',false],
                    ['The Book of the Red Raven','25colorsperline',false],
                    ['The Victims of the Silence','25colorsperline',false],
                    ['For the Ages','25colorsperline',false],
                    ['Dance of Leeloo','25colorsperline',false],
                    ['Labyrinth (Oligoria cover)','25colorsperline',false],
                    ['Let There be a Flame (feat. Roman Ageev)','25colorsperline',false],
                    ['Sad Mr. Death','25colorsperline',false],
                    ['Everwinter Symphony','25colorsperline',false],
                    ['Fake You','25colorsperline',false],
                    ['The Fallen (feat. likvo)','25colorsperline',false],
                    ['In fectos de XIII','25colorsperline',false],
                    ['Release the Pain','25colorsperline',false],
                    ['Long Way Home','25colorsperline',false],
                    ['Time Traveller','25colorsperline',false],
                    ['ItMoDYSM','25colorsperline',false],
                ]

            },
            art: {
                tattoo: [
                    ['scaredeggs','Scared Eggs','/images/art/tattoo/eggs.png'],
                    ['thefall','The Fallen Lead','/images/art/tattoo/thefall.png'],
                    ['forest','Mystic Forest','/images/art/tattoo/forest.png'],
                    ['water-wave','Wave (Water Set)','/images/art/tattoo/wave.png'],
                    ['water-drop','Drop (Water Set)','/images/art/tattoo/drop.png'],
                    ['water-jellyfish','Jellyfish (Water Set)','/images/art/tattoo/jellyfish.png'],
                    ['water-whale','Whale (Water Set)','/images/art/tattoo/whale.png'],
                    ['water-octo','Octo (Water Set)','/images/art/tattoo/octo.png'],
                    ['water-poseidon','Poseidon (Water Set)','/images/art/tattoo/poseidon.png'],
                    ['zombanimals-boar','Boar (Zombanimals Set)','/images/art/tattoo/boar.png'],
                    ['zombanimals-boar','Bulldog (Zombanimals Set)','/images/art/tattoo/bulldog.png'],
                    ['zombanimals-dear','Dear (Zombanimals Set)','/images/art/tattoo/dear.png'],
                    ['zombanimals-fenech','Fenech (Zombanimals Set)','/images/art/tattoo/fenech.png'],
                    ['zombanimals-racoon','Racoon (Zombanimals Set)','/images/art/tattoo/racoon.png'],
                    ['zombanimals-zebra','Zebra (Zombanimals Set)','/images/art/tattoo/zebra.png']
                ],
                order: [
                    ['portrait','Portrait','/images/art/order/portrait.png'],
                    ['beard','Beard','/images/art/order/beard.png'],
                ],
                digital: [
                    ['angel','Angel','/images/art/digital/angel.jpg'],
                    ['demon','Demon','/images/art/digital/demon.jpg'],
                    ['myself','Myself in the parallel universe','/images/art/digital/orc.jpg'],
                    ['nightguest','Night Guest (The portarit of Immanuel)','/images/art/digital/immanuel.jpg'],
                    ['collegue','A troll','/images/art/digital/collegue.jpg'],
                    ['sadfish','Sad Blind Fish','/images/art/digital/sadfish.jpg'],
                    ['noface','Noface','/images/art/digital/noface.jpg'],
                    ['horse','A free horse','/images/art/digital/freehorse.jpg'],
                    ['computerpeople','Computer People (made for [SKILL TOYS] band)','/images/art/digital/comppeople.jpg']
                ],
                gif: [
                    ['scene','Look at me, I`m a star!','/images/art/gifs/scene.gif']
                ]
            },
            albums: [
                [
                    "ivelostmylicenseplate",
                    "Single",
                    "I've lost my license plate in the woods again",
                    "images/albums/single/plate.jpg",
                    "<p>Single in the style of debut LP.</p>",
                    "plate",
                    true,
                    'ive-lost-my-license-plate-in-the-woods-again-single'
                ],
                [
                    "atf",
                    "EP",
                    "A Turbid Flow",
                    "images/albums/ep/atf.jpg",
                    "<p>Clean NES chiptune, no mastering.</p>",
                    "atf",
                    true,
                    'a-turbid-flow'
                ],
                [
                    "moveon",
                    "LP",
                    "Move On!",
                    "images/albums/lp/moveon.jpg",
                    "<p>ICM / Post-chiptune release. Featuring <a href='http://vk.com/dy_dx_music' target='_blank'>dy dx</a>.</p>",
                    "moveon",
                    true,
                    'move-on'
                ],
                [
                    "spring",
                    "EP",
                    "Somehow, people are Irrational & Gorgeous",
                    "/images/albums/ep/spring.jpg",
                    "Light and springy EP.",
                    "spring",
                    true,
                    'somehow-people-are-irrational-gorgeous'
                ],
                [

                    "polyfeel",
                    "Single",
                    "Polyfeel Symphony",
                    "images/albums/single/polyfeel.png",
                    "<p>Was written in PixiTracker on the HTC One S. Limits was: only «Orchestra-like» samples.</p>",
                    "polyfeel",
                    true
                ],
                [
                    "unicloud",
                    "Single",
                    "Unicloud",
                    "images/albums/single/unicloud.png",
                    "<p>Was written in PixiTracker on the HTC One S.</p>",
                    "unicloud",
                    true
                ],
                [
                    "theeye",
                    "Single",
                    "The Eye",
                    "images/albums/single/theeye.png",
                    "<p>Was written in PixiTracker on the HTC One S. Polyphony was limited to four sounds at the same time.</p>",
                    "theeye",
                    true
                ],
                [
                    "wintertale",
                    "EP",
                    "Wintertale",
                    "/images/albums/ep/wintertale.png",
                    "Cold and angry winter EP.",
                    "wintertale",
                    false,
                    'wintertale'
                ],
                [
                    "thegame",
                    "Single",
                    "The Game OST",
                    "images/albums/ep/thegame.png",
                    "<p>Two tracks for not-published-and-never-be-published mobile game.</p>",
                    "thegame",
                    true
                ],
                [
                    "thegameost",
                    "EP",
                    "The Game Soundtrack",
                    "images/albums/nocover.png",
                    "<p>They paid me money but didn't take the sounds.</p>",
                    "ost",
                    false
                ],
                [
                    "25colorsperline",
                    "LP",
                    "25 Colors Per Line",
                    "/images/albums/lp/25colorsperline.png",
                    "Debut longplay. Chiprock.</p>",
                    "colors",
                    true,
                    '25-colors-per-line'
                ],
                [
                    "redraven",
                    "Single",
                    "The Book of the Red Raven",
                    "images/albums/single/redraven.png",
                    "<p>Single from chiptune-rock album, variation of the title theme of my quest game with similar name.</p>",
                    "redraven",
                    true,
                    "the-book-of-the-red-raven-single"
                ],
                [
                    "releasethepain",
                    "Single",
                    "Release the Pain",
                    "images/albums/single/releasethepain.png",
                    "<p>Trying to mix NES &amp; rock. Part 2.</p>",
                    "release",
                    true,
                    'release-the-pain-single'
                ],
                [
                    "orangeskyline",
                    "Single",
                    "Orange Skyline",
                    "images/albums/single/orangeskyline.jpg",
                    "<p>Was written in PixiTracker on the RoverPad Tesla 10.1 =)</p>",
                    "orange",
                    true
                ],
                [
                    "thefieldofart",
                    "Single",
                    "The Field of Art",
                    "images/albums/single/thefieldofart.png",
                    "<p>Trying to mix NES &amp; rock. Part 1.</p>",
                    "field",
                    true,
                    'the-field-of-art-single'
                ],
                [
                    "zhelezobeton",
                    "feat",
                    "Железобетон",
                    "images/albums/feat/zhelezobeton.jpg",
                    "<p>Andrey Kan (<a href='http://vk.com/doublesoundvrn' target='_blank'>Double Sound</a>) feat Artem Wolf (kubikámi, <a href='http://vk.com/tengokunoame' target='_blank'>tengokunoame</a>)</p>",
                    "zhb",
                    false
                ],
                [
                    "littlesleepyquark",
                    "Single",
                    "Little Sleepy Quark",
                    "images/albums/single/lsq.jpg",
                    "<p>Pst-rck.</p>",
                    "lsq",
                    true
                ],
                [
                    "harshtag",
                    "EP",
                    "#harshtag",
                    "images/albums/ep/harshtag.jpg",
                    "<p>Just experiments with electronic sound, nothing more.</p>",
                    "harshtag",
                    true
                ]
            ]
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