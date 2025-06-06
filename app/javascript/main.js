// Copilotに作ってもらった真空波動拳のみのWebアプリのJsファイル、
// 全コマンドにこれ書く？そんなわけないよな
const log = document.getElementById("log");
const historyDiv = document.getElementById("history");

let inputHistory = [];
const maxFrames = 20;
const command = ["↓", "↘", "→", "↓", "↘", "→", "P"];
const maxDelay = 100; // 各ステップ間の最大許容時間（ms）

let keyState = {
  W: false,
  A: false,
  S: false,
  D: false,
  U: false,
  J: false,
};

let cooldown = false;

function getDirectionFromKeys() {
  const x = (keyState.D ? 1 : 0) - (keyState.A ? 1 : 0);
  const y = (keyState.S ? 1 : 0) - (keyState.W ? 1 : 0);

  if (x === 1 && y === 1) return "↘";
  if (x === -1 && y === 1) return "↙";
  if (x === 1 && y === -1) return "↗";
  if (x === -1 && y === -1) return "↖";
  if (x === 1 && y === 0) return "→";
  if (x === -1 && y === 0) return "←";
  if (x === 0 && y === 1) return "↓";
  if (x === 0 && y === -1) return "↑";
  return null;
}

function getDirectionFromGamepad(x, y) {
  const threshold = 0.5;
  const xDir = x > threshold ? 1 : x < -threshold ? -1 : 0;
  const yDir = y > threshold ? 1 : y < -threshold ? -1 : 0;

  if (xDir === 1 && yDir === 1) return "↘";
  if (xDir === -1 && yDir === 1) return "↙";
  if (xDir === 1 && yDir === -1) return "↗";
  if (xDir === -1 && yDir === -1) return "↖";
  if (xDir === 1 && yDir === 0) return "→";
  if (xDir === -1 && yDir === 0) return "←";
  if (xDir === 0 && yDir === 1) return "↓";
  if (xDir === 0 && yDir === -1) return "↑";
  return null;
}

function checkCommand(history) {
  let step = 0;
  let lastTime = null;

  for (let i = 0; i < history.length; i++) {
    const { input, frame } = history[i];
    if (input === command[step]) {
      if (lastTime !== null && frame - lastTime > maxDelay) {
        return false;
      }
      lastTime = frame;
      step++;
      if (step === command.length) return true;
    }
  }

  return false;
}

function renderHistory() {
  const icons = {
    "→": "➡️", "←": "⬅️", "↑": "⬆️", "↓": "⬇️",
    "↘": "↘️", "↙": "↙️", "↗": "↗️", "↖": "↖️",
    "P": "🅿️", null: "・"
  };

  const recent = inputHistory.slice(-10).map(i => icons[i.input] || "？");
  historyDiv.textContent = recent.join(" ");
}

function showSuccessMessage() {
  log.textContent = "成功！波動拳コマンド入力！";
  cooldown = true;
  setTimeout(() => {
    log.textContent = "キーボードまたはコントローラーで入力してください。";
    cooldown = false;
    inputHistory = [];
  }, 1000);
}

function update() {
  if (cooldown) {
    requestAnimationFrame(update);
    return;
  }

  const gamepads = navigator.getGamepads();
  const gp = gamepads[0];

  let input = null;

  if (gp) {
    const x = gp.axes[0];
    const y = gp.axes[1];
    const buttonPressed = gp.buttons[0].pressed;
    input = getDirectionFromGamepad(x, y) || (buttonPressed ? "P" : null);
  }

  const keyInput = getDirectionFromKeys();
  if (keyState.U || keyState.J) input = "P";
  if (keyInput) input = keyInput;

  inputHistory.push({ input, frame: performance.now() });
  if (inputHistory.length > maxFrames) inputHistory.shift();

  if (checkCommand(inputHistory)) {
    showSuccessMessage();
  }

  renderHistory();
  requestAnimationFrame(update);
}

window.addEventListener("keydown", (e) => {
  if (keyState.hasOwnProperty(e.key.toUpperCase())) {
    keyState[e.key.toUpperCase()] = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (keyState.hasOwnProperty(e.key.toUpperCase())) {
    keyState[e.key.toUpperCase()] = false;
  }
});

window.addEventListener("gamepadconnected", () => {
  log.textContent = "コントローラー接続済み。入力を開始してください。";
  update();
});

// キーボードのみでも動作開始
update();
