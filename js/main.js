const canvas = document.getElementById("mainCanvas");
const renderer = new PIXI.Renderer({
    view: canvas,
    resolution: 1
});

var style = new PIXI.TextStyle({
    fontFamily: 'Comic Sans MS',
    fontSize: 24,
    fill: 0xffffff
})

var extraSettings = {
    divisionLineExtraLength: 4,    // used for managing "multi-floor" fractions
    divisionLineWidth: 3,   // division line thickness
    powerOffsetMultiplier: 2/3, // managing base Y axis offset relatively to power height
    partOfScreenDedicatedToExpression: 1/4, // part of screen dedicated for drawing current expression after substitutions have been drawn
    sourceToTargetExpressionOffset: 20  // space width between a source and a target of a substitution
}

//var testTaskString = "a*(a+b/c)/24";
//var testTaskString = "a+(a+b/c+d/(e))/24";
//var testTaskString = "a+b+c/d";
//var testTaskString = "a-b-c";
//var testTaskString = "a+(b/(c-12))/24";
//var testTaskString = "a+(b/(c-12))/(24/48)";
//var testTaskString = "a*b*c/d";
//var testTaskString = "a*b*(c/d)";
//var testTaskString = "a^b";
//var testTaskString = "a*b*((c/d)/e)^f";
//var testTaskString = "sin(a)";
var testTaskString = "((a/(b*12))/(12*123))+c+d+f";
//var testTaskString = "-11+5";
//var testTaskString = "-(a/(b/c))";

//var config = new twf.config.CompiledConfiguration();

function addExpressionSubstitutionByName(name) {
    return twf.api.expressionSubstitutionFromStructureStrings(void 0, void 0, void 0, void 0, void 0, void 0, name);
}

var expressionSubstitutions = [
    /*addExpressionSubstitutionByName("NumberPlusMinus1"), // why referring by code doesn't work?
    addExpressionSubstitutionByName("DecimalToFraction"),
    addExpressionSubstitutionByName("PowFactorization"),
    addExpressionSubstitutionByName("MultiplicationFactorization"),
    addExpressionSubstitutionByName("OpeningBrackets"),
    addExpressionSubstitutionByName("ParentBracketsExpansion"),
    addExpressionSubstitutionByName("ArgumentsSwap"),
    addExpressionSubstitutionByName("ArgumentsPermutation"),
    addExpressionSubstitutionByName("ArgumentsPermutationInOther"),
    addExpressionSubstitutionByName("ReduceArithmetic"),
    addExpressionSubstitutionByName("ReduceFraction"),
    addExpressionSubstitutionByName("AdditiveComplicatingExtension"),
    addExpressionSubstitutionByName("MultiplicativeComplicatingExtension"),
    addExpressionSubstitutionByName("MinusInOutBrackets"),
    addExpressionSubstitutionByName("SimpleComputation"),*/
    twf.api.expressionSubstitutionFromStructureStrings("a", "b")];
var config = twf.api.createCompiledConfigurationFromExpressionSubstitutionsAndParams(expressionSubstitutions);
console.log(config);

//var kek = twf.api.expressionSubstitutionFromStructureStrings("a", "b");
//config.compiledExpressionTreeTransformationRules.array_hd7ov6$_0 = [kek];
var expressionRoot = twf.api.stringToExpression(testTaskString);    // will need to parse an expressionString in the future (just change the command)

var containerRoot = new PIXI.Container();   // contains the whole scene
var expressionContainerRoot; // contains current expression
var substitutionContainerRoot = new PIXI.Container();   // will contain clickable substitutions
substitutionContainerRoot.position.set(0, renderer.height*extraSettings.partOfScreenDedicatedToExpression);

redrawMainExpression(expressionRoot);

animate();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(containerRoot);
}