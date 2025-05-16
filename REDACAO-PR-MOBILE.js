// ==UserScript==
// @name         CopyPaste Enabler PR (Mobile)
// @namespace    https://github.com/HunterTheD3V
// @version      1.1
// @description  VERSÃO MOBILE: Copiar e colar com digitação automática nas plataformas do paraná (Redação Paraná, Leia Paraná e CMSP-PR). Feito por Hunter & sugerido por gregyrlk
// @author       HunterCr4ft
// @match        *://*.pr.gov.br/*
// @grant        none
// ==/UserScript==

(function () {

    'use strict';

    const logo = "https://media.discordapp.net/attachments/1373062593429770346/1373084556260802621/IMG_4189.jpg?ex=68292024&is=6827cea4&hm=bc6bc67f57435cd2df7f297690d3c106eaf0124e6a58f25d4f6fabc8c94ff970&=&format=webp&width=1051&height=788"; // Logo customizável

    let ultimoFoco = null;

    document.addEventListener('focusin', (e) => {

        const el = e.target;

        if (el && (el.isContentEditable || ['TEXTAREA', 'INPUT'].includes(el.tagName))) {

            ultimoFoco = el;

        }

    });



    function digitarTexto(elemento, texto, delay = 3) {

        let i = 0;

        function digitar() {

            if (i >= texto.length || !elemento) return;

            const char = texto[i];

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

        const btnToggle = document.createElement('div');

        btnToggle.id = 'copypaste-toggle';

        btnToggle.innerHTML = `<img src="${logo}" alt="Logo" />`;



        const container = document.createElement('div');

        container.id = 'copypaste-widget';

        container.style.display = 'none';


        container.innerHTML = `

            <strong>✏️ Copiar & Colar</strong>

            <textarea placeholder="Cole aqui seu texto..."></textarea>

            <div id="copypaste-timer"></div>

            <button id="digitar-btn">Inserir como digitação</button>

            <button id="fechar-btn">Fechar</button>


            <style>

                #copypaste-toggle {

                    position: fixed;

                    bottom: 90px;

                    right: 20px;

                    width: 60px;

                    height: 60px;

                    background: white;

                    border-radius: 50%;

                    box-shadow: 0 0 10px rgba(0,0,0,0.3);

                    z-index: 99999;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    cursor: pointer;

                }

                #copypaste-toggle img {

                    width: 40px;

                    height: 40px;

                }

                #copypaste-widget {

                    position: fixed;

                    bottom: 20px;

                    right: 20px;

                    background: rgba(0,0,0,0.85);

                    color: white;

                    padding: 16px;

                    border-radius: 10px;

                    z-index: 99999;

                    font-family: sans-serif;

                    box-shadow: 0 0 8px rgba(0,0,0,0.5);

                    width: 90vw;

                    max-width: 340px;

                }

                #copypaste-widget textarea {

                    width: 100%;

                    height: 100px;

                    resize: none;

                    margin-top: 8px;

                    border-radius: 4px;

                    border: none;

                    padding: 8px;

                    font-size: 16px;

                }

                #copypaste-widget button {

                    margin-top: 10px;

                    width: 100%;

                    padding: 12px;

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

                    margin-top: 8px;

                    text-align: center;

                    font-size: 15px;

                    color: #ffeb3b;

                }

            </style>

        `;



        document.body.appendChild(btnToggle);

        document.body.appendChild(container);



        const textarea = container.querySelector('textarea');

        const btnDigitar = container.querySelector('#digitar-btn');

        const btnFechar = container.querySelector('#fechar-btn');

        const timerDisplay = container.querySelector('#copypaste-timer');



        btnToggle.addEventListener('click', () => {

            container.style.display = container.style.display === 'none' ? 'block' : 'none';

        });



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

        });

    }



    window.addEventListener('load', () => {

        setTimeout(() => {

            criarMenu();

            console.log("> CopyPaste Enabler PR: Modo Mobile com botão expansível ativado.");

        }, 1000);

    });



})();

