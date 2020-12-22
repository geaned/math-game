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
var testTaskString = "cos((a/(b+12))/(12+123)+c+d+f)";

var config = new twf.config.CompiledConfiguration();
var kek = twf.api.expressionSubstitutionFromStructureStrings("a", "b"); // change name ASAP
config.compiledExpressionTreeTransformationRules.array_hd7ov6$_0 = [kek];  // fake rule for testing purposes
var expressionRoot = twf.api.stringToExpression(testTaskString);    // will need to parse an expressionString in the future (just change the command)

var containerRoot = new PIXI.Container();   // contains the whole scene
var expressionContainerRoot = outputReactiveExpression(expressionRoot); // contains current expression
var substitutionContainerRoot = new PIXI.Container();   // will contain clickable substitutions
substitutionContainerRoot.position.set(0, renderer.height*extraSettings.partOfScreenDedicatedToExpression);

console.log(expressionRoot);
redrawMainExpression(expressionRoot);

containerRoot.addChild(expressionContainerRoot);
containerRoot.addChild(substitutionContainerRoot);
animate();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(containerRoot);
}