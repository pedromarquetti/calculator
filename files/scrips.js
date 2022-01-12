const calculator = document.querySelector('.calculator')
const display_main = document.querySelector(".calculator__display__main")
const keys = calculator.querySelector(".calculator__keys")
const display = document.querySelector(".calcs")
const curr = document.querySelector(".curr")
const previousKeyType = calculator.dataset.previousKeyType
// const btn = document.createElement("BUTTON",class="scroll")
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
                let calc1 = parseFloat(n1) + parseFloat(n2)                                
                return calc1.toString();
                
            case "-":                
                let calc2 = parseFloat(n1) - parseFloat(n2)                                
                return calc2.toString();
                    
            case "*": case "×":                
                let calc3 = parseFloat(n1) * parseFloat(n2)                                
                return calc3.toString();
                
            case "/": case "÷":                
                let calc4 = parseFloat(n1) / parseFloat(n2)                                
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
        } else if (!action) { //if num is pressed
            calculator.dataset.previousKeyType = "num"                        
            display.append(keycontent)
            calc.push(keycontent)
            // let str = calc.join("")
        // 
        } else if (action && calculator.dataset.previousKeyType === "num" && action != "clear" && action != "calculate") {                        
            calculator.dataset.previousKeyType = "action"
            display.append(keycontent)
            calc.push(keycontent)
        } else if ((action === "subtract" || action === "add") && multiDiv(previousKey) ){            
            calculator.dataset.previousKeyType = "action"
            display.append(keycontent)
            calc.push(keycontent)

        } else if (action === "clear") {
            display.textContent = ""
            curr.textContent = ""
            calculator.dataset.previousKeyType = ""
            calc = []                        

        }
        let str = calc.join("")        


        if (isCalc(str)) { // if i is calc:
            let res;
            let exp = /([+]|[+]|[-]|[-]|[×]|[*]|[/]|[÷])/; //splitting in operator
            // .filter(r => {return r.length !=0 }) // filters "" out of array
            if (startsWithPusmin(str) && !multidivCheck(str)) { // str starts with +-
                var arr = str.split(exp).filter(r => {return r.length !=0 }) // filters "" out of array
                arr.splice(0,2,arr[0]+arr[1]) // ["-","2"] >>> ["-2"]                
        
            } else if (multidivCheck(str) && !startsWithPusmin(str)){ // string contains /-/+ *-*+
                var arr = str.split(exp).filter(r => {return r.length !=0 }) // filters "" out of array and splits in operators
                for (i = 0; i < arr.length; i++){ //item iterator
                    if (multiDiv(arr[i]) && plusMin(arr[i+1])) { //if i is */ AND i+1 is +-
                        arr.splice(i+1,2,arr[i+1] + arr[i+2])
                    }
                }                
            }else if (multidivCheck(str) && startsWithPusmin(str)) { // str contains /-/+ *-*+ AND starts with +-
                var arr = str.split(exp).filter(r => {return r.length !=0 }) // filters "" out of array
                arr.splice(0,2,arr[0]+arr[1]) // ["-","2"] >>> ["-2"]
                for (i = 0; i < arr.length; i++){ //item iterator
                    if (multiDiv(arr[i]) && plusMin(arr[i+1])) { //if i is */ AND i+1 is +-
                        arr.splice(i+1,2,arr[i+1] + arr[i+2])
                    }
                }                
            }else { // no +*+/ or -*-/
                var arr = str.split(exp).filter(r => {return r.length !=0})                
            }
            while (multiDiv(arr)) { // while calc contains */:                
                for (let q = 0; q<arr.length; ++q){
                    if (multiDiv(arr[q])){ // if arr[q] is */ and arr[1+1] is not +-:                        
                        // let res = calculate(arr[q-1],arr[q],arr[q+1])
                        var ress = calculate(arr[q-1],arr[q],arr[q+1])
                        arr.splice(q-1,3,ress);// use splice() method to replace q-1,q and q+1 with result
                        // arr.splice(q-1,3,res);// use splice() method to replace q-1,q and q+1 with result                        
                        break
                    } 
                }
            }            
            while (plusMin(arr)) { // while +- in arr                
                for (let q = 0; q<arr.length; ++q){
                    if (plusMin(arr[q]) && arr[q].length ===1){                        
                        // let res = calculate(arr[q-1],arr[q],arr[q+1]) //result
                        // arr.splice(q-1,3,res);// use splice() method to replace q-1,q and q+1 with result
                        var ress = calculate(arr[q-1],arr[q],arr[q+1])
                        arr.splice(q-1,3,ress);// use splice() method to replace q-1,q and q+1 with result                                                                        
                        break
                    }
        
                }
                if (arr.length ===1) {
                    break
                }
            }
        }

        if (typeof ress != "undefined" && isNaN(ress) === false ){ // calc finished                        

            curr.textContent = ress
        }
    } 
    // while (display.scrollLeft < 0){

    //     btn.textContent = "scroll to end"
    //     btn.addEventListener("click", () =>{
    //         display.scrollLeft = display.scrollWidth + 1
    //     })
    //     display_main.appendChild(btn)
    //     break   
    // }
    // if (display.scrollLeft === 0 ){
    //     btn.remove()
    // }
})