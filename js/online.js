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
let lastStatus=null;
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
        case 200:
            tipText.innerHTML="";
            document.querySelector('.core').style="display:block";
            document.querySelector('#tip').style="display:none";
            // if(lastStatus!==200){
            //     setTimeout(function(){
            //         Materialize.toast('3',500,'',function(){
            //             Materialize.toast('2',500,'',function(){
            //                 Materialize.toast('1',500,'',function(){
            //                     Materialize.toast('开始',500,'',function(){
            //                         controller.pause();
            //                     });
            //                 });
            //             });
            //         });
            //     }.bind(this),300);
            // };
            //TODO 发行版记得把上面注释的代码恢复
            break;
    }
    lastStatus=controller.netController._data.status;
}.bind(this),90);
document.querySelector('#submit').addEventListener('click',function(){
    controller.netController._data.rid=document.querySelector('#key').value; 
}.bind(this));

Vue.component("colors",{
    props:['item'],
    template:"<div class='color-item' v-bind:titile='item.text' v-bind:id='item.id' v-bind:class='{shadow:item.chosen}' v-bind:style='{backgroundColor:item.value}'></div>"
});

let palette=new Vue({
    el:'#palette',
    data:{
        notice:"请选择一个颜色",
        // currentColor:null,
        colors:[
            {
                value:'#008B00',
                chosen:true,
                text:'绿色',
                id:1,
            },
            {
                value:'brown',
                chosen:false,
                text:'棕色',
                id:2,
            },
            {
                value:'teal',
                chosen:false,
                text:'鸭绿色',
                id:3,
            },
            {
                value:'yellow',
                chosen:false,
                text:'黄色',
                id:4,
            },
            {
                value:'orange',
                chosen:false,
                text:'橙色',
                id:5,
            }
        ],
    },
    computed:{
        currentColor:function(){
            let chosenList = this.colors.map(function(val){return val.chosen});
            let res =  this.colors[chosenList.indexOf(true)].value;
            return res;
        }
    },
    methods: {
        changeColor:function(){
            console.log(this);
        }
    },
});
NodeList.prototype.map=Array.prototype.map;
let items=document.querySelectorAll('.color-item');
items.map(function(val,index){
    val.addEventListener('click',function(){
        let id=this.id;
        palette.colors=palette.colors.map(function(val){val.chosen=false; return val});
        palette.colors[id-1].chosen=true;
        controller.platform._data.snakes[0]._data.color=palette.currentColor;
    })
}.bind(this));