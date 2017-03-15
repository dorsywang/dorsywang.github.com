var refreshDuration = 8000;
var refreshTimeout;
var numPointsX;
var numPointsY;
var unitWidth;
var unitHeight;
var points;
var layer1, layer2, layer3;

function onLoad()
{


    layer1 = document.getElementById('layer1');
    layer2 = document.getElementById('layer2');
    layer3 = document.getElementById('layer3');

return;
    var el = document.querySelector('#bg');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', el.offsetWidth);
    svg.setAttribute('height', el.offsetHeight);
    document.querySelector('#bg').appendChild(svg);

    var unitSize = (window.innerWidth+window.innerHeight)/20;
    numPointsX = Math.ceil(window.innerWidth/unitSize)+1;
    numPointsY = Math.ceil(window.innerHeight/unitSize)+1;
    unitWidth = Math.ceil(window.innerWidth/(numPointsX-1));
    unitHeight = Math.ceil(window.innerHeight/(numPointsY-1));

    points = [];

    for(var y = 0; y < numPointsY; y++) {
        for(var x = 0; x < numPointsX; x++) {
            points.push({x:unitWidth*x, y:unitHeight*y, originX:unitWidth*x, originY:unitHeight*y});
        }
    }

    randomize();

    for(var i = 0; i < points.length; i++) {
        if(points[i].originX != unitWidth*(numPointsX-1) && points[i].originY != unitHeight*(numPointsY-1)) {
            var topLeftX = points[i].x;
            var topLeftY = points[i].y;
            var topRightX = points[i+1].x;
            var topRightY = points[i+1].y;
            var bottomLeftX = points[i+numPointsX].x;
            var bottomLeftY = points[i+numPointsX].y;
            var bottomRightX = points[i+numPointsX+1].x;
            var bottomRightY = points[i+numPointsX+1].y;

            var rando = Math.floor(Math.random()*2);

            for(var n = 0; n < 2; n++) {
                var polygon = document.createElementNS(svg.namespaceURI, 'polygon');

                if(rando==0) {
                    if(n==0) {
                        polygon.point1 = i;
                        polygon.point2 = i+numPointsX;
                        polygon.point3 = i+numPointsX+1;
                        polygon.setAttribute('points',topLeftX+','+topLeftY+' '+bottomLeftX+','+bottomLeftY+' '+bottomRightX+','+bottomRightY);
                    } else if(n==1) {
                        polygon.point1 = i;
                        polygon.point2 = i+1;
                        polygon.point3 = i+numPointsX+1;
                        polygon.setAttribute('points',topLeftX+','+topLeftY+' '+topRightX+','+topRightY+' '+bottomRightX+','+bottomRightY);
                    }
                } else if(rando==1) {
                    if(n==0) {
                        polygon.point1 = i;
                        polygon.point2 = i+numPointsX;
                        polygon.point3 = i+1;
                        polygon.setAttribute('points',topLeftX+','+topLeftY+' '+bottomLeftX+','+bottomLeftY+' '+topRightX+','+topRightY);
                    } else if(n==1) {
                        polygon.point1 = i+numPointsX;
                        polygon.point2 = i+1;
                        polygon.point3 = i+numPointsX+1;
                        polygon.setAttribute('points',bottomLeftX+','+bottomLeftY+' '+topRightX+','+topRightY+' '+bottomRightX+','+bottomRightY);
                    }
                }
                polygon.setAttribute('fill','rgba(0,0,0,'+(Math.random()/3)+')');
                var animate = document.createElementNS('http://www.w3.org/2000/svg','animate');
                animate.setAttribute('fill','freeze');
                animate.setAttribute('attributeName','points');
                animate.setAttribute('dur',refreshDuration+'ms');
                animate.setAttribute('calcMode','linear');
                polygon.appendChild(animate);
                svg.appendChild(polygon);
            }
        }
    }

    refresh();

}

function randomize() {
    for(var i = 0; i < points.length; i++) {
        if(points[i].originX != 0 && points[i].originX != unitWidth*(numPointsX-1)) {
            points[i].x = points[i].originX + Math.random()*unitWidth-unitWidth/2;
        }
        if(points[i].originY != 0 && points[i].originY != unitHeight*(numPointsY-1)) {
            points[i].y = points[i].originY + Math.random()*unitHeight-unitHeight/2;
        }
    }
}

function refresh() {
    randomize();
    for(var i = 0; i < document.querySelector('#bg svg').childNodes.length; i++) {
        var polygon = document.querySelector('#bg svg').childNodes[i];
        var animate = polygon.childNodes[0];
        if(animate.getAttribute('to')) {
            animate.setAttribute('from',animate.getAttribute('to'));
        }
        animate.setAttribute('to',points[polygon.point1].x+','+points[polygon.point1].y+' '+points[polygon.point2].x+','+points[polygon.point2].y+' '+points[polygon.point3].x+','+points[polygon.point3].y);
        animate.beginElement();
    }
    refreshTimeout = setTimeout(function() {refresh();}, refreshDuration);
}

function onResize() {
    document.querySelector('#bg svg').remove();
    clearTimeout(refreshTimeout);
    onLoad();
}

window.onload = onLoad;
window.onresize = onResize;

