
function throttle(fn,wait){
    let pre = Date.now()
    return function(){
        let now = Date.now()
        if(now - pre >= wait){
            return fn
        }
        return false
    }
}

function random(min,max){
    return Math.floor(min+Math.random()*(max-min));
}

function RequestCenter(ObjectSize_X,ObjectSize_Y){
    return [ObjectSize_X / 2, ObjectSize_Y / 2]
}

function swap(items, leftIndex, rightIndex){
    const temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}

function partition(items, left, right) {
    let pivot   = items[Math.floor((right + left) / 2)] //middle element
    let i       = left //left pointer
    let j       = right //right pointer
    while (i <= j) {
        while (items[i] < pivot) {
            i++;
        }
        while (items[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}

function quickSort(items, left, right) {
    let index;
    if (items.length > 1) {
        index = partition(items, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSort(items, index, right);
        }
    }
    return items;
}

function requestDistributionInterval(Percentags){
    function requestMedian(number){
        return Number((number / 2).toFixed(2))
    }
    let left;
    let right;
    const temp = []
    const sorterArray = quickSort(Percentags)
    for(let i = 0;i<sorterArray.length;i++){
        if(sorterArray[i] === 0){
            temp.push([1,1])
            continue
        }
        let InnerTemp = [Number((0.5 - requestMedian(sorterArray[i])).toFixed(2)),Number((0.5 + requestMedian(sorterArray[i])).toFixed(2))]
        temp.push(InnerTemp)
    }
    return temp
}

//Element 游戏元素

class Element{
    constructor(ElementTag,opt){
        this.Dom = this.createElement(ElementTag,opt)
    }
    createElement(tag, opt){
        return document.createElement(tag, opt)
    }
}

//GameObject   游戏基本对象  
class GameObject extends Element{
    #isDie
    #isShow
    constructor(X,Y,sizeX,sizeY,HP,Speed,ElementTag){
        super(ElementTag)
        this.ObjectPlace_X = X
        this.ObjectPlace_Y = Y
        this.ObjectCenter_X = X  +  sizeX / 2
        this.ObjectCenter_Y = Y  +  sizeY / 2
        this.ObjectSize_X = sizeX
        this.ObjectSize_Y = sizeY
        this.ObjectHP = HP
        this.ObjectMove_Speed = Speed
        this.#isDie = false
        this.#isShow = false
        this.GameScreen = null
    }
    MoveX(){
        this.ObjectPlace_X += this.ObjectMove_Speed
        this.Dom.style.left  = this.ObjectPlace_X
    }
    MoveNegative_X(){
        this.ObjectPlace_X -= this.ObjectMove_Speed
        this.Dom.style.left = this.ObjectPlace_X
    }
    MoveY(){
        this.ObjectPlace_Y -= this.ObjectMove_Speed
        this.Dom.style.top = this.ObjectPlace_Y
    }
    MoveNegative_Y(){
        this.ObjectPlace_Y += this.ObjectMove_Speed
        this.Dom.style.top = this.ObjectPlace_Y
    }
    setLocaltion(X,Y){
        this.ObjectPlace_X = X
        this.ObjectPlace_Y = Y
        this.Dom.style.left = this.ObjectPlace_X
        this.Dom.style.top = this.ObjectPlace_Y
    }
    getHP(){
        return this.ObjectHP
    }
    getObjectPlace_X(){
        return this.ObjectPlace_X
    }
    getObjectPlace_Y(){
        return this.ObjectPlace_Y
    }
    isDie(){
        return this.#isDie
    }
    isShow(){
        return this.#isShow
    }
    changeMoveSpeed(newSpeed){
        this.Speed = newSpeed
    }
    getDom(){
        return this.Dom
    }
    setGameScreen(GameScreen){
        this.GameScreen = GameScreen
        return this
    }
    Show(){
        if(!this.#isShow){
            this.#isShow = true
            this.GameScreen.appendChild(this.Dom)
            return true
        }
        return false
    }
    Destory(){
        if(this.#isShow){
            this.GameScreen.removeChild(this.Dom)
            return true
        }
        return false
    }
    setGameScreen(GameScreen){
        this.GameScreen = GameScreen
    }
}

class Gun extends GameObject{
    
}

class Guns{

}

class Plane extends GameObject{
    constructor(X, Y, sizeX, sizeY, HP, Speed, ShoutSpeed, PlaneImage, PlaneDestoryedImage,patherClass){
        super(X, Y, sizeX, sizeY, HP, Speed, 'img')
        this.PlaneImage = PlaneImage
        this.PlaneDieImage = PlaneDestoryedImage
        this.ShoutSpeed = ShoutSpeed
        this.PlansClass = patherClass
        this.init()
    }
    init(){
        this.Dom.src = this.PlaneImage
        this.Dom.classList.add('game-object')
        this.Dom.style.left = this.ObjectPlace_X
        this.Dom.style.top = this.ObjectPlace_Y
    }
}

class UserPlane extends Plane{
    constructor(X, Y, sizeX, sizeY, HP, Speed, ShoutSpeed,  PlaneImage, PlaneDestoryedImage){
        super(X, Y, sizeX, sizeY, HP, Speed, ShoutSpeed,  PlaneImage, PlaneDestoryedImage)
    }
    die(){
        this.Dom.src = this.PlaneDieImage
    }
}

class EnemyPlansBase{
    constructor(PlaneNumlimit){
        this.PlaneNumlimit = PlaneNumlimit
        this.Plans = []
        this.GameScreen = null
    }
    Moves(){
        for(let Plane of this.Plans){ 
            Plane.MoveNegative_Y()
        }
    }
    setGameScreen(GameScreen){
        this.GameScreen = GameScreen
    }
    generatePlane(){
        if(this.Plans.length < this.PlaneNumlimit){
            const Plane = this.createPlane()
            Plane.setGameScreen(this.GameScreen)
            Plane.Show()
            this.Plans.push(Plane)
            return true
        }
        return false
    }
    clearPlane(index){
        this.Plans.splice(index,1)[0].Destory()
    }
    clearPlaneIfOverScreen(){
        for(let Plane of this.Plans){
            if(Plane.ObjectPlace_Y > this.GameScreen.offsetHeight){
                let index = this.Plans.indexOf(Plane)
                this.clearPlane(index)
            }
        }
    }
}

class BulletBase extends GameObject{
    constructor(X,Y,sizeX,sizeY,damage,Speed,BulletImage){
        super(X,Y,sizeX,sizeY,damage,Speed,'img')
        this.BulletImage = BulletImage

        this.init()
    }
    init(){
        this.Dom.src = this.BulletImage
        this.Dom.classList.add('game-object')
        this.Dom.style.left = this.ObjectPlace_X
        this.Dom.style.top = this.ObjectPlace_Y
    }
}

class BulletsBase{
    constructor(){
        this.bullets = []
    }
    addBullet(BulletObject){
        this.bullets.push(BulletObject)
    }
    Moves(){
        for(let bullet of this.bullets){
            bullet.Move()
        }
    }
}

class Difficulty{
    constructor(difficulty,difficultyConfig){
        this.difficulty = difficulty
        this.difficultyConfig = difficultyConfig

    }
    setConfig(key,value){
        this.difficultyConfig[key] = value
    }
    getValue(key){
        return this.difficultyConfig[key]
    }
}

class UserBullet extends BulletBase{
    constructor(X,Y,sizeX,sizeY,damage,Speed,BulletImage){
        super(X,Y,sizeX,sizeY,damage,Speed,BulletImage)
    }
    Move(){
        this.MoveY()
    }
}

class UserBullets extends BulletsBase{
    constructor(delay){
        super()
        this.GameScreen = null
        this.delay = delay
        this.pre = 0
    }
    createBullet(X,Y){
        return new UserBullet(X,Y,32,32,20,15,'./asstes/image/bullet1.png')
    }
    Shout(X,Y){
        if(!this.pre){
            this.pre = Date.now()
        }
        const now  = Date.now()
        if((now - this.pre) < this.delay){
            return false
        }
        this.pre = 0
        const bullet = this.createBullet(X,Y)
        bullet.setGameScreen(this.GameScreen)
        bullet.Show()
        this.bullets.push(bullet)
        return bullet
    }
    clearBulletIfFull(){
        if(this.bullets.length > 15){
            this.bullets.shift().Destory()
            return true
        }
        return false
    }
    clearBulletIfOverScreen(){
        for(let bullet of this.bullets){
            if(bullet.ObjectPlace_Y < 0){
                this.bullets.splice(this.bullets.indexOf(bullet),1)[0].Destory()
            }
        }
        return true
    }
    setGameScreen(GameScreen){
        this.GameScreen = GameScreen
    }
}


class BigPlans extends EnemyPlansBase{
    constructor(PlaneNumlimit){
        super(PlaneNumlimit)
    }
    createPlane(){
        let plane = new Plane(random(57,this.GameScreen.offsetWidth -110,),-100,110,116,200,1,500,'./asstes/image/enemy2_fly_1.png','./asstes/image/大飞机爆炸.gif',this)
        plane.getDom().classList.add('game-bigPlane')
        return plane
    }
}

class MiddlePlans extends EnemyPlansBase{
    constructor(PlaneNumlimit){
        super(PlaneNumlimit)
    }
    createPlane(){
        return new Plane(random(25,this.GameScreen.offsetWidth - 46),-100,46,60,120,3,500,'./asstes/image/enemy3_fly_1.png','./asstes/image/中飞机爆炸.gif',this)
    }
}

class SmallPlans extends EnemyPlansBase{
    constructor(PlaneNumlimit){
        super(PlaneNumlimit)
    }
    createPlane(){
        return new Plane(random(10,this.GameScreen.offsetWidth - 24),-100,32,24,60,5,500,'./asstes/image/enemy1_fly_1.png','./asstes/image/小飞机爆炸.gif',this) //X, Y, sizeX, sizeY, HP, Speed, ShoutSpeed, PlaneImage, PlaneDestoryedImage
    }
}

class PlaneHelper{
    constructor(...Plans){

    }
}

class Game{
    constructor(difficulty){
        this.isGameOver = false
        this.isPause = false
        this.onPlay = false
        this.Moved = true
        this.MovingDirection = null

        this.BigPlane_Num = difficulty.getValue("BigPlane_Num")
        this.MiddlePlane_Num = difficulty.getValue("MiddlePlane_Num")
        this.SmallPlane_Num = difficulty.getValue("SmallPlane_Num")

        this.GameStartScreen = document.getElementById("game-start")
        this.GamePauseScreen = document.getElementById("game-pause")
        this.GameMainScreen = document.getElementById("game")
        this.GameOverScreen = document.getElementById("game-over")

        this.GameMainScreenCenter = []
        this.waitToDestoryGameObjects = []

        this.GameMainScreen_Width = 0
        this.GameMainScreen_Heigth = 0


        this.nowTime = Date.now()
        this.Tick = 400



        this.init()
    }
    init(){
        this.updateGameScreenSize()

        this.AllPlaneNum = this.BigPlane_Num + this.MiddlePlane_Num + this.SmallPlane_Num

        this.BigPlanePercentage = Number((this.BigPlane_Num / this.AllPlaneNum).toFixed(2))
        this.MiddlePlanePercentage = Number((this.MiddlePlane_Num / this.AllPlaneNum).toFixed(2))
        this.SmallPlanePercentage = Number((this.SmallPlane_Num / this.AllPlaneNum).toFixed(2))

        this.UserPlane = new UserPlane(0,0,80,114,100,20,5 ,'./asstes/image/ourPlane.gif','./asstes/image/ourPlane_die.gif')
        this.UserBullets = new UserBullets(150)
        this.BigPlans = new BigPlans(this.BigPlane_Num)
        this.MiddlePlans = new MiddlePlans(this.MiddlePlane_Num)
        this.SmallPlans = new SmallPlans(this.SmallPlane_Num)

        this.UserPlane.setGameScreen(this.GameMainScreen)
        this.UserBullets.setGameScreen(this.GameMainScreen)
        this.SmallPlans.setGameScreen(this.GameMainScreen)
        this.MiddlePlans.setGameScreen(this.GameMainScreen)
        this.BigPlans.setGameScreen(this.GameMainScreen)

    }
    #nextTick(){
        this.updateGameScreenSize()

        if(this.isGameOver){
            return false
        }
        if(this.isPause){
            return false
        }
        if(!this.Moved){
            switch(this.MovingDirection){
                case "up":
                    if((this.UserPlane.ObjectPlace_Y - this.UserPlane.ObjectMove_Speed) >! 0 ){
                        this.UserPlane.MoveY()
                    }
                    this.Moved = true
                    this.MovingDirection = ''
                    break
                case "down":
                    if((this.UserPlane.ObjectPlace_Y + this.UserPlane.ObjectSize_Y  + this.UserPlane.ObjectMove_Speed) < this.GameMainScreen_Heigth){
                        this.UserPlane.MoveNegative_Y()
                    }
                    this.Moved = true
                    this.MovingDirection = ''
                    break
                case "left":
                    if((this.UserPlane.ObjectPlace_X - this.UserPlane.ObjectMove_Speed) > 0){
                        this.UserPlane.MoveNegative_X()
                    }
                    this.Moved = true
                    this.MovingDirection = ''
                    break
                case "right":
                    if((this.UserPlane.ObjectPlace_X + this.UserPlane.ObjectMove_Speed  ) < this.GameMainScreen_Width){
                        this.UserPlane.MoveX()
                    }
                    this.Moved = true
                    this.MovingDirection = ''
                    break
            }
        }

        this.UserBullets.clearBulletIfOverScreen()
        this.SmallPlans.clearPlaneIfOverScreen()
        this.MiddlePlans.clearPlaneIfOverScreen()
        this.BigPlans.clearPlaneIfOverScreen()

        if(Date.now()- this.nowTime >= this.Tick){
            let generatePlaned = false
            this.nowTime = Date.now()

            const RandomNum = random(1,100)

            const Interval = requestDistributionInterval([this.SmallPlanePercentage,this.MiddlePlanePercentage,this.BigPlanePercentage])

            if(RandomNum > (Interval[2][0] * 100) && RandomNum < (Interval[2][1] * 100)){
                generatePlaned = true
                this.BigPlans.generatePlane()
            }
            if(RandomNum > (Interval[1][0] * 100) && RandomNum < (Interval[1][1] * 100)){
                generatePlaned = true
                this.MiddlePlans.generatePlane()
            }
            if(!generatePlaned){
                this.SmallPlans.generatePlane()
            }

            for(let bullet of this.UserBullets.bullets){
                for(let plane of [...this.SmallPlans.Plans,...this.MiddlePlans.Plans,...this.BigPlans.Plans]){
                    if((bullet.ObjectCenter_X + bullet.ObjectSize_X) > plane.ObjectPlace_X && bullet.ObjectPlace_X < (plane.ObjectPlace_X + plane.ObjectSize_X)){
                        if(bullet.ObjectPlace_Y < (plane.ObjectPlace_Y + plane.ObjectSize_Y)){
                            plane.PlansClass.clearPlane(plane.PlansClass.Plans.indexOf(plane))
                        }
                    }
                    if((this.UserPlane.ObjectPlace_X + this.UserPlane.ObjectCenter_X) > plane.ObjectPlace_X && this.UserPlane.ObjectPlace_X < (plane.ObjectPlace_X + plane.ObjectSize_X)){
                        if(this.UserPlane.ObjectPlace_Y < (plane.ObjectPlace_Y + plane.ObjectSize_Y)){
                            this.UserPlane.die()
                            this.GameOver()
                        }
                    }
                }
            }
        }
        
        this.UserBullets.Shout(this.UserPlane.ObjectPlace_X,this.UserPlane.ObjectPlace_Y)
        this.UserBullets.Moves()
        this.BigPlans.Moves()
        this.MiddlePlans.Moves()
        this.SmallPlans.Moves()

        window.requestAnimationFrame(()=>{
            this.#nextTick()
        })
        return true
    }
    play(){
        if(this.isGameOver){
            return false
        }
        if(this.onPlay){
            return false 
        }
        if(this.isPause){
            this.isPause = false
            this.onPlay = true

            this.GamePauseScreen.style.display = 'none'
            this.GameMainScreen.style.display = 'block'
            window.requestAnimationFrame(this.#nextTick.bind(this))
            return true
        }
        this.onPlay = true

        this.GameStartScreen.style.display = 'none'
        this.GameMainScreen.style.display = 'block'

        this.updateGameScreenSize()

        this.UserPlane.setLocaltion(this.GameMainScreenCenter[0]  + this.UserPlane.ObjectSize_X ,this.GameMainScreen_Heigth - this.UserPlane.ObjectSize_Y)
        this.UserPlane.Show()


        document.addEventListener('keydown',this.KeyDownCallBack.bind(this),true)
        window.requestAnimationFrame(this.#nextTick.bind(this))
        return true

    }
    pause(){
        if(this.isPause){
            return false
        }
        this.onPlay = false
        this.isPause = true
        this.GamePauseScreen.style.display = 'block'
        return true

    }
    updateGameScreenSize(){
        this.GameMainScreen_Heigth = this.GameMainScreen.offsetHeight
        this.GameMainScreen_Width = this.GameMainScreen.offsetWidth
        this.GameMainScreenCenter = RequestCenter(this.GameMainScreen_Width ,this.GameMainScreen_Heigth)
    }
    KeyDownCallBack(e){
        if(this.isGameOver){
            return e.preventDefault();
        }
        if(this.isPause){
            return e.preventDefault();
        }
        if(!this.onPlay){
            return e.preventDefault();
        }
        if(!this.Moved){
            return e.preventDefault();
        }
        this.Moved = false
        switch(e.code) {
            case "KeyS":
            case "ArrowDown":
              this.MovingDirection = "down"
              break;
            case "KeyW":
            case "ArrowUp": 
              this.MovingDirection = "up"
              break;
            case "KeyA":
            case "ArrowLeft":
              this.MovingDirection = "left"
              break;
            case "KeyD":
            case "ArrowRight":
              this.MovingDirection = "right"
              break;
          }
    }
    Destorys(){
        for(let GameObject of this.waitToDestoryGameObjects){
            GameObject.Destory()
            this.waitToDestoryGameObjects.splice(this.waitToDestoryGameObjects.indexOf(GameObject),1)
        }
        return true
    }
    GameOver(){
        this.isGameOver = true
        this.GameOverScreen.style.display = 'block'
    }
    newGame(){
        location.reload()
    }
}

const Hard_difficulty = new Difficulty('Hard',{
    "BigPlane_Num":3,
    "MiddlePlane_Num":7,
    "SmallPlane_Num":18
})
const Middle_diffculty = new Difficulty('Middle',{
    "BigPlane_Num":1,
    "MiddlePlane_Num":4,
    "SmallPlane_Num":10
})
const Easy_diffculty = new Difficulty('Easy',{
    "BigPlane_Num":0,
    "MiddlePlane_Num":6,
    "SmallPlane_Num":12
})

const game = new Game(Hard_difficulty)
