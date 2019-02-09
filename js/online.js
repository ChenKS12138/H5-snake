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
        {
            color:'brown',
            direction:{
                click:{},
                keydown:{
                    'up':[87],
                    'down':[83],
                    'left':[65],
                    'right':[68],
                }
            },
            scoreText:document.querySelector('#score2'),
        }
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
}.bind(this),1);
let tipText=document.querySelector('#tipText');
setInterval(function(){
    switch(controller.netController._data.status){
        case 204:
            tipText.innerHTML="请输入RID";
            break;
        case 202:
            tipText.innerHTML="正在等待好友加入房间 .......";
            break;
        case 203:
            tipText.innerHTML="该房间已满";
            break;
        case 201:
            tipText.innerHTML="参数错误";
            break;
        default:
            tipText.innerHTML="";
            document.querySelector('.core').style="display:block";
            document.querySelector('#tip').style="display:none";
            // controller.pause();
            break;
    }
}.bind(this),90);
document.querySelector('#submit').addEventListener('click',function(){
    controller.netController._data.rid=document.querySelector('#key').value; 
}.bind(this));