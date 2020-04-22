const p5 = require("p5"); 

const soundModelURL = 'https://teachablemachine.withgoogle.com/models/s1HBxFOnp/';

const soundClassifierOptions = {
    includeSpectrogram: true, // in case listen should return result.spectrogram
    probabilityThreshold: 0.75,
    invokeCallbackOnNoiseAndUnknown: true,
    overlapFactor: 0.75 // probably want between 0.5 and 0.75.
}

let width = window.innerWidth-5;
let height = window.outerHeight-8;

const p5draw = (p) => {
    
    let classifier;
    let label = "listening...";

    let emoji = ["127834", "128031", "128025", "128033", "127843"]; //fish, rise, octopus, sushi;
    var menu = [];
    var menuNum = 15;   

	p.setup = () => {
		p.createCanvas(width, height);
        p.background(255);
        classifier = ml5.soundClassifier(soundModelURL + 'model.json', soundClassifierOptions, audioClassifierReady);

        for(var i = 0; i < menuNum; i++) {
            menu.push(new displayFish(i));
            menu[i].defEmoji();
        }
	}

	p.draw = () => {
        p.background(255);
        for(var i = 0; i < menuNum; i++) {
            menu[i].display();
            menu[i].move();
        }

        p.fill(0);
        p.textSize(16);
        p.textAlign(p.CENTER);
        p.text(label, width / 2, height - 4);
    }

    p.keyPressed = () => {
        if (p.keyCode === 32) {
            for(var i = 0; i < menuNum; i++) {
                menu[i].restart();
            }
        }
    }

    function displayFish(tmpIndex){
        this.index = tmpIndex;
        this.theta = 0;
        this.speed = 0.75;
        this.emoji = " ";
        this.changeFlag = true;
        this.label = label;

        this.display = function() {
            this.x = 600 * p.cos(p.radians(this.index * 360 / menuNum + this.theta)) + p.width/2;
            this.y = 230 * p.sin(p.radians(this.index * 360 / menuNum + this.theta)) + p.height/2;

            p.textSize(this.y * 0.3);

            p.text(String.fromCodePoint(this.emoji), this.x, this.y);
        };

        this.move = function() {
             this.theta += this.speed;

             if(this.x > width + 250){
                this.defEmoji();
                this.changeFlag = false;
              } else if (label === "sushi") {
                  this.emoji = emoji[4];
              } 
        };

        this.restart = function(){
            this.theta += this.speed;
            this.defEmoji();
            this.changeFlag = false;
        }

        this.defEmoji = function() {
            var emojiNum = p.random(1);
            
            if(emojiNum <= 0.5){
                this.emoji = emoji[0];
            } else if(emojiNum < 0.6){
                this.emoji = emoji[1];
            } else if(emojiNum < 0.8){
                this.emoji = emoji[2];
            } else {
                this.emoji = emoji[3];
            }
        }
    }

    function audioClassifierReady() {
        classifier.classify(gotResult);
    }
    
    function gotResult(error, results) {
        if (error) {
            console.error(error);
            return;
        }
        label = results[0].label;
    }
}

module.exports = function setup() {
	const myp5 = new p5(p5draw, "main");
}
