const cav=document.querySelector('#cav');
const box=cav.getContext('2d');
function draw(point,color){
    // point 取值0-624
    //  每行有25个格子
    // 0-24 为第一行,以此类推
    box.fillStyle=color;
    box.fillRect((point%25)*20,(~~(point/25))*20,18,18);
}

(function ready(){
    for(let i=0;i<625;i++){
        draw(i,'#313131');
    }
})();

function Snake() {
    let body= new Array(37,36,35,);//第一个元素为蛇的头
    //point 表示蛇的头
    let direction=1;// 1为向右，-1为向左，25为向下，-25为向上
    let pop;
    let point;


    function move(){
        let body=this.body;
        let direction=this.direction;
        let point=body[0];
        this.pop=body.pop();
        body.unshift(point+direction);
        this.point=body[0];
        return this.pop;
    }
    function crash(){
        let body=this.body;
        let point=body[0];
        let direction=this.direction;
        if((direction===-25&&point>-1&&point<25)||(direction===25&&point>599&&point<625)||(direction===-1&&(point+1)%25===0)||(direction===1&&point%25===0)){
            return 2;
        }
        if(body.lastIndexOf(point)!==0){
            return 1; 
        }
        else{
            return 0;
        }
    }
    function getFood(position){
        let body=this.body;
        let pop=this.pop;
        let point=body[0];
        if(position===point){
            snake.body.push(pop);
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
    }
}
function Food(){
    let foodExist;
    let position;
    function createFood(){
        foodExist=this.foodExist;
        this.position=(~~(Math.random()*1000)%623);
        draw(this.position,'yellow');
    }
    return{
        foodExist:foodExist,
        createFood:createFood,
        position:position
    }
}


let snake=new Snake();
let food=new Food();
let score=0;

(()=>{
    food.foodExist=false;
    let pop;
    let t=setInterval(()=>{
        if(!food.foodExist){
            food.createFood();
            food.foodExist=true;
        }
        if(snake.getFood(food.position)){
            score++;
            food.foodExist=false;
        };
        
        if(snake.crash()){
            clearInterval(t);
            alert('YOU FALLED!');
        }
        
        snake.body.map((value,index)=>{
            draw(value,'#00ff00');//emm，好神奇啊为什么要+1才可以，以后再想叭
        });

        
        draw(pop,'#313131');

        pop=snake.move();
    },200);
    document.addEventListener('keydown',(e) => {
        switch(e.keyCode){
            case 38:
            case 87:
                snake.direction=-25;
                break;
            case 40:
            case 83:
                snake.direction=25;
                break;
            case 37:
            case 65:
                snake.direction=-1;
                break;
            case 39:
            case 68: 
                snake.direction=1;
                break;
        }
    })
})();
