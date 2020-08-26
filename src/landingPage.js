export default `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sudoku solver</title>
    <style>
        body {
            font: 18px sans-serif;
        }

        input {
            font: 24px sans-serif;
            width: 50px;
            max-width: calc(96vw / 9);
            height: 50px;
            max-height: calc(96vw / 9);
            padding: 5px;
            line-height: 40px;
            text-align: center;
            box-sizing: border-box;
            border: none;
            border-right: 1px solid lightgray;
            border-bottom: 1px solid lightgray;
        }

        input.fixed {
            color:rgb(21, 94, 143);
        }

        input.solved {
            color:rgb(100, 163, 58);
        }

        input:nth-of-type(3n) {
            border-right: 1px solid gray;
        }

        input:nth-of-type(9n - 8) {
            border-left: 1px solid gray;
        }

        input:nth-of-type(27n - 8) {
            border-bottom: 1px solid gray;
        }

        input:nth-of-type(27n - 7) {
            border-bottom: 1px solid gray;
        }

        input:nth-of-type(27n - 6) {
            border-bottom: 1px solid gray;
        }

        input:nth-of-type(27n - 5) {
            border-bottom: 1px solid gray;
        }

        input:nth-of-type(27n - 4) {
            border-bottom: 1px solid gray;
        }

        input:nth-of-type(27n - 3) {
            border-bottom: 1px solid gray;
        }

        input:nth-of-type(27n - 2) {
            border-bottom: 1px solid gray;
        }

        input:nth-of-type(27n - 1) {
            border-bottom: 1px solid gray;
        }

        input:nth-of-type(27n) {
            border-bottom: 1px solid gray;
        }


        input:nth-of-type(0n + 9) {
            border-top: 1px solid gray;
        }

        input:nth-of-type(0n + 8) {
            border-top: 1px solid gray;
        }

        input:nth-of-type(0n + 7) {
            border-top: 1px solid gray;
        }

        input:nth-of-type(0n + 6) {
            border-top: 1px solid gray;
        }

        input:nth-of-type(0n + 5) {
            border-top: 1px solid gray;
        }

        input:nth-of-type(0n + 4) {
            border-top: 1px solid gray;
        }

        input:nth-of-type(0n + 3) {
            border-top: 1px solid gray;
        }

        input:nth-of-type(0n + 2) {
            border-top: 1px solid gray;
        }

        input:nth-of-type(0n + 1) {
            border-top: 1px solid gray;
        }

        input:nth-of-type(0n) {
            border-top: 1px solid gray;
        }

        .sudoku-grid {
            position: relative;
            display: grid;
            width: calc(9 * 50px);
            max-width: 96vw;
            height: calc(9 * 50px);
            max-height: 96vw;
            grid-gap: 0;
            grid-template-columns: repeat(9, 1fr);
            grid-template-rows: auto;
            grid-auto-flow: row;
        }

        .sudoku-ctrls {
            display: grid;
            width: calc(9 * 50px);
            max-width: 96vw;
            grid-gap: 0;
            grid-template-columns: repeat(3, auto);
            grid-template-rows: auto;
            grid-auto-flow: row;
        }

        button {
            margin: 15px;
            border-radius: 4px;
            padding: 5px
        }

        .btn-clear{
            background-color:rgba(248, 97, 97, 0.829);
            border: 1px solid rgb(243, 65, 65);
            color: white;
        }

        .btn-demo{
            background-color:rgb(114, 196, 250);
            border: 1px solid rgba(27, 88, 129, 0.938);
        }

        .btn-solve{
            background-color:yellowgreen;
            border: 1px solid rgb(122, 161, 43);
        }

    </style>
</head>

<body onload="initGrid()">
    <h2>Sudoku Solver</h2>
    <p>Fill out sudoku, or use 'demo' for a prefilled one, and press 'solve'. Press 'clear' to start over again.</p>
    <div id="sudoku-container" class="sudoku-grid"></div>
    <div class="sudoku-ctrls"><button onclick="clearGrid()" class="btn-clear">Clear</button><button onclick="demo()" class="btn-demo">Demo</button><button onclick="solve()" class="btn-solve">Solve</button></div>
    <script>

        const sudokuContainer = document.getElementById("sudoku-container");
        let inputs = [];

        function initGrid() {
            let content = "";
            for (let i = 0; i < 81; i++) {
                content += "<input id='cell_" + i + "' maxlength='1' type='text'>";
            }
            sudokuContainer.innerHTML = content;
            for (let i = 0; i < 81; i++) {
                inputs.push(document.getElementById('cell_' + i));
            }
        }

        function clearGrid() {
            let content = "";
            for (let i = 0; i < 81; i++) {
                inputs[i].value = "";
                inputs[i].classList.remove("fixed");
                inputs[i].classList.remove("solved");
                inputs[i].removeAttribute('readonly');
            }
        }

        function demo() {
            const prefilled = [
                0, 5, 0,  0, 0, 0,  0, 9, 0,
                1, 0, 0,  0, 8, 0,  0, 0, 0,
                0, 0, 4,  0, 0, 0,  0, 0, 7,

                0, 0, 0,  7, 0, 0,  0, 0, 0,
                0, 0, 0,  0, 0, 0,  5, 4, 6,
                8, 3, 0,  0, 2, 0,  0, 7, 0,

                3, 0, 0,  2, 0, 0,  6, 0, 0,
                9, 7, 6,  4, 0, 0,  8, 0, 0,
                0, 0, 0,  0, 0, 1,  0, 0, 0
            ];
            for (let i = 0; i < 81; i++) {
                inputs[i].value = (prefilled[i]||"");
            }
        }

        async function solve (){
            let problem = [];
            for (let i = 0; i < 81; i++) {
                problem.push(Number(inputs[i].value) || 0);
            }
            const init = {
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                },
            }
            const solution = await fetch('/', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(problem)
            }).then(response => response.json());
            
            for (let i = 0; i < 81; i++) {
                inputs[i].setAttribute('readonly', true);
                if(solution[i] == Number(inputs[i].value)){
                    inputs[i].classList.add("fixed");
                }else{
                    inputs[i].value = solution[i];
                    inputs[i].classList.add("solved");
                }
            }            
        }

    </script>
</body>

</html>
`;