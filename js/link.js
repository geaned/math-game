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
    sourceToTargetExpressionOffset: 20, // space width between a source and a target of a substitution
    screenWidth: 800,
    screenHeight: 600
}

var expressionRoot;
var turnsDone;
var expressionProgression;

var containerRoot = new PIXI.Container();               // contains the whole scene
var expressionContainerRoot;                            // contains current expression
var substitutionContainerRoot = new PIXI.Container();   // contains clickable substitutions
substitutionContainerRoot.position.set(0, screenHeight*extraSettings.partOfScreenDedicatedToExpression);

containerRoot.width = extraSettings.screenWidth;    // may require invisible block of screenWidth by screenHeight size
containerRoot.height = extraSettings.screenHeight;
containerRoot.position.set((renderer.width-screenWidth)/2, (renderer.height-screenHeight)/2);

interface.addChild(containerRoot);

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

function goToPreviousExpression() {   // for a 'cancel turn' button
    if (expressionProgression.length > 1)
        redrawMainExpression(true, void 0, goalStructureString);
}

function goToFirstExpression() {    // for a 'retry from the start' button
    if (expressionProgression.length > 1) {
        expressionProgression = expressionProgression.slice(0, 2);
        redrawMainExpression(true, void 0, goalStructureString);
        turnsDone = 0;
    }
}

function returnTurnAmount() {
    return turnsDone;
}

function loadLevel(startingStructureString, goalStructureString) {    // load level and start the game
    expressionRoot = twf.api.structureStringToExpression(startingStructureString);
    turnsDone = 0;
    expressionProgression = [];
    redrawMainExpression(false, expressionRoot, goalStructureString);
}