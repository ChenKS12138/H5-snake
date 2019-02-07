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
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


app.use('/',function(req,res){
    if(req.body!=={}&&req.body.rid!==null&&req.body.rid!==undefined&&cache.length!==0){
        cache.forEach(function(val,index,arr){
            if(req.body.rid===val.rid){
                val.players.forEach(function(value,ind,array){
                    if(value.id===req.body.id){
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
                        cache[index].players[ind]=temp;
                        cache[index].snakeColor[ind]=req.body.color;
                        cache[index].timeStamp=time();
                        res.json({
                            ret:200,//成功找到房间，并成功找到自己,成功将服务器端的数据刷新
                            data:cache[index],
                        });
                    }
                    else{
                        if(ind+1===array.length){
                             res.json({
                                 ret:203,//尚未找到队友
                                 data:cache[index],
                             });
                        }
                    }
                }.bind(this));
            }
            else{
                if(index+1===array.length){
                    cache[index].players.push({
                        score:req.body.score,
                        body:req.body.body,
                        length:req.body.length,
                        head:req.body.head,
                        direction:req.body.direction,//可能的值为'up','down','left','right'
                        toDirection:req.body.toDirection,
                        speed:req.body.speed,
                        active:req.body.active,
                        id:req.body.id,
                    })
                    cache[index].snakeColor.push(req.body.color);
                    res.json({
                        ret:201,//未找到自己
                    })
                }
            }
        }.bind(this));
    }
    else{
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
        })
        res.json({
            ret:202,//参数补全或参数非法  rid不正确
        })
    }
})
let server=app.listen(8080);



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