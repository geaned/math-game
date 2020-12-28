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
//var testTaskString = "-11+5";
//var testTaskString = "-(a/(b/c))";
//var testTaskString = "-(12-1)+5";
//var testTaskString = "(x+1)^2";
var testTaskString = "((a/(b*12))/(12*(122+1)))+(c+d)+f";

//var config = new twf.config.CompiledConfiguration();

function addExpressionSubstitutionByName(name) {
    return twf.api.expressionSubstitutionFromStructureStrings(void 0, void 0, void 0, void 0, void 0, void 0, name);
}

var expressionSubstitutions = [
    addExpressionSubstitutionByName("NumberPlusMinus1"), // ATTENTION: why referring by code doesn't work?
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
    addExpressionSubstitutionByName("SimpleComputation"),
    twf.api.expressionSubstitutionFromStructureStrings("a", "b")];  // ATTENTION: test rule, it works
var config = twf.api.createCompiledConfigurationFromExpressionSubstitutionsAndParams(expressionSubstitutions);
console.log(config);

var expressionRoot = twf.api.stringToExpression(testTaskString);    // ATTENTION: will need to parse an expressionString in the future (just change the command)

var containerRoot = new PIXI.Container();               // contains the whole scene
var expressionContainerRoot;                            // contains current expression
var substitutionContainerRoot = new PIXI.Container();   // contains clickable substitutions
substitutionContainerRoot.position.set(0, renderer.height*extraSettings.partOfScreenDedicatedToExpression);

redrawMainExpression(expressionRoot);

animate();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(containerRoot);
}