var pot;
var doingTask = 0;
var task1progress = 0;
var ledleDist = 0;
var ledlePrevX;
var diff = 2;
var money = 0
var experience = 0;
var expToLevelUp = 100;
var level = 0;
var task2progress = 0;
var taskCompletedMsgLife = 0;
var levelUpBonusMsgLife = 0;
var taskXpMult = 1;
var taskXpMultPrice = 50;
var taskCashMult = 1;
var levelBonusMult = 1;
var taskCashMultPrice = 50;
var taskCashMultMsgLife = 0;
var taskXpMultMsgLife = 0;
var stand1;
var stand1Ready = false;

function preload() {
  potImg = loadImage("pot.png")
  ledleImg = loadImage("ledle.png")
  readyImg = loadImage("ready.png")
}

function setup() {
  createCanvas(1200, 1200)
  frameRate(100)
  player = createSprite(width / 2, height / 2, 25, 25)
  speed = 3
  pot = createSprite(width / 2, height / 2)
  pot.visible = false
  pot.scale = 3
  pot.addImage("pot", potImg)
  ledle = createSprite(775, 430)
  ledle.addImage("ledle", ledleImg)
  ledle.visible = false;
  ledle.scale = 2;
  taskCashMultBtn = createButton("Task cash multiplier")
  taskCashMultBtn.position(0, 125)
  taskCashMultBtn.mouseClicked(taskCashMultUpgrade)
  taskXpMultBtn = createButton("Task experience multiplier")
  taskXpMultBtn.position(0, 225)
  taskXpMultBtn.mouseClicked(taskXpMultUpgrade)
  stand1 = createSprite(400, 200, 100, 100)
  stand1.addImage("stand1", potImg)
  stand1.scale = 0.7
  stand1ReadySprite = createSprite(-500, -500)
  stand1ReadySprite.addImage("ready", readyImg)
  stand1ReadySprite.scale = 0.8
}

