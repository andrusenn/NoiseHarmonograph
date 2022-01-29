/*
Perpetual noise Harmonograph

The Harmonograph is a gen drawing machine that works with pendulums.
The duration of the movement depends on the input forces and random environmental conditions.
But in the digital world, we can make it perpetual.
Here is an infinite harmonograph breathing in a state of noise.

2 pendulum fot the Harmonograph.
3 separate layers.

Keys

[1][2][3] -> show/hide layers
[4] -> 1:1
[5] -> 16:9
[6] -> 9:16
[p] -> pause/play
[s] -> save / download

Andrés Senn - 2022 - https://www.fxhash.xyz/u/andrusenn
Licence: (CC BY-SA 4.0)
*/
let harmo,
	pause = false;
let rot = 0;
let cv;
let layer1, layer2, layer3, nsig;
let show_l1 = true;
let show_l2 = true;
let show_l3 = true;
let AR, LS, PT, SQ;
function setup() {
	// Ratios -------------------
	SQ = createVector(2160, 2160);
	LS = createVector(3840, 2160);
	PT = createVector(2160, 3840);
	AR = SQ;
	// --------------------------
	cv = createCanvas(AR.x, AR.y);
	cv.parent("cv");
	cv.id("Perpetual_Noise_Harmonograph");
	cv.class("Perpetual_Noise_Harmonograph");
	pixelDensity(1);
	// Layers ----------------------------
	layer1 = createGraphics(width, height);
	layer2 = createGraphics(width, height);
	layer3 = createGraphics(width, height);
	nsig = createGraphics(width, height);
	// General rand
	seed = fxrand() * 100000000000;
	// fxhash features
	window.$fxhashFeatures = {
		seed: seed,
		pendulum_center_x: map(fxrand(), 0, 1, -width / 2, width / 2),
		pendulum1_theta_vel: radians(map(fxrand(), 0, 1, 0.001, 0.002)),
		pendulum1_phi_vel: radians(map(fxrand(), 0, 1, 0.001, 0.002)),
		pendulum2_alpha_vel: radians(map(fxrand(), 0, 1, 0.1, 0.2)),
		initial_rotation: fxrand() * TAU,
		pendulum_friction: map(fxrand(), 0, 1, 0.999998, 0.999997),
		noise_wave_diameter: map(fxrand(), 0, 1, 2160 * 0.2, 2160 * 0.5),
		background_noise_size: map(fxrand(), 0, 1, 0.0005, 0.001),
	};
	background(0);
	// Initial rotation
	rot = window.$fxhashFeatures.initial_rotation;
	// Init draw
	init();
	// ----------------------------
	document.title = `\u007e Perpetual Noise Harmonograph \u007e | Andr\u00e9s Senn | 2022`;
	console.log(
		`%c Perpetual Noise Harmonograph | Andr\u00e9s Senn | fxhash 01/2022 | Projet code: https://github.com/andrusenn/NoiseHarmonograph`,
		"background:#111;border-radius:10px;background-size:15%;color:#fff;padding:10px;font-size:15px;text-align:center;",
	);
}
function init() {
	layer1 = createGraphics(AR.x, AR.y);
	layer2 = createGraphics(AR.x, AR.y);
	layer3 = createGraphics(AR.x, AR.y);
	nsig = createGraphics(AR.x, AR.y);
	drawBg();
	// Hash signature & just noise (I like it)
	noisemix(width / 2, height / 2 + 1000);
}
function draw() {
	background(0);
	if (!pause) {
		layer3.push();
		layer3.translate(width / 2, height / 2);
		layer3.rotate(rot);
		layer3.translate(-width / 2, -height / 2);
		for (let i = 0; i < 500; i++) {
			harmo.update();
			layer3.push();
			layer3.translate(2160 / 2, 2160 / 2);

			if (AR == LS) {
				layer3.translate((3840 - 2160) / 2, 0);
			}
			if (AR == PT) {
				layer3.translate(0, (3840 - 2160) / 2);
			}
			layer3.stroke(255, 50);
			layer3.strokeWeight(5);
			layer3.point(harmo.x - 3, harmo.y - 3);
			layer3.stroke(0);
			layer3.strokeWeight(3);
			layer3.point(harmo.x, harmo.y);
			layer3.pop();
		}
		layer3.pop();
	}
	if (show_l1) {
		image(layer1, 0, 0);
	}
	if (show_l2) {
		image(layer2, 0, 0);
	}
	if (show_l3) {
		image(layer3, 0, 0);
	}
	image(nsig, 0, 0);

	// ----------------------
	if (frameCount == 600) {
		if (!isFxpreview) {
			fxpreview();
		}
	}
}
function noisemix(_x, _y) {
	const sigRot = [0,90,180,270];
	nsig.push();
	nsig.translate(width / 2, height / 2);
	nsig.rotate(radians(sigRot[int(floor(random(0,4)))]));
	nsig.translate(-width / 2, -height / 2);

	nsig.rectMode(CENTER);
	let chars = fxhash.split("");
	let x = 0;
	let y = 0;
	let _w = random(216, 2160 * 0.8);
	let _h = random(10, 20);
	for (let j = 0; j < 5; j++) {
		for (let i = 0; i < 10; i++) {
			let col = map(chars[i + j * 10].charCodeAt(0), 0, 122, 0, 255);
			nsig.fill(col);
			nsig.noStroke();
			nsig.rect(x + _x - 150, y + _y - _h / 2, 10, 5);
			x = i * 30;
		}
		y = j * 5;
	}
	let s = random(10, 15);
	let c = random(0, 255);
	let w = _w;
	let h = _h;
	for (let x = _x - w / 2; x < _x + w / 2; x += s) {
		for (let y = _y - h / 2; y < _y + h / 2; y += s) {
			s = random(0.1, 2);
			c = 255;
			if (random(1) > 0.5) {
				c = 0;
			}
			nsig.noStroke();
			nsig.fill(c);
			nsig.rect(x, y - 50, s + random(1, 50), s);
		}
	}
	nsig.pop();
}
function drawBg() {
	noiseSeed(seed);
	randomSeed(seed);
	// Layer 0
	let bgns = window.$fxhashFeatures.background_noise_size;
	layer1.translate(width / 2 - 600, height / 2 + 1000);
	for (let x = -width / 2 + 600; x < width / 2 + 600; x += 10) {
		for (let y = -height / 2 - 1000; y < height / 2 - 1000; y += 10) {
			let n = noise(x * bgns, y * bgns);
			layer1.push();
			layer1.translate(x, y);
			layer1.noStroke();
			layer1.fill(255 * n, 255);
			layer1.square(0, 0, 10);
			layer1.pop();
		}
	}

	let ns = 0.001;
	// figure diameter
	let diam = window.$fxhashFeatures.noise_wave_diameter;

	// Layer 1 --------------------------------------------
	layer2.push();
	// Fix positions
	if (AR == LS) {
		layer2.translate((3840 - 2160) / 2, 0);
	}
	if (AR == PT) {
		layer2.translate(0, (3840 - 2160) / 2);
	}
	layer2.translate(0, random(-600, 600));
	for (let x = 100; x < 2160 - 100; x += 10) {
		for (let y = 100; y < 2160 - 100; y += 10) {
			let d = dist(x, y, 2160 / 2, 2160 / 2);
			if (d < diam && d > diam - 200) {
				let n = noise(x * ns, y * ns, 0);
				let n2 = noise(x * 0.001, y * 0.001, 0);
				ns = map(n2, 0, 1, 0.001, 0.008);
				let a = map(n, 0, 1, 0, TAU);
				layer2.push();
				layer2.translate(x, y);
				layer2.rotate(a);
				layer2.stroke(255, n * 150);
				layer2.strokeWeight(0.6);
				layer2.line(0, 0, 0, 100);
				layer2.noStroke();
				layer2.fill(0, n * 100);
				layer2.circle(0, 100, map(n, 0, 1, 3, 10));
				layer2.pop();
			}
		}
	}
	layer2.pop();

	// Layer 2 -> Harmo settings -----------------------
	harmo = new Harmonograph();
	// Pendulum 1 center
	harmo.cx = window.$fxhashFeatures.pendulum_center_x;
	// Pendulum asc
	harmo.vel_theta = window.$fxhashFeatures.pendulum1_theta_vel;
	harmo.vel_phi = window.$fxhashFeatures.pendulum1_phi_vel;
	harmo.vel_alpha = window.$fxhashFeatures.pendulum2_alpha_vel;
	// Friction
	harmo.friction = window.$fxhashFeatures.pendulum_friction;
	// Noise resolution
	harmo.noise_size2x = random(0.001, 0.002);
	harmo.noise_size2y = random(0.001, 0.002);
}
function getPrint() {
	let date =
		year() +
		"" +
		month() +
		"" +
		day() +
		"" +
		hour() +
		"" +
		minute() +
		"" +
		second() +
		"";
	saveCanvas(cv, "PNH_" + date, "png");
}
function keyReleased() {
	if (key == "4" && AR != SQ) {
		AR = SQ;
		resizeCanvas(AR.x, AR.y);
		init();
	}
	if (key == "5" && AR != LS) {
		AR = LS;
		resizeCanvas(AR.x, AR.y);
		init();
	}
	if (key == "6" && AR != PT) {
		AR = PT;
		resizeCanvas(AR.x, AR.y);
		init();
	}
	if (key == "1") {
		show_l1 = !show_l1;
	}

	if (key == "2") {
		show_l2 = !show_l2;
	}

	if (key == "3") {
		show_l3 = !show_l3;
	}
	if (key == "0") {
		show_l1 = true;
		show_l2 = true;
		show_l3 = true;
	}
	if (key == "p" || key == "P") {
		pause = !pause;
	}
	if (key == "s" || key == "S") {
		console.log(
			`%c SAVING ${
				String.fromCodePoint(0x1f5a4) + String.fromCodePoint(0x1f90d)
			}`,
			"background: #000; color: #ccc;padding:5px;font-size:15px",
		);
		getPrint();
	}
}
// https://openprocessing.org/sketch/452148
class Harmonograph {
	constructor() {
		this.theta = 0.0;
		this.phi = 0.0;
		this.vel_theta = 0;
		this.vel_phi = 0;
		this.alpha = 0.0;
		this.radio_x1;
		this.vel_alpha = 0;
		this.friction = 0;
		this.multr = 1;
		this.x = 0.0;
		this.y = 0.0;

		// Centro del plano / Center of plane
		this.cx = 0.0;
		this.cy = 0.0;

		this.movx = 0.0;
		this.movy = 0.0;
		this.initrx2 = 0;
		this.initry2 = 0;
		this.noise_size = 0.001;
		this.noise_size2x = 0;
		this.noise_size2y = 0;
		this.n;
		this.n2;
		this.fr = true;
	}
	setVelPendulum1() {}
	update() {
		this.n = noise(this.x * this.noise_size, this.y * this.noise_size);
		this.n2 = noise(this.x * this.noise_size2x, this.y * this.noise_size2y);
		this.noise_size = map(this.n2, 0, 1, 0.002, 0.008);
		let rx1 = map(this.n, 0, 1, 2160 * 0.01, 2160 * 0.1) * this.multr;
		let ry1 = map(this.n, 0, 1, 2160 * 0.1, 2160 * 0.01) * this.multr;
		let rx2 = map(this.n, 0, 1, 2160 * 0.25, 2160 * 0.4) * this.multr;
		let ry2 = map(this.n, 0, 1, 2160 * 0.25, 2160 * 0.4) * this.multr;
		// Pendulum 1
		this.cx = this.movx + cos(-this.theta) * rx1;
		this.cy = this.movy + sin(this.phi) * ry1;
		// Pendulum 2
		this.x = this.cx + sin(this.alpha) * rx2;
		this.y = this.cy + cos(this.alpha) * ry2;

		this.theta += this.vel_theta;
		this.phi += this.vel_phi;
		if (this.multr < 0.1 && this.fr) {
			this.fr = false;
		}
		if (this.multr > 0.99 && !this.fr) {
			this.fr = true;
		}
		if (this.fr) {
			this.multr *= this.friction;
		} else {
			this.multr /= this.friction;
		}

		this.alpha += this.vel_alpha;
		// add center movement
		this.movx -= 0;
		this.movy -= 0;
	}
}
