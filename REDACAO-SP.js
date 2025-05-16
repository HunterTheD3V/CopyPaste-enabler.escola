// ==UserScript==
// @name         CopyPaste Enabler
// @namespace    https://github.com/HunterTheD3V/
// @version      1.0
// @description  Remove bloqueios de copiar, colar, recortar, selecionar texto e botão direito. Feito por Hunter. DONT FUCK WITH COPYPASTE BRO!
// @author       HunterCr4ft
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const desbloquear = () => {
        const bypassEvent = (e) => {
            e.stopImmediatePropagation();
            return true;
        };

        document.addEventListener("copy", bypassEvent, true);
        document.addEventListener("cut", bypassEvent, true);
        document.addEventListener("paste", bypassEvent, true);
        document.addEventListener("contextmenu", bypassEvent, true);

        // Permitir selecionar texto
        const all = document.querySelectorAll('*');
        all.forEach(el => {
            el.style.userSelect = 'text';
            el.style.webkitUserSelect = 'text';
            el.style.msUserSelect = 'text';
            el.style.mozUserSelect = 'text';
        });

        console.log("✅ CopyPaste Enabler: Tudo liberado pra copiar e colar!");
        alert("CopyPaste Enabler: Bloqueios removidos com sucesso! Dont fuck with copypaste bro. FEITO POR HUNTER");
    };

    window.addEventListener('load', () => {
        desbloquear();
    });
})();
