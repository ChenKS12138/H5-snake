const express=require('express');
const bodyParser=require('body-parser');
const app=express();

let cache=[];
let time=function(){
    let date=new Date();
    return date.getTime();
}
function partiallyIdentical(arr1,arr2){
    let sum=[...arr1,...arr2];
    let res=0;
    sum.map(function(val,index,arr){
        if(arr.lastIndexOf(val)!==index){
            res=1;
        }
    }.bind(this));
    return res;
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

//ret 200房间正常有两个人  201 参数错误   202 房间只有一个人 203 房间已满

app.use('/',function(req,res){
    if(req.body!=={}&&req.body.rid!==null&&req.body.rid!==undefined){
        let tempSnake={
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
        let rid=req.body.rid;
        let foods=req.body.foods;
        let foodsColor=req.body.foodsColor;
        if(cache.length===0){
            cache.push({
                rid:rid,
                timeStamp:time(),
                players:[tempSnake],
                foods:foods,
                foodsColor:foodsColor,
            });
        }
        let ridList=cache.map(function(val){ return val.rid});
        let ridIndex=ridList.indexOf(rid);
        if(ridIndex!==-1){
            let idList=cache[ridIndex].players.map(function(val,index){return val.id}.bind(this));
            let idIndex = idList.indexOf(tempSnake.id);
            if(idIndex!==-1){
                cache[ridIndex].timeStamp=time();
                cache[ridIndex].players[idIndex]=tempSnake;
                if(partiallyIdentical(cache[ridIndex].foods,foods)&&foods.indexOf('-1')===-1){                    
                    cache[ridIndex].foods=foods;
                    cache[ridIndex].foodsColor=foodsColor;
                }
            }
            else if(cache[ridIndex].players.length <= 2){
                cache[ridIndex].timeStamp=time();
                cache[ridIndex].players.push(tempSnake);
                if(partiallyIdentical(cache[ridIndex].foods,foods)&&foods.indexOf(-1)===-1){
                    cache[ridIndex].foods=foods;
                    cache[ridIndex].foodsColor=foodsColor;
                }
            }
            if(cache[ridIndex].players.length!==2){
                res.json({
                    ret:202,
                    data:null,
                });
            }
            else{
                res.json({
                    ret:200,
                    data:{
                        snake:cache[ridIndex].players[1-idIndex],
                        foods:cache[ridIndex].foods,
                        foodsColor:cache[ridIndex].foodsColor,
                    },
                });
                console.log(cache);
            }
        }
        else{
            cache.push({
                rid:rid,
                timeStamp:time(),
                players:[tempSnake],
                foods:foods,
                foodsColor:foodsColor,
            });
            res.json({
                ret:202,
                data:null,
            });
        }
        
    }
    else{
        res.json({
            ret:201,//参数补全或参数非法  rid不正确
        })
    }
})
let server=app.listen(8080);

// setInterval(function manageCache (){
//     cache.forEach(function(value,index){
//         if(value!==undefined&&(time() - parseInt(value.timeStamp) > 5000)&&value.players.length===2){
//             cache.splice(index,1);
//         }
//     }.bind(this));
// },1);






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
//         snakeColor:'',
//         foods:[],
//         foodsColor:[]
//     }
// }