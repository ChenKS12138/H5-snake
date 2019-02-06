const express=require('express');
const bodyParser=require('body-parser');
const app=express();
let cache=[];
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.post('*',function(req,res){
    cache.forEach(function(val,index){
        if(req.body.rid===val.rid){
            val.players.forEach(function(value,ind){
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
                    req.json({
                        ret:200,//成功找到房间，并成功找到自己
                        data:cache[index],
                    });
                }
                else{
                    req.json({
                        ret:201,//成功找到房间，到未成功找到自己
                    })
                }
            })
        }
    }.bind(this));
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
//                 color:'red',
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
//                 color:'red',
//             },
//         ],
//         foods:[23],
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