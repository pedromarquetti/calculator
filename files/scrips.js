const calculator = document.querySelector('.calculator')
const keys = calculator.querySelector(".calculator__keys")
const display = document.querySelector(".calcs")
const curr = document.querySelector(".curr")
const previousKeyType = calculator.dataset.previousKeyType
let calc = new Array()

keys.addEventListener("click", e =>{
    let startsWithPusmin = (val) => { // check if starts with +-
        exp = /^([-]|[+])/
        return exp.test(val)
    };
    let multidivCheck = (val) => { //check if there is 0-9 [*-][*+][/-][/+][×-][×+] 0-9
        let exp = /(\*-)|(\*\+)|(\×\+)|(\×\-)|(\÷\-)|(\÷\+)/;
        return exp.test(val)
    };
    let calculate = (n1,op,n2) => { // calculator
        switch (op) {
            case "+":  
                console.log(typeof op);
                let calc1 = parseFloat(n1) + parseFloat(n2)
                console.log("calc ",`${parseFloat(n1)} ${op} ${parseFloat(n2)} = `,calc1)
                console.log("sum");
                return calc1.toString();
                
            case "-":
                console.log(typeof op);
                let calc2 = parseFloat(n1) - parseFloat(n2)
                console.log("calc ",`${parseFloat(n1)} ${op} ${parseFloat(n2)} = `,calc2)
                console.log("subtrac");
                return calc2.toString();
                    
            case "*": case "×":
                console.log(typeof op);
                let calc3 = parseFloat(n1) * parseFloat(n2)
                console.log("calc ",`${parseFloat(n1)} ${op} ${parseFloat(n2)} = `,calc3)
                console.log("multi");
                return calc3.toString();
                
            case "/": case "÷":
                console.log(typeof op);
                let calc4 = parseFloat(n1) / parseFloat(n2)
                console.log("calc ",`${parseFloat(n1)} ${op} ${parseFloat(n2)} = `,calc4)
                console.log("divide");
                return calc4.toString();
            default:
                break;
            }        
    };         
    let isCalc = (val) => { // test if is calc
        let exp = /([0-9])([+]|[+]|[-]|[-]|[×]|[*]|[/]|[÷]|(\*\-)|(\*\+)|(\÷\-)|(\÷\+))([0-9])/;
        // let exp = /([+]|[+]|[-]|[-]|[×]|[*]|[/]|[÷])/;
        return exp.test(val)
    };
    let multiDiv = (val) => { //check if item is */
        let exp = /([×]|[*]|[/]|[÷])/;
        return exp.test(val)
    };
    let plusMin = (val) => { // check if item is +-
        let exp = /[+]|[-]/;
        return exp.test(val)
    };
    
    if (e.target.matches("button")){
        const key = e.target 
        const action = key.dataset.action 
        const keycontent = key.textContent // key "text"
        const displayednum = display.textContent 
        const currnum = curr.innerHTML 
        const previousKey = display.textContent[display.textContent.length -1]

        if (displayednum === "" && (action === "divide"|| action === "multiply")){
            console.error("no */ on  empty");
        } else if (!action) { //if num is pressed
            calculator.dataset.previousKeyType = "num"
            console.warn("num pressed, appending to str: ");
            console.log(`current key: ${keycontent}, prev key: ${previousKey}`);
            display.append(keycontent)
            calc.push(keycontent)
            // let str = calc.join("")
            // console.log("current str: ",str);
        } else if (action && calculator.dataset.previousKeyType === "num" && action != "clear" && action != "calculate") {
            console.warn("action pressed ");
            console.log(`current key: ${keycontent}, prev key: ${previousKey}`);
            calculator.dataset.previousKeyType = "action"
            display.append(keycontent)
            calc.push(keycontent)
        } else if ((action === "subtract" || action === "add") && multiDiv(previousKey) ){
            console.warn("5/* -+5");
            calculator.dataset.previousKeyType = "action"
            display.append(keycontent)
            calc.push(keycontent)

        } else if (action === "clear") {
            display.textContent = ""
            curr.textContent = ""
            calculator.dataset.previousKeyType = ""
            calc = []
            console.clear()
            console.warn("cleared");

        }
        let str = calc.join("")
        console.log("str outside loop",str);


        if (isCalc(str)) { // if i is calc:
            let res;
            let exp = /([+]|[+]|[-]|[-]|[×]|[*]|[/]|[÷])/; //splitting in operator
            // .filter(r => {return r.length !=0 }) // filters "" out of array
            if (startsWithPusmin(str) && !multidivCheck(str)) { // str starts with +-
                var arr = str.split(exp).filter(r => {return r.length !=0 }) // filters "" out of array
                arr.splice(0,2,arr[0]+arr[1]) // ["-","2"] >>> ["-2"]
                console.log("starts with +-: ",arr);
        
            } else if (multidivCheck(str) && !startsWithPusmin(str)){ // string contains /-/+ *-*+
                var arr = str.split(exp).filter(r => {return r.length !=0 }) // filters "" out of array and splits in operators
                for (i = 0; i < arr.length; i++){ //item iterator
                    if (multiDiv(arr[i]) && plusMin(arr[i+1])) { //if i is */ AND i+1 is +-
                        arr.splice(i+1,2,arr[i+1] + arr[i+2])
                    }
                }
                console.log("multiDiv check> ",arr);
            }else if (multidivCheck(str) && startsWithPusmin(str)) { // str contains /-/+ *-*+ AND starts with +-
                var arr = str.split(exp).filter(r => {return r.length !=0 }) // filters "" out of array
                arr.splice(0,2,arr[0]+arr[1]) // ["-","2"] >>> ["-2"]
                for (i = 0; i < arr.length; i++){ //item iterator
                    if (multiDiv(arr[i]) && plusMin(arr[i+1])) { //if i is */ AND i+1 is +-
                        arr.splice(i+1,2,arr[i+1] + arr[i+2])
                    }
                }
                console.log("/-/+ *-*+ AND starts with +-: ",arr);
            }else { // no +*+/ or -*-/
                var arr = str.split(exp).filter(r => {return r.length !=0})
                console.log("no +*+/ or -*-/: ",arr);
            }
            while (multiDiv(arr)) { // while calc contains */:
                console.log("arr contains multidiv ")
                for (let q = 0; q<arr.length; ++q){
                    if (multiDiv(arr[q])){ // if arr[q] is */ and arr[1+1] is not +-:
                        console.log("*/ detected:: ", arr[q]);
                        // let res = calculate(arr[q-1],arr[q],arr[q+1])
                        var ress = calculate(arr[q-1],arr[q],arr[q+1])
                        arr.splice(q-1,3,ress);// use splice() method to replace q-1,q and q+1 with result
                        // arr.splice(q-1,3,res);// use splice() method to replace q-1,q and q+1 with result
                        console.log("arr after splice: ",arr);
                        break
                    } 
                }
            }
            console.log("end of */ while loop ",arr);
            while (plusMin(arr)) { // while +- in arr
                console.log("plusmin detected with arr> ",arr);
                for (let q = 0; q<arr.length; ++q){
                    if (plusMin(arr[q]) && arr[q].length ===1){
                        console.log("+- detected:: ", arr[q]);
                        // let res = calculate(arr[q-1],arr[q],arr[q+1]) //result
                        // arr.splice(q-1,3,res);// use splice() method to replace q-1,q and q+1 with result
                        var ress = calculate(arr[q-1],arr[q],arr[q+1])
                        arr.splice(q-1,3,ress);// use splice() method to replace q-1,q and q+1 with result
                        console.log("arr after splice: ",arr);
                        console.log(arr.length);
                        console.warn(res);
                        break
                    }
        
                }
                if (arr.length ===1) {
                    break
                }
            }
        }else {
            console.log("no calc detected")
        } // end of calculations
        
        // console.warn("end of calc: ",ress, typeof ress);
        if (typeof ress != "undefined" && isNaN(ress) === false ){ // calc finished
            console.warn("res> ",ress);
            console.error(isNaN(ress));

            curr.textContent = ress
        }
    } 
    
})