/* Motion adapted from observed Gameplex patterns. No external animation runtime. */
(function () {
  'use strict';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var fine = matchMedia('(hover: hover) and (pointer: fine)');
  var initialized = false, activeCard = null, pendingFrame = 0, lastPointer = null;
  var entrances = new Set();
  var interactive = '.btn,.qp,.qp1,.ui-icon-btn,#menu-btn,#fs-btn,#lock-btn,.mc';

  function resetCard() {
    if (pendingFrame) cancelAnimationFrame(pendingFrame);
    pendingFrame = 0;
    if (activeCard) {
      activeCard.style.removeProperty('transform');
      activeCard.classList.remove('motion-tracking');
    }
    activeCard = null;
  }

  function pointerFrame() {
    pendingFrame = 0;
    if (!activeCard || !lastPointer || reduced.matches || !fine.matches) return;
    var rect = activeCard.getBoundingClientRect();
    var x = Math.max(0, Math.min(1, (lastPointer.x - rect.left) / rect.width));
    var y = Math.max(0, Math.min(1, (lastPointer.y - rect.top) / rect.height));
    activeCard.style.transform = 'perspective(1000px) rotateX(' + ((.5 - y) * 4).toFixed(2) + 'deg) rotateY(' + ((x - .5) * 4).toFixed(2) + 'deg) translateY(-3px)';
  }

  function enter(viewId) {
    if (reduced.matches || document.body.classList.contains('motion-keyboard')) return;
    var root = document.getElementById('view-' + viewId);
    if (!root) return;
    // Cancel an interrupted navigation before starting the next transition.
    entrances.forEach(function(a) { a.cancel(); }); entrances.clear();
    var targets = Array.from(root.querySelectorAll('.ranking-heading,.page-heading,.sh,.leader-card,.classification-heading,.ranking-table,.st-tools,.scan-cfg,.hall-bim,.es')).slice(0,10);
    targets.forEach(function(el, i) {
      var anim = el.animate([
        { opacity: .55, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 280, delay: Math.min(i * 35, 175), easing: 'cubic-bezier(.23,1,.32,1)' });
      entrances.add(anim); anim.onfinish = anim.oncancel = function() { entrances.delete(anim); };
    });
  }

  function init() {
    if (initialized) return; initialized = true;
    document.documentElement.classList.add('motion-ready');
    document.addEventListener('keydown', function(e) {
      if (['Tab','Enter',' ','Escape','ArrowUp','ArrowDown'].includes(e.key)) {
        document.body.classList.add('motion-keyboard'); resetCard();
      }
    }, true);
    document.addEventListener('pointerdown', function() { document.body.classList.remove('motion-keyboard'); }, true);
    document.addEventListener('pointerover', function(e) {
      if (reduced.matches || !fine.matches || e.pointerType !== 'mouse') return;
      var button = e.target.closest(interactive);
      if (button && !button.contains(e.relatedTarget)) {
        var box = button.getBoundingClientRect();
        button.style.setProperty('--pointer-x', (e.clientX - box.left) + 'px');
        button.style.setProperty('--pointer-y', (e.clientY - box.top) + 'px');
      }
      var card = e.target.closest('.leader-card');
      if (card && card !== activeCard) {
        resetCard(); activeCard = card; card.classList.add('motion-tracking');
      }
    });
    document.addEventListener('pointermove', function(e) {
      if (!activeCard || !fine.matches || reduced.matches || e.pointerType !== 'mouse') return;
      lastPointer = {x:e.clientX,y:e.clientY};
      if (!pendingFrame) pendingFrame = requestAnimationFrame(pointerFrame);
    }, {passive:true});
    document.addEventListener('pointerout', function(e) {
      if (activeCard && activeCard.contains(e.target) && !activeCard.contains(e.relatedTarget)) resetCard();
    });
    document.addEventListener('scroll', resetCard, true);
    window.addEventListener('blur', resetCard);
    document.addEventListener('visibilitychange', function() { if (document.hidden) resetCard(); });
    function preferenceChanged() {
      resetCard();
      if (reduced.matches) { entrances.forEach(function(a) { a.cancel(); }); entrances.clear(); }
    }
    reduced.addEventListener('change', preferenceChanged);
    fine.addEventListener('change', resetCard);
  }
  window.EPmotion = {init:init, enter:enter};
})();