function draw() {
  if (stand1Ready == true) {
    stand1ReadySprite.x = 400
    stand1ReadySprite.y = 100
  }

  else {
    stand1ReadySprite.x = -500
    stand1ReadySprite.y = -500
  }
  background(220)
  taskCashMultBtn.position(-500, -500)
  taskXpMultBtn.position(-500, -500)
  readyNum = random(0, 500)
  player.collide(stand1)

  console.log(stand1Ready)

  textSize(20);
  text(`Money: $${calculateValue(money, 2)}`, 0, 40)
  text(`Experience: ${calculateValue(experience, 2)}/${calculateValue(expToLevelUp, 2)}`, 0, 1160)
  text(`Level: ${level}`, 0, 1130)
  rect(0, 1175, 250, 10)
  push()
  fill("blue")
  rect(0, 1175, experience / expToLevelUp * 250 + 0.01, 10)
  pop()
  if (experience >= expToLevelUp) {
    experience -= expToLevelUp
    bonusLevelMoney = 100
    for (var i = 0; i != level; i++) {
      bonusLevelMoneyMult = 1.5 - (level * level / 5)
      console.log(bonusLevelMoneyMult)
      bonusLevelMoney *= bonusLevelMoneyMult
      
    }
    money += bonusLevelMoney
    level += 1
    expToLevelUp *= 1.2
    round(expToLevelUp, 0)
    levelUpBonusMsgLife = 150

  }

  if (doingTask == 0) {
    if (readyNum > 499) {
      stand1Ready = true;
    }
    if (diff == 0) {
      diffText = "Very Easy"
    }

    else if (diff == 1) {
      diffText = "Easy"
    }

    else if (diff == 2) {
      diffText = "Normal"
    }

    else if (diff == 3) {
      diffText = "Hard"
    }

    else if (diff == 4) {
      diffText = "Very Hard"
    }

    push()
    textSize(15);
    text(`Money needed to upgrade: $${calculateValue(taskCashMultPrice, 2)}`, 0, 175)
    text(`Current multiplier: x${calculateValue(taskCashMult, 2)}`, 0, 200)
    text(`Money needed to upgrade: $${calculateValue(taskXpMultPrice, 2)}`, 0, 275)
    text(`Current multiplier: x${calculateValue(taskXpMult, 2)}`, 0, 300)
    pop()
    taskCashMultBtn.position(0, 125);  
    taskXpMultBtn.position(0, 225);  

    text(`Press 'Q' to change difficulty. Current difficulty: ${diffText}, multiplier: x${(diff - 2) * 0.2 + 1}.`, 0, 1010)
    text("Upgrades:", 0, 100)
    if (keyDown("w")) {
      player.y -= speed
    }
  
    if (keyDown("s")) {
      player.y += speed
    }
  
    if (keyDown("a")) {
      player.x -= speed
    }
  
    if (keyDown("d")) {
      player.x += speed
    }

    textAlign(CENTER)

    if (taskCompletedMsgLife > 0) {
      push()
      fill("green")
      text(`Task completed. You received $${calculateValue(bonusMoney, 2)} and ${calculateValue(bonusExp, 2)} experience.`, width / 2, 50)
      taskCompletedMsgLife -= 1
      pop()
    }

    else if (levelUpBonusMsgLife > 0) {
      push()
      fill("green")
      text(`Level up! You received $${calculateValue(bonusLevelMoney, 2)}.`, width / 2, 50)
      levelUpBonusMsgLife -= 1
      pop()
    }

    else if (taskCashMultMsgLife > 0) {
      push()
      fill("green")
      text(`Successfully upgraded task cash multiplier to x${calculateValue(taskCashMult, 2)} with $${calculateValue(taskCashMultPrice - (taskCashMult * 10 / 1.1), 2)}.`, width / 2, 50)
      taskCashMultMsgLife -= 1
      pop()
    }

    else if (taskXpMultMsgLife > 0) {
      push()
      fill("green")
      text(`Successfully upgraded task experience multiplier to x${calculateValue(taskXpMult, 2)} with $${calculateValue(taskXpMultPrice - (taskXpMult * 10 / 1.1), 2)}.`, width / 2, 50)
      taskXpMultMsgLife -= 1
      pop()
    }
  }

  textAlign(CENTER)


  if (doingTask == 1) {
    text(`Stir the mixture. Progress: ${task1progress}%`, width / 2, 50)
    if (mouseDown())
    ledle.x = mouseX
    if (ledle.x > 742) {
      ledle.x = 742
    }

    if (ledle.x < 450) {
      ledle.x = 450
    }

    ledleDist += abs(ledle.x - ledlePrevX)
    console.log(`ledleDist: ${ledleDist}`)

    ledlePrevX = ledle.x

    ledle.y = 430
    
    task1progress = (ledleDist / (500 + diff * 100)).toFixed(2)

    if (task1progress >= 100) {
      endTask(1)
    }
  }

  if (doingTask == 2) {
    text(`Click quickly to power the machine. Progress: ${task2progress.toFixed(2)}%`, width / 2, 50)
    if (task2progress > 0) {
      task2progress -= 0.02 + ((diff - 2) * 0.005)
    }

    if (task2progress >= 100) {
      endTask(2)
    }

    if (task2progress < 0) {
      task2progress = 0
    }
  }


  drawSprites();
}

function doTask(taskID) {
  if (taskID == 1) {
    pot.visible = true
    ledle.x = 742
    ledle.y = 450
    ledlePrevX = 742
    ledle.visible = true;
    doingTask = 1
    ledleDist = 0
  }

  if (taskID == 2) {
    doingTask = 2
    task2progress = 0;
  }
}

