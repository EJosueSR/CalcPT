function calculate() {
    const input = document.getElementById('expression').value.trim();
    const output = document.getElementById('output');
    const tableContainer = document.getElementById('truthTableContainer');
    let steps = [];

    if (!input) {
        output.innerText = "Por favor, ingrese una expresión.";
        return;
    }

    const variables = [...new Set(input.match(/[a-zA-Z]+/g))].filter(v => v !== 'true' && v !== 'false').sort();

    if (variables.length > 0) {
        output.innerHTML = "Generando tabla de verdad...";
        generateTruthTable(input, variables);
        tableContainer.style.display = "block";
    } else {
        tableContainer.style.display = "none";
        try {
            let expr = input.replace(/true/g, '1').replace(/false/g, '0');
            const parenRegex = /\(([^()]+)\)/;
            while (parenRegex.test(expr)) {
                expr = expr.replace(parenRegex, (_, innerExpr) => {
                    const evaluated = evaluateLogical(innerExpr, steps);
                    steps.push(`(${innerExpr}) → ${evaluated}`);
                    return evaluated;
                });
            }

            const final = evaluateLogical(expr, steps);
            steps.push(`Resultado final: ${final === '1' ? 'true' : 'false'}`);
            output.innerHTML = steps.join('<br>');
        } catch (error) {
            output.innerText = "Error en la expresión";
        }
    }
}

function generateTruthTable(expression, variables) {
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');

    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    variables.forEach(v => {
        const th = document.createElement('th');
        th.innerText = v;
        tableHeader.appendChild(th);
    });
    const resultTh = document.createElement('th');
    resultTh.innerText = expression;
    tableHeader.appendChild(resultTh);

    const rows = Math.pow(2, variables.length);

    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        let currentExpr = expression;

        variables.forEach((variable, index) => {
            const divisor = Math.pow(2, variables.length - 1 - index);
            const value = Math.floor(i / divisor) % 2;

            const td = document.createElement('td');
            td.innerText = value;
            tr.appendChild(td);

            const regex = new RegExp(`\\b${variable}\\b`, 'g');
            currentExpr = currentExpr.replace(regex, value);
        });

        try {
            currentExpr = currentExpr.replace(/true/g, '1').replace(/false/g, '0');
            const parenRegex = /\(([^()]+)\)/;
            while (parenRegex.test(currentExpr)) {
                currentExpr = currentExpr.replace(parenRegex, (_, innerExpr) => {
                    return evaluateLogical(innerExpr, []);
                });
            }

            const result = evaluateLogical(currentExpr, []);

            const resultTd = document.createElement('td');
            resultTd.innerText = result;
            if (result === '1') {
                resultTd.style.color = '#e8a618';
                resultTd.style.fontWeight = 'bold';
            }
            tr.appendChild(resultTd);

        } catch (e) {
            const errorTd = document.createElement('td');
            errorTd.innerText = "Error";
            tr.appendChild(errorTd);
        }

        tableBody.appendChild(tr);
    }
}

function evaluateLogical(expr, steps) {
    expr = expr.replace(/\s+/g, '');

    const notRegex = /!([01])/;
    while (notRegex.test(expr)) {
        expr = expr.replace(notRegex, (_, a) => {
            const result = a === '1' ? '0' : '1';
            steps.push(`!${a} → ${result}`);
            return result;
        });
    }

    const andRegex = /([01])&&([01])/;
    while (andRegex.test(expr)) {
        expr = expr.replace(andRegex, (_, a, b) => {
            const result = (a === '1' && b === '1') ? '1' : '0';
            steps.push(`${a} && ${b} → ${result}`);
            return result;
        });
    }

    const orRegex = /([01])\|\|([01])/;
    while (orRegex.test(expr)) {
        expr = expr.replace(orRegex, (_, a, b) => {
            const result = (a === '1' || b === '1') ? '1' : '0';
            steps.push(`${a} || ${b} → ${result}`);
            return result;
        });
    }

    return expr;
}

window.onload = function () {
    const modal = document.getElementById("welcomeModal");
    modal.style.display = "block";
}

function openModal() {
    const modal = document.getElementById("welcomeModal");
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("welcomeModal");
    modal.style.display = "none";
}

window.onclick = function (event) {
    const modal = document.getElementById("welcomeModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
