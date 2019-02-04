function Controller(){
    this.el='#canv';
    let platform={
        _data:{
            snakes:new Array(),//这是个snake实例的数组
            foods:new Array(),//这是个food实例的数组
            wall:new Array(),
            pixels:new Array(25*25).fill(0),//0表示空，1表示蛇,2表示食物,3表示墙或障碍物
            isPause:true,
        },
        config:{
            canv:document.querySelector(el),
            box:canv.getContext('2d'),
            color:{
                canvasBackGround:'snow',
                pixelBackGround:'snow',
            },
            text:{
                button:{
                    continue:"CONTINUE",
                    stop:"STOP",
                }
            },
            parameter:{
                size:480,//canvas的宽度和长度
                cellNum:20,//canvas 中一行的格子数
                edgeSize:-0.0001,//格子间的缝的大小
            },
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
                let {pixels}=this._data;
                let {
                    canvColor:canvasBackGround,
                    pixelColor:pixelBackGround,
                }=this.config.color;
                let {canv}=this.config;
                canv.style.backgroundColor=canvColor;
                pixels.forEach(function(value){
                    draw(value,pixelColor);
                })
            }.bind(this),1);
        },
        update:function(){
            //根据isPause的真假值，判断是否更新，若更新 ， setTimeOut，则根据遍历snake的move()，修改pixels,再根据food的position是否为null，createFood()
            setInterval(function(){
                if(!this._data.isPause){
                    let {snakes,foods,wall,pixels,isPause} = this._data;
                    snakes.map(function(val){
                        val.map(function(value){
                            pixels[value]=1;
                        });
                    });
                    foods.map(function(val){
                        val.map(function(value){
                            pixels[value]=2;
                        });
                    });
                    wall.map(function(val){
                        val.map(function(value){
                            pixels[value]=3;
                        });
                    });
                    this._data.pixels=pixels;
                    snakes.map(function(val,index){
                        val.move();
                        if(pixels[val._data.head]===3){
                            this._data.isPause=true;
                            val._data.alive=false;
                        }
                        else if(pixels[val._data.head]===2){
                            val._data.score++;
                            //对speed进行修改
                        }
                    })
                }
            }.bind(this),1);
        },//需要在update函数中移动蛇，并进行判断
        listen:function(){
            //
        }
    };
    let netController={
        //负责网络部分
    };
    function pause(){
        //调整platform._data.isPause;
        this.platform._data.isPause=!this.platform._data.isPause;
    };
    function Food(){
        this.position=null;
        let init=function(){
            setInterval(function createFood(forbidden){
                if(this.position===null||this.position===undefined){
                    let randPosition=null;
                    while(forbidden.indexOf(randPosition)!==-1){
                        randPosition=(~~(Math.random()*1000)%(cellNum*cellNum-2));;
                    }
                    this.position=randPosition;
                }
            }.bind(this),1);
        }
        return{
            position:this.position,
            init:init,
        }
    };
    function Snake(){
        //返回一个Snake类
        this._data={
            score:0,
            body:new Array(),
            length:null,
            head:null,
            direction:null,//可能的值为'up','down','left','right'
            speed:1000,
            alive:true,
        }
        function move(){
            let {body,length,head,direction} = this._data;
            body.pop();
            let cellNum=config.parameter.cellNum;
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
            this._data={body,length,head,direction};
        }
        function autoMove(){
            let t=setTimeout(function(){
                move();
                t=setTimeout(autoMove.bind(this),this._data.speed);
            }.bind(this),this._data.speed);
        }
        return {
            move:move,
            _data:this._data,
        }
    };
    return{
        //返回一个类
        el:this.el,
        platform:platform,
        pause:pause,
    }
}