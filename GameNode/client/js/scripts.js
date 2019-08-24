function changeView(id) {
    const old = document.querySelector('.active');
    const next = document.querySelector('#' + id);
    const show = document.querySelector('#back-btn');

    next.classList.add('active');
    next.style.animation = 'fadeIn 0.2s ease forwards';

    old.style.animation = 'fadeOut 0.2s ease forwards';
    old.classList.remove('active');

    show.style.visibility = 'true';
}

var circle;

function main() {
    const duration = 10000;
    circle = new ProgressBar.Circle('.circle', {
        strokeWidth: 6,
        easing: 'linear',
        duration: duration,
        trailWidth: 1,
        svgStyle: {
            // transform: 'rotate(180deg)'
        },
        from: { color: '#dc0000', remaining: 0 },
        to: { color: '#32a852', remaining: duration/1000 },
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.setText(Math.ceil(state.remaining));
        },
        text: {
            className: 'circle-text',
        }
    });
    circle.set(1);
    circle.animate(0);  // Number from 0.0 to 1.0
}

setTimeout(main, 0);