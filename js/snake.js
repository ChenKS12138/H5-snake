function draw(point,color){
    // point 取值0-624
    //  每行有25个格子
    // 0-24 为第一行,以此类推
    box.fillStyle=color;
    box.fillRect((point%cellNum)*(size/cellNum)+1,(~~(point/cellNum))*(size/cellNum)+edgeSize,(size/cellNum)-2*edgeSize,(size/cellNum)-2*edgeSize);
}

function randomElement(arr){
    return arr[~~(Math.random()*10%arr.length)];
}


function Snake() {
    let body= new Array();//第一个元素为蛇的头
    let direction=1;// 1为向右，-1为向左，cellNum为向下，-cellNum为向上
    let live=true;
    let length=3;
    let direcList=[1,-1,cellNum,-cellNum];

    (function initialPosition(lastOne,lastDir){
        let temp;
        // let direc=direcList[~~(Math.random()*10%4)];
        let direc=randomElement(direcList);
        if(!lastOne){
            temp=~~(Math.random()*1000%(cellNum*cellNum-2));
        }
        else{
            while(direc===-lastDir){
                direc=randomElement(direcList);
            }
            temp=lastOne+direc;
        }
        if(body.length<length){
            if(!inDangerZone(temp)){
                body.unshift(temp);
                initialPosition(temp,direc);
            }
            else{
                initialPosition(lastOne,lastDir);
            }
        }
        else{
            direction=lastDir;
        }
    })()

    function move(){
        let body=this.body;
        let direction=this.direction;
        let point=body[0];
        this.pop=body.pop();
        body.unshift(point+direction);
        this.point=body[0];
        return this.pop;
    }
    function inDangerZone(target,direction){
        let point=target;
        let resc=0;
        if(point>-1&&point<cellNum){
            resc=-cellNum;
        }
        else if(point>(cellNum*cellNum-1-cellNum)&&point<cellNum*cellNum){
            resc=cellNum;
        }
        else if(point%cellNum===0){
            resc=-1;
        }
        else if((point+1)%cellNum===0){
            resc=1;
        }
        if(!direction){
            return resc; 
        }
        else{
            if(direction===resc){
                return 1;
            }
            else{
                if((point===0||point===cellNum*cellNum-cellNum)&&direction==-1){
                    return 1;
                }
                else if((point===cellNum-1||point===cellNum*cellNum-1)&&direction===1){
                    return 1;
                }
                else{
                    return 0;
                }
            }
        }
    }
    function crash(target){
        let body=this.body;
        let point=body[0];
        let direction=this.direction;
        if(inDangerZone(body[0],direction)){
            return 2;
        }
        if(body.lastIndexOf(point)!==0){
            return 1; 
        }
        else{
            if(target){
                if(target.indexOf(point)!==-1){
                    return 3;
                }
            }
            else{
                return 0;
            }
        }
    }
    function getFood(position){
        let body=this.body;
        let pop=this.pop;
        let point=body[0];
        if(position===point){
            body.push(pop);
            return 1;
        }
        else{
            return 0;
        }
    }

    return {
        body:body,
        direction:direction,
        move:move,
        crash:crash,
        getFood:getFood,
        length:length,
        live:live,
    }
}


function Food(){
    let foodExist;
    let position;
    function createFood(snakeBody,foodColor){
        foodExist=this.foodExist;
        let randPosition=(~~(Math.random()*1000)%(cellNum*cellNum-2));
        while(snakeBody.indexOf(randPosition)!==-1){
            randPosition=(~~(Math.random()*1000)%(cellNum*cellNum-2));
        }
        this.position=randPosition;
        draw(this.position,foodColor);
    }
    return{
        foodExist:foodExist,
        createFood:createFood,
        position:position,
    }
}



function Controller(configObject,isInitialize){
    const snackColor=configObject.snackColor;
    const foodColor=configObject.foodColor;
    
    let snake=new Snake();
    let food=new Food();
    let competitorController;
    let work=true;
    let score=0;
    let pop;
    let t;
    let speed=200;
    function pause(changeContent){
        if(snake.live){
            work=!work;
            if(!changeContent){
                spText.innerText=spTextContent[~~work];
            }
        }
    }
    function direction(direc){
        if(work){
            switch(direc){
                case 'up': 
                    if(snake.direction!==cellNum){
                        snake.direction=-cellNum;
                    };
                    break;
                case 'down':
                    if(snake.direction!==-cellNum){
                        snake.direction=cellNum;
                    }
                    break;
                case 'left':
                    if(snake.direction!==1){
                        snake.direction=-1;
                    }
                    break;
                case 'right':
                    if(snake.direction!==-1){
                        snake.direction=1;
                    }
                    break;
            }
        }
    }
    function Speed(value){
        if(value){
            speed=value;
        }
        return speed;
    }
    function Render(){
        draw(pop,backGroundColor);
        snake.body.map(function(value,index){
            draw(value,snackColor);
        });
    }
    function action(){
        if(work){
            if(snake.crash(competitorController.body)){
                clearTimeout(t);
                work=!work;
                snake.live=false;
                setTimeout(function(){
                    Materialize.toast('HAHAHAHAHA 你输了!', 2500,'',function(){
                        Materialize.toast('点击RESET或R以重新开始',300000);
                    });
                },200);
            }
            else{
                Render();
                pop=snake.move();
            }
            if(!food.foodExist){
                food.createFood(snake.body,foodColor);
                food.foodExist=true;
            }
            if(snake.getFood(food.position)){
                score++;
                speed=Speed(speed*0.97);
                food.foodExist=false;
                scoreText.innerText=scoreRowText+String(score);
                let toastList=['得分啦!','加油鸭!','太棒啦!'];
                Materialize.toast(randomElement(toastList), 1000);
            }
        }
        Render();
        t=setTimeout(action,Speed());        
    }
    function initialize(){
        food.foodExist=false;
        scoreText.innerText=scoreRowText+String(score);
        t=setTimeout(action,Speed());
        pause(true);
    }
    if(isInitialize){
        initialize();
    }
    function setCompetitorController(target){
        competitorController=target;
    }
    return{
        initialize:initialize,
        pause:pause,
        direction:direction,
        Speed:Speed,
        score:score,
        body:snake.body,
        foodPosition:food.position,
        setCompetitorController:setCompetitorController,
    }
}