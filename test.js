function test() {
    var x = 2, y = 4;
    console.log(eval("x + y"));  // Appel direct, portée locale, résultat de 6
    var geval = eval;
    console.log(geval("x + y")); // Appel indirect, portée globale, lance une exception ReferenceError car `x` n'est pas défini
    (0, eval)('x + y'); // un autre exemple d'appel indirect.
  }