/*
window.onscroll = function(e){
    var top = document.body.scrollTop || window.scrollY || document.documentElement.scrollTop;


    if(layer1 && layer2){
        layer1.style.transform = "translate(0, -" + (top / 1.03) + "px)";
        layer2.style.transform = "translate(0, -" + (top / 1.01) + "px)";

    }

    e.preventDefault();
    e.stopPropagation();
};
*/

document.addEventListener('scroll', function(e){
    return;
    var top = document.body.scrollTop || window.scrollY || document.documentElement.scrollTop;


    if(layer1 && layer2 && layer3){
        layer1.style.transform = "translate(0, -" + Math.round(top / 1.5) + "px)";
        layer2.style.transform = "translate(0, -" + Math.round(top / 1.1) + "px)";
        layer3.style.transform = "translate(0, -" + (top / 1) + "px)";
    }
});

var dialog = $('#dialog');
var grayMask = $(".grayMask");

$('#joinBtn').on('click',  function(){

    dialog.show();
    grayMask.show();
});

$('#cancelSubmit').on('click', function(){
    dialog.hide();
    grayMask.hide();
});

document.getElementById('submit').onclick = function(){
    
    dialog.style.display = 'none';
};


(function(){

    var json = [                                                                
        {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  img: "../img/banner1.jpg",
            name: "AlloyTeam工作室",
            school: "武汉大学",
            src: "https://www.baidu.com",
            intro: "做地表最强前端工作室",
            tel: '0755-8387644'
        },
        {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  img: "../img/cooperation.png",
            name: "AlloyTeam工作室",
            school: "武汉大学",
            src: "https://www.baidu.com",
            tel: '0755-8387644',
            intro: "做地表最强前端工作室"
        },        {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  //img: "../img/University.jpg",
            name: "AlloyTeam工作室",
            school: "武汉大学",
            tel: '0755-8387644',
            src: "https://www.baidu.com",
            intro: "做地表最强前端工作室"
        },
        {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  img: "../img/banner1.jpg",
            name: "AlloyTeam工作室",
            school: "武汉大学",
            src: "https://www.baidu.com",
            intro: "做地表最强前端工作室",
            tel: '0755-8387644'
        },
        {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  img: "../img/cooperation.png",
            name: "AlloyTeam工作室",
            school: "武汉大学",
            src: "https://www.baidu.com",
            tel: '0755-8387644',
            intro: "做地表最强前端工作室"
        },        {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  //img: "../img/University.jpg",
            name: "AlloyTeam工作室",
            school: "武汉大学",
            tel: '0755-8387644',
            src: "https://www.baidu.com",
            intro: "做地表最强前端工作室"
        },
        {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  img: "../img/banner1.jpg",
            name: "AlloyTeam工作室",
            school: "武汉大学",
            src: "https://www.baidu.com",
            intro: "做地表最强前端工作室",
            tel: '0755-8387644'
        },
        {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  img: "../img/cooperation.png",
            name: "AlloyTeam工作室",
            school: "武汉大学",
            src: "https://www.baidu.com",
            tel: '0755-8387644',
            intro: "做地表最强前端工作室"
        },        {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  //img: "../img/University.jpg",
            name: "AlloyTeam工作室",
            school: "武汉大学",
            tel: '0755-8387644',
            src: "https://www.baidu.com",
            intro: "做地表最强前端工作室"
        }


    ];

    var mask = document.getElementById('mask');
    var nHeight = ( 567 + ( json.length / 4 ) * 228 ) + ( (json.length % 4) > 0 ? 228 : 0 ) + 'px';
    mask.style.height =  nHeight;

    var list_ul = document.getElementById('list-ul');
    for(var i = 0; i < json.length; i++) {
        var li = document.createElement('li');
        var p = document.createElement('p');
        var p2 = document.createElement('p');
        var img = document.createElement('div');
        var imgWrapper = document.createElement('div');

        var div = document.createElement('div');

        var textWrapper = document.createElement('div');

        textWrapper.setAttribute('class', 'textWrapper');
        imgWrapper.setAttribute('class', 'imgWrapper');
        var canvas = Trianglify({width: 365,height: 220}).canvas();
        
        li.className = "list-li";

        img.className = "school-logo";

        img.style.backgroundImage =  'url(' + (json[i].img || canvas.toDataURL()) + ')';

        imgWrapper.appendChild(img);
        li.appendChild(imgWrapper);

        
        div.className = 'div-cont';
        div.innerHTML = `
                            <h3 class="school-name name">${json[i].name}</h3>
                            <span class="school-name">Jet</span>
                            <span class="school-name grey">${json[i].school}</span>
                            <span class="tel">${json[i].tel}</span>
                            <p class="school-intro">${json[i].intro}</p>
                            <a class="link" href="${json[i].src}">Go>></a>
                        `;
        textWrapper.appendChild(div);

        /*
        p2.className = "school-str";
        p2.innerHTML = json[i].src;
        textWrapper.appendChild(p2);
        */

        textWrapper.appendChild(p);

        li.appendChild(textWrapper);

        list_ul.appendChild(li);
    } 

    var footer = document.createElement('footer');
    footer.innerHTML = 'AlloyTeam ·高校联盟';
    document.getElementById('my-list').appendChild(footer);
})()
