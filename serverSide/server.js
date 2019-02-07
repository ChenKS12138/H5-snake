const express=require('express');
const bodyParser=require('body-parser');
const app=express();
let cache=[];
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
    if(req.body!=={}&&req.body.rid!=null&&req.body.rid!==undefined){
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
                                color:req.body.color,
                            };
                        cache[index].players[ind]=temp;
                        let date=new Date();
                        cache[index].timeStamp=date.getTime();
                        res.json({
                            ret:200,//成功找到房间，并成功找到自己
                            data:cache[index],
                        });
                    }
                }.bind(this));
            }
            else{
                if(index+1===array.length){
                    res.json({
                        ret:201,//未找到自己
                    })
                }
            }
        }.bind(this));
    }
    else{
        if(index+1===arr.length){
            res.json({
                ret:202,//未找到匹配的房间
            })
        }
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