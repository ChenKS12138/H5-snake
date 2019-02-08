function Controller(Config={
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
            scoreText:document.querySelector('#score'),
        },
        // {
        //     color:'red',
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
    online:false,
}){
    let el=Config.el;
    let cellNum=Config.parameter.cellNum;

    this.platform={
        _data:{
            snakes:new Array(),//这是个snake实例的数组
            foods:new Array(),//这是个food实例的数组
            wall:new Array(),
            pixels:new Array(cellNum*cellNum).fill(0),//0表示空，10+表示蛇,20+表示食物,30表示墙或障碍物
            isPause:false,
        },
        config:{
            canv:document.querySelector(el),
            box:canv.getContext('2d'),
            color:{
                canvasBackGround:'snow',
                pixelBackGround:'snow',
                snakesColor:[],
                foodsColor:[],
            },
            // text:{
            //     button:{
            //         continue:"CONTINUE",
            //         stop:"STOP",
            //     }
            // },
            parameter:Config.parameter,
        },
        draw:function(point,color){
            let {box}=this.config;
            let {cellNum,size,edgeSize} = this.config.parameter;

            box.fillStyle=color;
            box.fillRect((point%cellNum)*(size/cellNum)+1,(~~(point/cellNum))*(size/cellNum)+edgeSize,(size/cellNum)-2*edgeSize,(size/cellNum)-2*edgeSize);
        },
        render:function(){
            setInterval(function(){
                    let {pixels}=this._data;
                    let {
                        canvasBackGround,
                        pixelBackGround,
                        snakesColor,
                        foodsColor,
                    } = this.config.color;
                    let {canv}=this.config;
                    canv.style.backgroundColor=canvasBackGround;
                    canv.width=Config.parameter.size;
                    canv.height=Config.parameter.size;
                    pixels.forEach(function(value,index){
                        if(value===0){
                            this.draw(index,pixelBackGround);
                        }
                        else if(value>29){
                            this.draw(index,'#CD8500');//这是墙 
                        }
                        else if(value>19){
                            this.draw(index,foodsColor[value-20]);
                        }
                        else if(value>9){
                            this.draw(index,snakesColor[value-10])
                        }
                    }.bind(this));
                    Config.snakes.map(function(val,index){
                        val.scoreText.innerText='SCORE:'+this._data.snakes[index]._data.score;
                    }.bind(this));
            }.bind(this),1);
        },
        update:function(){
            //根据isPause的真假值，判断是否更新，若更新 ， setTimeOut，则根据遍历snake的move()，修改pixels,再根据food的position是否为null，createFood()
            setInterval(function(){
                let ojbk=true;
                if(!this._data.isPause){
                    let {snakes,foods,wall} = this._data;
                    pixels=new Array().fill(0);
                    wall.map(function(val){
                        pixels[val]=30;
                    }.bind(this));
                    foods.map(function(val,index){
                        pixels[val.position]=20+index;
                    }.bind(this));
                    snakes.map(function(val,index){
                        if(pixels[val._data.head]===30){
                            this._data.isPause=true;
                            val._data.active=false;
                            val._data.body.map(function(value){
                                pixels[value]=10+index;
                            }.bind(this));
                            pixels[val._data.head]=30;
                            Materialize.toast('HAHAH游戏结束,撞到墙了',2000);
                            ojbk=false;
                        }
                        else if(pixels[val._data.head]>19&&pixels[val._data.head]<30){
                            val._data.score++;
                            this._data.foods[pixels[val._data.head]-20].position=null;
                            this._data.snakes[index]._data.speed *= 0.97 ;
                            val.getLonger();
                            Materialize.toast(randomElement([
                                '得分啦!',
                                '加油鸭!',
                                '太棒啦!',
                            ]),2000);
                        }
                        else{
                            val._data.body.map(function(value){
                                pixels[value]=10+index;
                            }.bind(this));
                        }
                    }.bind(this));
                    snakes.map(function(val,index){
                        if(val._data.body.lastIndexOf(val._data.head)!==0){
                            this._data.isPause=true;
                            val._data.active=false;
                            Materialize.toast('HAHAH游戏结束,撞到自己了',2000);
                            ojbk=false;
                        }
                    }.bind(this));
                    if(ojbk){
                        this._data.pixels=pixels;
                    }
                }
            }.bind(this),1);
        },//需要在update函数中移动蛇，并进行判断
    };

    this.netController={
        //负责网络部分
        _data:{
            work:true,
            status:202,//约定 200为服务器端有该房间且有对手的信息，201为进入房间尚无对手，202为未进入房间
            sendData:{},
            rid:null//此处的rid需要用户自行生成，
        },
        serverPath:'http://127.0.0.1:8080',
        bindData:function(){
            setInterval(function(){
                let {score,body,length,head,direction,toDirection,speed,active,id} =this.platform._data.snakes[0]._data;
                let color=this.platform.config.color.snakesColor[0];
                let foods=this.platform._data.foods.map(function(val){return val.position});
                let foodsColor=this.platform.config.color.foodsColor;
                this.netController._data.sendData={
                    score:score,
                    body:body,
                    head:head,
                    direction:direction,
                    toDirection:toDirection,
                    length:length,
                    speed:speed,
                    active:active,
                    id:id,
                    color:color,
                    foods:foods,
                    foodsColor:foodsColor,
                };
                this.netController._data.sendData.rid=this.netController._data.rid;
                if(this.netController._data.status===206||this.netController._data.status===205){
                    // this.pause();
                }
            }.bind(this),1);
        }.bind(this),
        connect:function(){
            if(this._data.work){
                $.post(this.serverPath,this._data.sendData,function(data,status){
                    this._data.status=data.ret;
                    if(data.ret===202){
                        Materialize.toast('参数非法',2000);
                    }
                    else if(data.ret===208){
                        Materialize.toast('该房间已满',2000);
                    }
                    else if(data.ret===201||data.ret===207){
                        Materialize.toast('成功加入该房间',2000);
                    }
                    else if(data.ret===206||data.ret===205){
                        this.checkData(data.data);
                    }
                    setTimeout(function(){
                        this.connect();
                    }.bind(this),90);
                }.bind(this));
            }
        },
        checkData:function(data){
            if(data){
                this.platform.config.foodsColor=data.foodsColor;
                this.platform._data.foods=this.platform._data.foods.map(function(val,index){
                    val.position=data.foods[index];
                    return val;
                }.bind(this));
                // this.platform._data.snakes.forEach(function(val,index){
                //     data.players.forEach(function(snake,ind){
                //         if(snake.id==val.id){
                //             val=snake;
                //             this.platform.config.snakesColor[index]=data.snakesColor[ind];
                //         }
                //     }.bind(this));
                // }.bind(this));
                this.platform._data.snakes[1]._data=data.snake;
                this.platform.config.color.snakesColor[1]=data.snakeColor;
            }
        }.bind(this),
    };

    (function initData(){
        Config.snakes.map(function(val,index){
            this.platform._data.wall.push(...innerPixel(cellNum));
            this.platform._data.snakes.push(new Snake([...this.platform._data.wall,...innerPixel(cellNum,1)]));
            this.platform._data.snakes[index].autoMove();
            let {up,down,left,right} = Config.snakes[index].direction.keydown;
            document.addEventListener('keydown',function(e){
                if(up.indexOf(e.keyCode)!==-1){
                    this.platform._data.snakes[index]._data.toDirection='up';
                    e.returnValue=false;
                }
                else if(down.indexOf(e.keyCode)!==-1){
                    this.platform._data.snakes[index]._data.toDirection='down';
                    e.returnValue=false;
                }
                else if(left.indexOf(e.keyCode)!==-1){
                    this.platform._data.snakes[index]._data.toDirection='left';
                    e.returnValue=false;
                }
                else if(right.indexOf(e.keyCode)!==-1){
                    this.platform._data.snakes[index]._data.toDirection='right';
                    e.returnValue=false;
                }
            }.bind(this));
            this.platform.config.color.snakesColor.push(val.color);
        }.bind(this));
        Config.foods.map(function(val,index){
            this.platform._data.foods.push(new Food([...this.platform._data.wall]));
            this.platform._data.foods[index].init();
            this.platform.config.color.foodsColor.push(val.color);
        }.bind(this));
        
        this.netController._data.work=Config.online;
    }).bind(this)();
    function innerPixel(width,offset=0){
        let res=new Array();
        for(let j=0;j<width-1-offset*2;j++){
            res.push(j+offset*(width+1),(width*(j+1)-1)*(offset+1),width*(j+1+offset)+offset,width*(width-1-offset)+j+1+offset);
        }
        return res;
    }
    function randomElement(arr){
        return arr[~~(Math.random()*10%arr.length)];
    }
    function pause(){
        //调整platform._data.isPause;
        this.platform._data.isPause=!this.platform._data.isPause;
        this.platform._data.snakes.map(function(val){
            val._data.active=!val._data.active;
        }.bind(this))
        return this.platform._data.isPause;
    };
    function Food(forbidden=[]){
        this.position=null;
        function init(){
            setInterval(function createFood(forbidden){
                if(this.position===null||this.position===undefined){
                    let randPosition=null;
                    while([...this.forbidden,null].indexOf(randPosition)!==-1){
                        randPosition=(~~(Math.random()*1000)%(cellNum*cellNum-2));
                    }
                    this.position=randPosition;
                }
            }.bind(this),1);
        }
        return{
            forbidden:forbidden,
            position:this.position,
            init:init,
        }
    };
    function Snake(forbideen=new Array()){
        //返回一个Snake类
        this._data={
            score:0,
            body:new Array(),
            length:2,
            head:null,
            direction:'up',//可能的值为'up','down','left','right'
            toDirection:'up',
            speed:100,
            active:true,
            id:null,
        };
        (function initSnake(){
            let {score,body,length,head,direction,toDirection,speed,active,id} = this._data;
            while([...forbideen,null].indexOf(head)!==-1){
                head=~~(Math.random()*1000%(cellNum*cellNum-2));
            }
            body.unshift(head);
            while(body.length!==length){
                let temp=head+randomElement([-1,1,-cellNum,cellNum]);
                if(body.indexOf(temp)===-1&&forbideen.indexOf(temp)===-1){
                    body.unshift(head=temp);
                }
            };
            // id=body.toString().split(',').join('');
            id=Math.random().toString(36).substr(2);
            this._data={score,body,length,head,direction,toDirection,speed,active,id};
        }).bind(this)();
        //TODO 这边的生成随机蛇有BUG，暂时的解决方案是减小初始长度，后期再改
        function move(){
            let {score,body,length,head,direction,toDirection,speed,active,id} = this._data;
            switch(toDirection){
                case 'up':
                    if(direction!=='down'){
                        direction=toDirection;
                    }
                    break;
                case 'down':
                    if(direction!=='up'){
                        direction=toDirection;
                    }
                    break;
                case 'left':
                    if(direction!=='right'){
                        direction=toDirection;
                    }
                    break;
                case 'right':
                    if(direction!=='left'){
                        direction=toDirection;
                    }
                    break;
            }
            body.pop();
            let cellNum=Config.parameter.cellNum;
            head=body[0];
            switch(direction){
                case 'up':
                    body.unshift(head -= cellNum);
                    break;
                case 'down':
                    body.unshift(head += cellNum);
                    break;
                case 'left':
                    body.unshift(head -= 1);
                    break;
                case 'right':
                    body.unshift(head += 1);
                    break;
            }
            this._data={score,body,length,head,direction,toDirection,speed,active,id};
        }
        function autoMove(){
            let t=setTimeout(function(){
                if(this._data.active){
                    this.move();
                }
                t=setTimeout(autoMove.bind(this),this._data.speed);
            }.bind(this),this._data.speed);
        }
        function getLonger(){
            this._data.body.push(this._data.body[this._data.body.length-1]);
        }
        return {
            move:move,
            _data:this._data,
            autoMove:autoMove,
            getLonger:getLonger,
        }
    };
    function initController(){
        this.platform.update();
        this.platform.render();
        this.netController.connect();
        this.netController.bindData();
        document.addEventListener('keyup',function(e){
            if(e.keyCode===32){
                this.pause();
                e.returnValue=false;
            }
        }.bind(this));
        setTimeout(function(){
            this.pause();
        }.bind(this),20)
    }
    return{
        //返回一个类
        el:el,
        platform:this.platform,
        pause:pause,
        netController:this.netController,
        init:initController,
        innerPixel:innerPixel,
    }
}