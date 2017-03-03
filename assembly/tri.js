const POINT_LEN = 6;
const SPEED = 0.001;


let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

//let fillRandomColor = ['rgba(255, 255, 255, .2)', 'rgba(255, 255, 255, 0.1)'];
// let fillRandomColor = ['red', 'green', 'blue', 'yellow'];
//let getRandomColor = () => fillRandomColor[~~ (fillRandomColor.length * Math.random())];

let map = {};

class Point{
    constructor(x, y, z, r, blur){
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.blur = blur;

        this.cX = 200;
        this.cY = 300;
        this.cZ = 100;

        this.id = ~~ (Math.random() * 1000);

        let v = 1 / this.z * 10;

        let randomAngle = Math.random() * Math.PI * 2;
        this.v = [Math.cos(randomAngle) * v , Math.sin(randomAngle) * v];

        this.lineTos = [];
    }

    connect(point){
        this.lineTos.push(point);
    }

    draw(ctx){
        this.drawPoint(ctx);
        this.drawLines(ctx);
    }

    drawPoint(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.closePath();

        let opacity = this.lineTos.length / 10;

        //console.log(opacity, this.lineTos.length);
        ctx.shadowBlur=20;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;

        ctx.fill();
    }

    hasConnectedTo(point){
        if(this.lineTos.indexOf(point)){
            return true;
        }else{
            return point.lineTos.indexOf(this) > -1;
        }
    }

    getUionId(...args){
        let allId = args.reduce(function(value, item){
            return value + item.id;
        }, args[0].id);

        return allId;
    }

    drawLines(ctx){
        this.lineTos.map((item, index) => {
            ctx.beginPath();
            //console.log('moveTo: ', this.x, this.y);
            //console.log('lineTo: ', item.x, item.y);

            ctx.moveTo(this.x, this.y);
            ctx.lineTo(item.x, item.y);

            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
            ctx.stroke();

            return;

            // 检查有没有面出现
            for(let j = index + 1; j < this.lineTos.length; j ++){
                let point = this.lineTos[j];
                if(point != this){
                    let connectd = item.hasConnectedTo(point);

                    /*
                    if(connectd){
                        let unionId = this.getUionId(this, item, point);

                        // console.log(unionId);

                        ctx.lineTo(point.x, point.y);

                        ctx.closePath();

                        let color;
                        if(map[unionId]){
                        }else{
                            map[unionId] = getRandomColor();
                        }

                        color = map[unionId];
                        ctx.fillStyle = color;
                        ctx.fill();

                        //console.log('lineTo: ', point.x, point.y);
                        //console.log('closePath');

                        break;
                    }
                    */
                }
            }

//            ctx.closePath();

        });



    }

    move(){
        /*
        this.x += this.v[0];
        this.y += this.v[1];
        */

        this.rotateX(SPEED, 1);
        this.rotateY(SPEED, 1);
        this.rotateZ(SPEED, 1);
    }


    /**
	 * 绕X轴旋转
	 * @param  Float speed     速度，比如0.0001
	 * @param  Int derection 方向
	 */
	rotateX(speed, derection){
		let {range, cY, cZ} = this
		let d = speed * derection
		let dg = Math.random() * 2 * d + d
		let theta = Math.atan2(this.z - cZ, this.y - cY)
		let r = Math.sqrt((this.y - cY) ** 2 + (this.z - cZ) ** 2)
		let y = r * Math.cos(theta + dg)
		let z = r * Math.sin(theta + dg)
		this.y = y + cY
		this.z = z + cZ
	}

	/**
	 * 绕Y轴旋转
	 * @param  Float speed     速度，比如0.0001
	 * @param  Int derection 方向
	 */
	rotateY(speed, derection){
		let {range, cX, cZ} = this
		let d = speed * derection
		let dg = Math.random() * 2 * d + d
		let theta = Math.atan2(this.z - cZ, this.x - cX)
		let r = Math.sqrt((this.x - cX) ** 2 + (this.z - cZ) ** 2)
		let x = r * Math.cos(theta + dg)
		let z = r * Math.sin(theta + dg)
		this.x = x + cX
		this.z = z + cZ
	}

	/**
	 * 绕Z轴旋转
	 * @param  Float speed     速度，比如0.0001
	 * @param  Int derection 方向
	 */
	rotateZ(speed, derection){
		let {range, cX, cY} = this
		let d = speed * derection
		let dg = Math.random() * 2 * d + d
		let theta = Math.atan2(this.y - cY, this.x - cX)
		let r = Math.sqrt((this.x - cX) ** 2 + (this.y - cY) ** 2)
		let x = r * Math.cos(theta + dg)
		let y = r * Math.sin(theta + dg)
		this.x = x + cX
		this.y = y + cY
	}
}

class Poly{
    constructor(){
        this.points = this.make3DModel();


        let ani = () => {
            this.move();
            window.requestAnimationFrame(ani);
        };

        ani();
    }

    draw(){
        let points = this.points;

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.lineWidth = 2;
        points.map(item => {
            item.draw(context);
        });
    }

    move(){
        let points = this.points;

        points.map(item => {
            item.move();
        });

        this.draw();
    }

    // 随机生成n个点，然后两两连接起来
    make3DModel(){
        let points = [];

        let i = 0, n = POINT_LEN;

        while(i < n){
            let randomPoint = [~~ (Math.random() * 1e3) / 2, ~~ (Math.random() * 1e3) / 2, ~~ (Math.random() * 1e3) / 2];

            let point = new Point(randomPoint[0], randomPoint[1], randomPoint[2], 8);

            points.push(point);

            i ++;
        }

        points.map((item, index) => {
            /*
            for(let j = index; j < points.length;  j ++){
                let point = points[j];

                item.connect(point);
            }
            */
                let len = points.length;

                let getRandomIndex =  () => ~~ (Math.random() * len);
                
                let randomLen = ~~ (Math.random() * len);

                for(var i = 0; i <  randomLen; i ++){
                    let point = points[getRandomIndex()];

                    item.connect(point);
                }
        });

        return points;
    }

}

new Poly();