function endTask(taskID) {
  if (taskID == 1) {
    pot.visible = false
    ledle.visible = false
    doingTask = 0
    bonusMoney = random(15, 30) * ((diff - 2) * 0.2 + 1) * taskCashMult
    bonusExp = random(15, 30) * ((diff - 2) * 0.2 + 1) * taskXpMult
    money += bonusMoney
    experience += bonusExp
  }

  if (taskID == 2) {
    doingTask = 0
    bonusMoney = random(15, 30) * ((diff - 2) * 0.2 + 1)  * taskCashMult
    bonusExp = random(15, 30) * ((diff - 2) * 0.2 + 1) * taskXpMult
    money += bonusMoney
    experience += bonusExp
  }

  taskCompletedMsgLife = 150


} 

function mouseClicked() {
  if (doingTask == 2) {
    task2progress += 1
  }
  

}

function keyPressed() {
  if (keyCode == 81 && doingTask == 0) {
    if (diff == 4) {
      diff = 0
    }

    else {
      diff += 1
    }
  }

  if (keyCode == 67) {
    doTask(1)
  }

  if (keyCode == 66) {
    doTask(2)
  }

  if (keyCode == 69) {
    if (dist(stand1.x, stand1.y, player.x, player.y) < 125 && stand1Ready == true) {
      doTask(1)
      stand1Ready = false
    }
  }
}

function taskCashMultUpgrade() {
  if (money >= taskCashMultPrice) {
    money -= taskCashMultPrice
    taskCashMultPrice += (taskCashMult * 10)
    taskCashMult *= 1.1
    taskCashMultMsgLife = 150
  }
}

function taskXpMultUpgrade() {
  if (money >= taskXpMultPrice) {
    money -= taskXpMultPrice
    taskXpMultPrice += (taskXpMult * 10)
    taskXpMult *= 1.1
    taskXpMultMsgLife = 150
  }
}

function calculateValue(value, decimals) {
  if (value / 1000 < 1) {
    return `${value.toFixed(decimals)}`;
  }

  else if (value / 1000000 < 1) {
    return `${(value / 1000).toFixed(decimals)}K`;
  }

  else if (value / 1000000000 < 1) {
    return `${(value / 1000000).toFixed(decimals)}M`;
  }

  else if (value / 1000000000000 < 1) {
    return `${Math.floor(value * 100 / 1000000000) / 100}B`;
  }

  else if (value / 1000000000000000 < 1) {
    return `${Math.floor(value * 100 / 1000000000000) / 100}T`;
  }

  else if (value / 1000000000000000000 < 1) {
    return `${Math.floor(value * 100 / 1000000000000000) / 100}Qd`;
  }

  else if (value / 1000000000000000000000 < 1) {
    return `${(value / 1000000000000000000).toFixed(decimals)}Qt`;
  }

  else if (value / 1000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000).toFixed(decimals)}Sx`;
  }

  else if (value / 1000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000).toFixed(decimals)}Sp`;
  }

  else if (value / 1000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000).toFixed(decimals)}Oc`;
  }

  else if (value / 1000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000).toFixed(decimals)}No`;
  }

  else if (value / 1000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000).toFixed(decimals)}Dc`;
  }
  
  else if (value / 1000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000).toFixed(decimals)}UDc`;
  }

  else if (value / 1000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000).toFixed(decimals)}DDc`;
  }

  else if (value / 1000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000).toFixed(decimals)}TDc`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000).toFixed(decimals)}qDc`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000).toFixed(decimals)}QDc`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000).toFixed(decimals)}sDc`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000).toFixed(decimals)}SDc`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}ODc`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}NDc`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}Vg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}UVg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}DVg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}TVg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}qVg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}QVg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}sVg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}SVg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}OVg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}NVg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}Tg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}UTg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}DTg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}TTg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}qTg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}QTg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}sTg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}STg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}OTg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}NTg`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}qDG`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}UqDG`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}DqDG`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}TqDG`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}qqDG`;
  }

  else if (value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 < 1) {
    return `${(value / 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toFixed(decimals)}QqDG`;
  }
  
}