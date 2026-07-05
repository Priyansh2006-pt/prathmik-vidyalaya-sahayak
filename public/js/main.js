// Small helpers shared across pages.
// Most forms already use inline onsubmit="return confirm(...)" for delete
// actions, so this file is intentionally light - just a spot to grow into.

document.addEventListener('DOMContentLoaded', function () {
    // Auto-hide flash messages after a few seconds
    document.querySelectorAll('.alert').forEach(function (el) {
        setTimeout(function () {
            el.style.transition = 'opacity 0.4s ease';
            el.style.opacity = '0';
            setTimeout(function () { el.remove(); }, 400);
        }, 4000);
    });
});
