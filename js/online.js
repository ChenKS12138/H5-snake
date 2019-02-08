let controller=new Controller({
    el:'#canv',
    parameter:{
        size:480,
        cellNum:20,
        edgeSize:-0.0001
    },
    snakes:[
        {
            color:'#008B00',
            direction:{
                click:{},
                keydown:{
                    'up':[38],
                    'down':[40],
                    'left':[37],
                    'right':[39],
                },
            },
            scoreText:document.querySelector('#score1'),
        },
        // {
        //     color:'brown',
        //     direction:{
        //         click:{},
        //         keydown:{
        //             'up':[87],
        //             'down':[83],
        //             'left':[65],
        //             'right':[68],
        //         }
        //     },
        //     scoreText:document.querySelector('#score2'),
        // }
    ],
    foods:[
        {
            color:'#FFD700',
        },
        {
            color:'red',
        },
    ],//snakes与foods均有数量限制,不能超过10个
    online:true,
});
controller.init();
document.querySelector('#reset-button').addEventListener('click',function(){
    location.reload();
})
let pause=document.querySelector('#sp-button').addEventListener('click',function(){
    controller.pause();
}.bind(this));
setInterval(function(){
    if(controller.platform._data.isPause===true){
        document.querySelector('#sp-text').innerHTML='CONTINUE';
    }
    else{
        document.querySelector('#sp-text').innerHTML='PAUSE';
    }
}.bind(this),1)