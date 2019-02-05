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
        //     }
        // }
    ],
    foods:[
        {
            color:'#FFD700',
        },
    ]
}){
    let el=Config.el;
    let cellNum=Config.parameter.cellNum;
    this.platform={
        _data:{
            snakes:new Array(),//这是个snake实例的数组
            foods:new Array(),//这是个food实例的数组
            wall:new Array(),
            pixels:new Array(cellNum*cellNum).fill(0),//0表示空，1表示蛇,2表示食物,3表示墙或障碍物
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
            text:{
                button:{
                    continue:"CONTINUE",
                    stop:"STOP",
                }
            },
            parameter:Config.parameter,
        },
        draw:function(point,color){
            // point 取值0-624
            //  每行有25个格子
            // 0-24 为第一行,以此类推
            let {box}=this.config;
            let {cellNum,size,edgeSize} = this.config.parameter;

            box.fillStyle=color;
            box.fillRect((point%cellNum)*(size/cellNum)+1,(~~(point/cellNum))*(size/cellNum)+edgeSize,(size/cellNum)-2*edgeSize,(size/cellNum)-2*edgeSize);
        },
        render:function(){
            //根据_data的值，再调用draw(),对canv进行更新，这需要是个setInterval，不管_data.isPause的值，每隔最短的一段时间执行
            setInterval(function(){
                if(!this._data.isPause){
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
                        // this.draw(value,pixelBackGround);
                        switch(value){
                            case 0:
                                this.draw(index,pixelBackGround);
                                break;
                            case 1:
                                this.draw(index,snakesColor[0]);
                                break;
                            // case 2:
                            //     this.draw(index,snakesColor[1]);
                            //     break;
                            case 20:
                                this.draw(index,foodsColor[0]);
                                break;
                            case 30:
                                this.draw(index,'#CD8500');//这是墙    
                        }
                    }.bind(this));
                    Config.snakes.map(function(val,index){
                        val.scoreText.innerText='SCORE:'+this._data.snakes[index]._data.score;
                    }.bind(this));
                };
            }.bind(this),1);
        },
        update:function(){
            //根据isPause的真假值，判断是否更新，若更新 ， setTimeOut，则根据遍历snake的move()，修改pixels,再根据food的position是否为null，createFood()
            setInterval(function(){
                if(1){
                    let {snakes,foods,wall,pixels,isPause} = this._data;
                    pixels.fill(0);
                    wall.map(function(val){
                        pixels[val]=30;
                    }.bind(this));
                    foods.map(function(val){
                        pixels[val.position]=20;
                    }.bind(this));
                    snakes.map(function(val,index){
                        if(pixels[val._data.head]===30){
                            this._data.isPause=true;
                            val._data.active=false;
                            val._data.body.map(function(value){
                                pixels[value]=1+index;
                            }.bind(this));
                            pixels[val._data.head]=30;
                        }
                        else if(pixels[val._data.head]===20){
                            val._data.score++;
                            this._data.foods[0].position=null;
                            //对speed进行修改
                            val.getLonger();
                        }
                        else{
                            val._data.body.map(function(value){
                                pixels[value]=1+index;
                            }.bind(this));
                        }
                    }.bind(this));
                    snakes.map(function(val,index){
                        if(val._data.body.lastIndexOf(val._data.head)!==0){
                            this._data.isPause=true;
                            val._data.active=false;
                        }
                    }.bind(this));
                    this._data.pixels=pixels;
                }
            }.bind(this),1);
        },//需要在update函数中移动蛇，并进行判断
    };
    (function initData(){
        Config.snakes.map(function(val,index){
            for(let j=0;j<cellNum-1;j++){
                this.platform._data.wall.push(j,cellNum*(j+1)-1,cellNum*(j+1),cellNum*(cellNum-1)+j+1);
            }
            this.platform._data.snakes.push(new Snake([...this.platform._data.wall]));
            this.platform._data.snakes[index].autoMove();
            let {up,down,left,right} = Config.snakes[index].direction.keydown;
            document.addEventListener('keyup',function(e){
                if(up.indexOf(e.keyCode)!==-1){
                    this.platform._data.snakes[index]._data.toDirection='up';
                }
                else if(down.indexOf(e.keyCode)!==-1){
                    this.platform._data.snakes[index]._data.toDirection='down';
                }
                else if(left.indexOf(e.keyCode)!==-1){
                    this.platform._data.snakes[index]._data.toDirection='left';
                }
                else if(right.indexOf(e.keyCode)!==-1){
                    this.platform._data.snakes[index]._data.toDirection='right';
                }
            }.bind(this));
            this.platform.config.color.snakesColor.push(val.color);
        }.bind(this));
        Config.foods.map(function(val,index){
            this.platform._data.foods.push(new Food([...this.platform._data.wall]));
            this.platform._data.foods[index].init();
            this.platform.config.color.foodsColor.push(val.color);
        }.bind(this));
    }).bind(this)();
    this.netController={
        //负责网络部分
    };
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
            length:3,
            head:null,
            direction:'up',//可能的值为'up','down','left','right'
            toDirection:'up',
            speed:100,
            active:true,
            id:null,
        };
        (function initSnake(){
            let {score,body,length,head,direction,speed,active,id} = this._data;
            while([...forbideen,null].indexOf(head)!==-1){
                head=~~(Math.random()*1000%(cellNum*cellNum-2));
            }
            body.unshift(head);
            while(body.length!==length){
                head=head+randomElement([-1,1,-cellNum]);
                if(body.indexOf(head)===-1&&forbideen.indexOf(head)===-1){
                    body.unshift(head);
                }
            };
            id=body.toString().split(',').join('');
            this._data={score,body,length,head,direction,speed,active,id};
        }).bind(this)();
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
        document.addEventListener('keyup',function(e){
            if(e.keyCode===32){
                this.pause();
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
    }
}