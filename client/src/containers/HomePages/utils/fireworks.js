import anime from 'animejs';

export function fireworks() {
	window.human = false;

	var canvasEl = document.querySelector('.fireworks');
	var bottomDim = document.querySelector('.bottom-section');
	var ctx = canvasEl.getContext('2d');
	var numberOfParticules = 30;
	var pointerX = 0;
	var pointerY = 0;
	var tap =
		'ontouchstart' in window || navigator.msMaxTouchPoints
			? 'touchstart'
			: 'mousedown';
	var colors = ['#0083BB', '#29BF89', '#7E8D85', '#FBF38C'];

	function setCanvasSize() {
		canvasEl.width = bottomDim.offsetWidth / 2;
		canvasEl.height = bottomDim.offsetHeight / 2;
		canvasEl.style.width = bottomDim.offsetWidth + 'px';
		canvasEl.style.height = bottomDim.offsetHeight + 'px';
		canvasEl.getContext('2d').scale(2, 2);
	}

	function updateCoords(e) {
		pointerX = (e.clientX || e.touches[0].clientX) / 4;
		pointerY = (e.clientY || e.touches[0].clientY) / 4;
	}

	function setParticuleDirection(p) {
		var angle = (anime.random(0, 360) * Math.PI) / 180;
		var value = anime.random(50, 180);
		var radius = [-1, 1][anime.random(0, 1)] * value;
		return {
			x: p.x + radius * Math.cos(angle),
			y: p.y + radius * Math.sin(angle)
		};
	}

	function createParticule(x, y) {
		var p = {};
		p.x = x;
		p.y = y;
		p.color = colors[anime.random(0, colors.length - 1)];
		p.radius = anime.random(4, 8);
		p.endPos = setParticuleDirection(p);
		p.draw = function() {
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
			ctx.fillStyle = p.color;
			ctx.fill();
		};
		return p;
	}

	function createCircle(x, y) {
		var p = {};
		p.x = x;
		p.y = y;
		p.color = '#FFF';
		p.radius = 0.01;
		p.alpha = 0.5;
		p.lineWidth = 2;
		p.draw = function() {
			ctx.globalAlpha = p.alpha;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
			ctx.lineWidth = p.lineWidth;
			ctx.strokeStyle = p.color;
			ctx.stroke();
			ctx.globalAlpha = 1;
		};
		return p;
	}

	function renderParticule(anim) {
		for (var i = 0; i < anim.animatables.length; i++) {
			anim.animatables[i].target.draw();
		}
	}

	function animateParticules(x, y) {
		var circle = createCircle(x, y);
		var particules = [];
		for (var i = 0; i < numberOfParticules; i++) {
			particules.push(createParticule(x, y));
		}
		anime
			.timeline()
			.add({
				targets: particules,
				x: function(p) {
					return p.endPos.x;
				},
				y: function(p) {
					return p.endPos.y;
				},
				radius: 0.05,
				duration: anime.random(1200, 1800),
				easing: 'easeOutExpo',
				update: renderParticule
			})
			.add({
				targets: circle,
				radius: anime.random(80, 160),
				lineWidth: 0,
				alpha: {
					value: 0,
					easing: 'linear',
					duration: anime.random(600, 800)
				},
				duration: anime.random(3000, 6000),
				easing: 'easeOutExpo',
				update: renderParticule,
				offset: 0
			});
	}

	var render = anime({
		duration: Infinity,
		update: function() {
			ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
		}
	});

	document.addEventListener(
		tap,
		function(e) {
			window.human = true;
			render.play();
			updateCoords(e);
			animateParticules(pointerX, pointerY);
		},
		false
	);

	var centerX = bottomDim.offsetWidth / 8;
	var centerY = bottomDim.offsetHeight / 8;

	function autoClick() {
		if (window.human) return;
		animateParticules(
			anime.random(centerX - 50, centerX + 50),
			anime.random(centerY - 50, centerY + 50)
		);
		anime({ duration: 200 }).finished.then(autoClick);
	}

	autoClick();
	setCanvasSize();
	window.addEventListener('resize', setCanvasSize, false);
}
