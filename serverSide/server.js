const express=require('express');
const bodyParser=require('body-parser');
const app=express();

let cache=[];
let time=function(){
    let date=new Date();
    return date.getTime();
}

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


app.use('/',function(req,res){
    if(req.body!=={}&&req.body.rid!==null&&req.body.rid!==undefined){
        if(cache.length===0){
            cache.push({
                rid:req.body.rid,
                timeStamp:time(),
                players:[
                    {
                        score:req.body.score,
                        body:req.body.body,
                        length:req.body.length,
                        head:req.body.head,
                        direction:req.body.direction,//可能的值为'up','down','left','right'
                        toDirection:req.body.toDirection,
                        speed:req.body.speed,
                        active:req.body.active,
                        id:req.body.id,
                    }
                ],
                snakeColor:req.body.color,
                foods:req.body.foods,
                foodsColor:req.body.foodsColor,
            });
        }
        cache.forEach(function(val,index,arr){
            if(req.body.rid===val.rid){
                let temp={
                    score:req.body.score,
                    body:req.body.body,
                    length:req.body.length,
                    head:req.body.head,
                    direction:req.body.direction,//可能的值为'up','down','left','right'
                    toDirection:req.body.toDirection,
                    speed:req.body.speed,
                    active:req.body.active,
                    id:req.body.id,
                };
                let snakeIndex=val.players.map(function(val){return val.id}).indexOf(req.body.id);
                if(snakeIndex===-1){
                    cache[index].players.push(temp);
                    cache[index].snakeColor.push(req.body.color);
                    cache[index].timeStamp=time();
                    cache[index].foods=req.body.foods;
                    cache[index].foodsColor=req.body.foodsColor;
                     res.json({
                         ret:205,//在该房间下新建了一个玩家
                     });
                }
                else{
                    cache[index].players[snakeIndex]=temp;
                    cache[index].snakeColor[snakeIndex]=req.body.color;
                    cache[index].timeStamp=time();
                    cache[index].foods=req.body.foods;
                    cache[index].foodsColor=req.body.foodsColor;
                     res.json({
                         ret:206,
                     });
                }//否则修改对应id的玩家的信息
            }
            else{//如果真的找不到这个房间
                if(index+1===array.length){
                    cache.push({//就来新建一个房间
                        rid:req.body.rid,
                        timeStamp:time(),
                        players:[
                            {
                                score:req.body.score,
                                body:req.body.body,
                                length:req.body.length,
                                head:req.body.head,
                                direction:req.body.direction,//可能的值为'up','down','left','right'
                                toDirection:req.body.toDirection,
                                speed:req.body.speed,
                                active:req.body.active,
                                id:req.body.id,
                            }
                        ],
                        snakeColor:req.body.color,
                        foods:req.body.foods,
                        foodsColor:req.body.foodsColor,
                    });
                    cache[index].snakeColor.push(req.body.color);
                    res.json({
                        ret:201,
                    });
                }
            }
        }.bind(this));
    }
    else{
        res.json({
            ret:202,//参数补全或参数非法  rid不正确
        })
    }
})
let server=app.listen(8080);

setInterval(function manageCache (){
    cache.forEach(function(value,index){
        if(value!==undefined&&(time() - parseInt(value.timeStamp) > 5000)&&value.players.length===2){
            cache.splice(index,1);
        }
    }.bind(this));
},1);

// cache=[
//     {
//         rid:234,
//         timeStamp:153909343,
//         players:[
//             {
//                 score:0,
//                 body:new Array(),
//                 length:3,
//                 head:null,
//                 direction:'up',//可能的值为'up','down','left','right'
//                 toDirection:'up',
//                 speed:100,
//                 active:true,
//                 id:null,
//             },
//             {
//                 score:0,
//                 body:new Array(),
//                 length:3,
//                 head:null,
//                 direction:'up',//可能的值为'up','down','left','right'
//                 toDirection:'up',
//                 speed:100,
//                 active:true,
//                 id:null,
//             },
//         ],
//         snakesColor:['red','red']
//         foods:[23],
//         foodSColor:['red'],
//     }
// ]

// postBody={
//     rid:233,
//     score:0,
//     body:new Array(),
//     length:3,
//     head:null,
//     direction:'up',//可能的值为'up','down','left','right'
//     toDirection:'up',
//     speed:100,
//     active:true,
//     id:null,
//     color:'red',
//     foods:[],
//     foodsColor:['red']
// }


// repsonse={
//     ret:200,
//     data:{
//         snake:{
//             score:0,
//             body:new Array(),
//             length:3,
//             head:null,
//             direction:'up',//可能的值为'up','down','left','right'
//             toDirection:'up',
//             speed:100,
//             active:true,
//             id:null,
//         },
//         foods:[23,56],
//         snakeColor:'red',
//         foodsColor:['red','blue'],
//     }
// }