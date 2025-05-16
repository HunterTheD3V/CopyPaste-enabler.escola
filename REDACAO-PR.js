// ==UserScript==
// @name         CopyPaste Enabler PR
// @namespace    https://github.com/HunterTheD3V
// @version      1.0
// @description  Copiar e colar em plataformas do paraná (Redação Paraná, Leia Paraná e CMSP-PR). Feito por Hunter & sugerido por gregyrlk
// @author       HunterCr4ft
// @match        *://*.pr.gov.br/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let ultimoFoco = null;

    // Captura todo campo focável
    document.addEventListener('focusin', (e) => {
        const el = e.target;
        if (el && (el.isContentEditable || ['TEXTAREA', 'INPUT'].includes(el.tagName))) {
            ultimoFoco = el;
        }
    });

    function digitarTexto(elemento, texto, delay = 3) {
        let i = 0;

        function digitar() {
            if (i >= texto.length) return;

            const char = texto[i];
            if (!elemento) return;

            // Se for um contentEditable (tipo Quill.js)
            if (elemento.isContentEditable) {
                elemento.focus();
                document.execCommand("insertText", false, char);
            }

            // Se for um <input> ou <textarea>
            else if (['TEXTAREA', 'INPUT'].includes(elemento.tagName)) {
                const val = elemento.value + char;
                const lastVal = elemento.value;
                elemento.value = val;

                // Compatibilidade com React
                const tracker = elemento._valueTracker;
                if (tracker) tracker.setValue(lastVal);
                elemento.dispatchEvent(new Event("input", { bubbles: true }));
            }

            i++;
            setTimeout(digitar, delay);
        }

        digitar();
    }

    function criarMenu() {
        const container = document.createElement('div');
        container.id = 'copypaste-widget';
        container.style.display = 'none';

        container.innerHTML = `
            <style>
                #copypaste-widget {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: rgba(0,0,0,0.85);
                    color: white;
                    padding: 12px;
                    border-radius: 8px;
                    z-index: 99999;
                    font-family: sans-serif;
                    box-shadow: 0 0 8px rgba(0,0,0,0.5);
                    width: 250px;
                }
                #copypaste-widget textarea {
                    width: 100%;
                    height: 80px;
                    resize: none;
                    margin-top: 8px;
                    border-radius: 4px;
                    border: none;
                    padding: 6px;
                    font-size: 14px;
                }
                #copypaste-widget button {
                    margin-top: 8px;
                    width: 100%;
                    padding: 6px;
                    border: none;
                    border-radius: 4px;
                    background: #4CAF50;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                }
                #copypaste-widget #fechar-btn {
                    background: #FF5722;
                }
                #copypaste-timer {
                    margin-top: 6px;
                    text-align: center;
                    font-size: 13px;
                    color: #ffeb3b;
                }
            </style>
            <strong>✏️ Copiar & Colar (PR)</strong>
            <textarea placeholder="Cole aqui seu texto..."></textarea>
            <div id="copypaste-timer"></div>
            <button id="digitar-btn">Inserir como digitação</button>
            <button id="fechar-btn">Fechar Menu</button>
        `;

        document.body.appendChild(container);

        const textarea = container.querySelector('textarea');
        const btnDigitar = container.querySelector('#digitar-btn');
        const btnFechar = container.querySelector('#fechar-btn');
        const timerDisplay = container.querySelector('#copypaste-timer');

        btnDigitar.addEventListener('click', () => {
            const texto = textarea.value.trim();
            if (!texto) return alert("Cole um texto primeiro.");

            if (!ultimoFoco || !(ultimoFoco.isContentEditable || ["TEXTAREA", "INPUT"].includes(ultimoFoco.tagName))) {
                return alert("> CopyPaste Enabler PR: Foque no campo de digitação antes de colar.");
            }

            if (!ultimoFoco.isContentEditable) ultimoFoco.value = "";

            let segundos = 5;
            timerDisplay.textContent = `Digitando em ${segundos} segundos...`;
            const countdown = setInterval(() => {
                segundos--;
                if (segundos > 0) {
                    timerDisplay.textContent = `Digitando em ${segundos} segundos...`;
                } else {
                    clearInterval(countdown);
                    timerDisplay.textContent = '';
                    ultimoFoco.focus();
                    digitarTexto(ultimoFoco, texto);
                }
            }, 1000);
        });

        btnFechar.addEventListener('click', () => {
            container.style.display = 'none';
            alert("Menu fechado. Use 's+o' para abrir, 's+f' para fechar.");
        });
    }

    function escutarAtalhosMenu() {
        let ultimaTecla = '';
        document.addEventListener('keydown', (e) => {
            if (ultimaTecla === 's' && e.key.toLowerCase() === 'o') {
                const menu = document.getElementById('copypaste-widget');
                if (menu) menu.style.display = 'block';
            }
            if (ultimaTecla === 's' && e.key.toLowerCase() === 'f') {
                const menu = document.getElementById('copypaste-widget');
                if (menu) menu.style.display = 'none';
            }
            ultimaTecla = e.key.toLowerCase();
            setTimeout(() => ultimaTecla = '', 500);
        });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            criarMenu();
            escutarAtalhosMenu();
            console.log("> CopyPaste Enabler: script pronto.");
            alert("> CopyPaste Enabler PR: obrigado por baixar nosso script. O script está pronto para ser usado. Digite \"S\" seguido de \"O\" para abrir o menu (e \"S\" seguido de \"F\" para fechar). VERSÃO DO PARANÁ FEITA POR HunterCr4ft / sugerido por gregyrlk.");
        }, 1000);
    });
})();
