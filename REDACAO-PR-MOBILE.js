// ==UserScript==
// @name         CopyPaste Enabler PR (Mobile)
// @namespace    https://github.com/HunterTheD3V
// @version      1.0
// @description  VERSÃO MOBILE: Copiar e colar com digitação automática nas plataformas do paraná (Redação Paraná, Leia Paraná e CMSP-PR). Feito por Hunter & sugerido por gregyrlk
// @author       HunterCr4ft
// @match        *://*.pr.gov.br/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let ultimoFoco = null;

    // Salva o campo focado (input, textarea, ou contenteditable)
    document.addEventListener('focusin', (e) => {
        const el = e.target;
        if (el && (el.isContentEditable || ['TEXTAREA', 'INPUT'].includes(el.tagName))) {
            ultimoFoco = el;
        }
    });

    // Digitação simulada
    function digitarTexto(elemento, texto, delay = 3) {
        let i = 0;

        function digitar() {
            if (i >= texto.length) return;
            const char = texto[i];
            if (!elemento) return;

            if (elemento.isContentEditable) {
                elemento.focus();
                document.execCommand("insertText", false, char);
            } else if (['TEXTAREA', 'INPUT'].includes(elemento.tagName)) {
                const val = elemento.value + char;
                const lastVal = elemento.value;
                elemento.value = val;

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
        container.style.display = 'block'; // Sempre visível no mobile

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
                    width: 90vw;
                    max-width: 320px;
                }
                #copypaste-widget textarea {
                    width: 100%;
                    height: 80px;
                    resize: none;
                    margin-top: 8px;
                    border-radius: 4px;
                    border: none;
                    padding: 6px;
                    font-size: 16px;
                }
                #copypaste-widget button {
                    margin-top: 8px;
                    width: 100%;
                    padding: 10px;
                    border: none;
                    border-radius: 4px;
                    background: #4CAF50;
                    color: white;
                    font-weight: bold;
                    font-size: 16px;
                    cursor: pointer;
                }
                #copypaste-widget #fechar-btn {
                    background: #FF5722;
                }
                #copypaste-timer {
                    margin-top: 6px;
                    text-align: center;
                    font-size: 15px;
                    color: #ffeb3b;
                }
            </style>
            <strong>✏️ MOBILE: Copiar & Colar (PR)</strong>
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
                return alert("> CopyPaste Enabler PR: Toque no campo onde deseja digitar antes.");
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
            alert("> CopyPaste Enabler PR: Menu fechado. Recarregue a página para reabrir.");
        });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            criarMenu();
            console.log("> CopyPaste Enabler PR: Modo Mobile ativo.");
        }, 1000);
    });
})();
