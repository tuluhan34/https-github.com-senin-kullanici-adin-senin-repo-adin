document.querySelectorAll('[data-confirm]').forEach(function (el) {
    el.addEventListener('submit', function (event) {
        var msg = el.getAttribute('data-confirm') || 'Are you sure?';
        if (!window.confirm(msg)) {
            event.preventDefault();
        }
    });
});
