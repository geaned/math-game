function redrawMainExpression(goBack, newExpressionNode) {
    if (goBack)
        expressionProgression.pop();
    else
        expressionProgression.push(newExpressionNode);
    expressionRoot = expressionProgression[expressionProgression.length-1];

    changeStepsValue(turnsDone+1);
    checkAnswer(expressionRoot, goalStructureString);
    
    containerRoot.removeChildren();
    expressionContainerRoot = outputReactiveExpression(expressionRoot);
    substitutionContainerRoot.removeChildren();
    containerRoot.addChild(expressionContainerRoot);
    containerRoot.addChild(substitutionContainerRoot);
    //console.log(expressionRoot);
    //console.log(expressionContainerRoot);
}

function outputReactiveExpression(expressionNode) {
    var outputContainer = drawExpression(0, 0, expressionNode, true);
    repositionExpressionContainer(outputContainer, true);

    outputContainer.interactive = true;
    outputContainer.buttonMode = true;
    outputContainer.hitArea = new PIXI.Rectangle(0, 0, outputContainer.width, outputContainer.height);
    outputContainer.on("click", outputApplicableSubstitutions);

    function outputApplicableSubstitutions(event) {
        var posX = event.data.global.x;
        var posY = event.data.global.y;
        var selectedNode = getDeepestContainer(posX-containerRoot.x, posY-containerRoot.y, outputContainer.nodeData);
        var applicableSubstitutions = twf.api.findApplicableSubstitutionsInSelectedPlace(expressionRoot, [selectedNode], config);
        //console.log(applicableSubstitutions);
        
        containerRoot.removeChildAt(1);
        substitutionContainerRoot.removeChildren();
        containerRoot.addChild(substitutionContainerRoot);

        repositionExpressionContainer(outputContainer, false);
        var applicableSubstitutionsNum = applicableSubstitutions.array_hd7ov6$_0.length;
        var offsetHeight = 0;
        for (let applicableSubstitutionId = 0; applicableSubstitutionId < applicableSubstitutionsNum; applicableSubstitutionId++) {
            //console.log(applicableSubstitutions.array_hd7ov6$_0[applicableSubstitutionId]);
            var outputSubstitutionsContainer = new PIXI.Container();
            outputSubstitutionsContainer.position.set(0, offsetHeight);
            var sourceExpression = drawExpression(0, 0, applicableSubstitutions.array_hd7ov6$_0[applicableSubstitutionId].originalExpressionChangingPart, false);
            var targetExpression = drawExpression(sourceExpression.width+extraSettings.sourceToTargetExpressionOffset, 0, applicableSubstitutions.array_hd7ov6$_0[applicableSubstitutionId].resultExpressionChangingPart, false);
            // console.log(applicableSubstitutions.array_hd7ov6$_0[applicableSubstitutionId].originalExpressionChangingPart);
            // console.log(applicableSubstitutions.array_hd7ov6$_0[applicableSubstitutionId].resultExpressionChangingPart);
            // console.log(sourceExpression);
            // console.log(targetExpression);
            sourceExpression.y = (Math.max(sourceExpression.height, targetExpression.height)-sourceExpression.height)/2;
            targetExpression.y = (Math.max(sourceExpression.height, targetExpression.height)-targetExpression.height)/2;

            outputSubstitutionsContainer.addChild(sourceExpression);
            outputSubstitutionsContainer.addChild(targetExpression);
            makeResponsiveSubstitution(outputSubstitutionsContainer, applicableSubstitutions.array_hd7ov6$_0[applicableSubstitutionId].resultExpression);

            substitutionContainerRoot.addChild(outputSubstitutionsContainer);
            offsetHeight += outputSubstitutionsContainer.height;
        }
    }
    return outputContainer;
}

function surroundContainerByBrackets(container) {   // expression should be added to container before using, container should be made reactive after using this function
    var expressionWidth = container.width;
    var expressionHeight = container.height;

    var openingBracketWidth = PIXI.TextMetrics.measureText("(", style).width;
    var openingBracketHeight = PIXI.TextMetrics.measureText("(", style).height;
    var closingBracketHeight = PIXI.TextMetrics.measureText(")", style).height;

    var leftBracket = new PIXI.Text("(", style);
    leftBracket.position.set(0, (expressionHeight-openingBracketHeight)/2);

    for (child of container.children)
        child.x += openingBracketWidth;

    var rightBracket = new PIXI.Text(")", style);
    rightBracket.position.set(openingBracketWidth+expressionWidth, (expressionHeight-closingBracketHeight)/2);

    container.addChild(leftBracket);
    container.addChild(rightBracket);
}

function drawExpression(x, y, expressionNode, isResponsive) {
    var container = new PIXI.Container();
    container.x = x;
    container.y = y;
    var type = expressionNode.nodeType.name$;
    var value = expressionNode.value;
    container.expressionTreeNodeId = expressionNode.nodeId;
    var isRoot = (expressionNode.parent == null);
    var parentType = (expressionNode.parent == null) ? null : expressionNode.parent.name$;
    var parentValue = (expressionNode.parent == null) ? null : expressionNode.parent.value;
    //container.respectiveIdentifier = expressionNode.identifier;
    //if (isResponsive)
    //    console.log([container.expressionTreeNodeId, container.respectiveIdentifier]);

    if (type === "VARIABLE") {  // ATTENTION: currently implies not having children
        var text = new PIXI.Text(value, style);
        container.addChild(text);
        if (isResponsive)
            return makeResponsiveContainer(container);
        return container;
    }
    else if (type === "FUNCTION") {
        switch(value) {
            case "+":
                var curOffset = 0;
                var maxHeight = 0;
                var parts = [];
                var plusSigns = [];
                var childrenAmount = expressionNode.children.array_hd7ov6$_0.length;
                for (let childNum = 0; childNum < childrenAmount; childNum++) {
                    var newBlock = drawExpression(curOffset, 0, expressionNode.children.array_hd7ov6$_0[childNum], isResponsive);
                    curOffset += newBlock.width;
                    maxHeight = Math.max(maxHeight, newBlock.height);
                    parts.push(newBlock);

                    if (childNum < childrenAmount-1) {
                        if (expressionNode.children.array_hd7ov6$_0[childNum+1].value !== "-") { // if right child is -(<some_expression>), then we shouldn't draw a "+"
                            var text = new PIXI.Text("+", style);
                            text.position.set(curOffset, 0);
                            plusSigns.push(text);
                            var textBlockWidth = PIXI.TextMetrics.measureText("+", style).width;
                            curOffset += textBlockWidth;
                        }
                    }
                }
                
                for (let part of parts) {
                    part.y = (maxHeight-part.height)/2;
                    container.addChild(part);
                }
                for (let sign of plusSigns) {
                    sign.y = (maxHeight-sign.height)/2;
                    container.addChild(sign);
                }

                if (["+", "-", "*", "^"].includes(parentValue)) {
                    surroundContainerByBrackets(container);
                }

                if (isResponsive)
                    return makeResponsiveContainer(container);
                return container;

            case "-":
                var text = new PIXI.Text("-", style);
                var textBlockWidth = PIXI.TextMetrics.measureText("-", style).width;
                var textBlockHeight = PIXI.TextMetrics.measureText("-", style).height;
                var variable_part = drawExpression(textBlockWidth, 0, expressionNode.children.array_hd7ov6$_0[0], isResponsive);
                text.position.set(0, (variable_part.height-textBlockHeight)/2);
                
                container.addChild(text);
                container.addChild(variable_part);

                if (["-", "*", "^"].includes(parentValue)) {
                    surroundContainerByBrackets(container);
                }

                if (isResponsive)
                    return makeResponsiveContainer(container);
                return container;

            case "*":
                var curOffset = 0;
                var maxHeight = 0;
                var parts = [];
                var multiplySigns = [];
                var childrenAmount = expressionNode.children.array_hd7ov6$_0.length;
                for (let childNum = 0; childNum < childrenAmount; childNum++) {
                    var newBlock = drawExpression(curOffset, 0, expressionNode.children.array_hd7ov6$_0[childNum], isResponsive);
                    curOffset += newBlock.width;
                    maxHeight = Math.max(maxHeight, newBlock.height);
                    parts.push(newBlock);

                    if (childNum < childrenAmount-1) {
                        var text = new PIXI.Text("*", style);
                        text.position.set(curOffset, 0);
                        multiplySigns.push(text);
                        var textBlockWidth = PIXI.TextMetrics.measureText("*", style).width;
                        curOffset += textBlockWidth;
                    }
                }
                
                for (let part of parts) {
                    part.y = (maxHeight-part.height)/2;
                    container.addChild(part);
                }
                for (let sign of multiplySigns) {
                    sign.y = (maxHeight-sign.height)/2;
                    container.addChild(sign);
                }

                if (["-", "*", "^"].includes(parentValue)) {
                    surroundContainerByBrackets(container);
                }

                if (isResponsive)
                    return makeResponsiveContainer(container);
                return container;

            case "/":
                var numerator = drawExpression(0, 0, expressionNode.children.array_hd7ov6$_0[0], isResponsive);
                var denominator = drawExpression(0, numerator.height+extraSettings.divisionLineWidth, expressionNode.children.array_hd7ov6$_0[1], isResponsive);

                var fractionLength = Math.max(numerator.width, denominator.width)+extraSettings.divisionLineExtraLength;
                var numeratorOffset = (fractionLength-numerator.width)/2;
                var denominatorOffset = (fractionLength-denominator.width)/2;
                numerator.x += numeratorOffset;
                denominator.x += denominatorOffset;

                var divisionLine = new PIXI.Graphics();
                divisionLine.lineStyle(extraSettings.divisionLineWidth, 0xffffff);
                divisionLine.moveTo(0, numerator.height);
                divisionLine.lineTo(fractionLength, numerator.height);
                divisionLine.closePath();

                container.addChild(numerator);
                container.addChild(denominator);
                container.addChild(divisionLine);

                if (parentValue === "^") {
                    surroundContainerByBrackets(container);
                }

                if (isResponsive)
                    return makeResponsiveContainer(container);
                return container;
            
            case "^":
                var base = drawExpression(0, 0, expressionNode.children.array_hd7ov6$_0[0], isResponsive);
                var power = drawExpression(base.width, 0, expressionNode.children.array_hd7ov6$_0[1], isResponsive);
                base.y = power.height*extraSettings.powerOffsetMultiplier;

                container.addChild(base);
                container.addChild(power);
                if (isResponsive)
                    return makeResponsiveContainer(container);
                return container;

            default:    // ATTENTION: currectly means only unary mathematical functions which are not operators or a full expression
                if (value === "") {
                    if (isRoot) {
                        var fullExpression = drawExpression(0, 0, expressionNode.children.array_hd7ov6$_0[0], isResponsive);
                        container.addChild(fullExpression);
                        return container;

                    } else {
                        var left_side = new PIXI.Text("(", style);
                        var textBlockWidth = PIXI.TextMetrics.measureText("(", style).width;
                        var textBlockHeight = PIXI.TextMetrics.measureText("(", style).height;
    
                        var containedExpression = drawExpression(textBlockWidth, 0, expressionNode.children.array_hd7ov6$_0[0], isResponsive);
                        var heightOffset = (containedExpression.height-textBlockHeight)/2;
                        left_side.position.set(0, heightOffset);
    
                        var right_side = new PIXI.Text(")", style);
                        right_side.position.set(textBlockWidth+containedExpression.width, heightOffset);
                        
                        container.addChild(left_side);
                        container.addChild(right_side);
                        container.addChild(containedExpression);
                        if (isResponsive)
                            return makeResponsiveContainer(container);
                        return container;
                    }

                } else {
                    var leftBracket = new PIXI.Text(value+"(", style);
                    var textBlockWidth = PIXI.TextMetrics.measureText(value+"(", style).width;
                    var textBlockHeight = PIXI.TextMetrics.measureText(value+"(", style).height;

                    var operand = drawExpression(textBlockWidth, 0, expressionNode.children.array_hd7ov6$_0[0], isResponsive);
                    var heightOffset = (operand.height-textBlockHeight)/2;
                    leftBracket.position.set(0, heightOffset);

                    var rightBracket = new PIXI.Text(")", style);
                    rightBracket.position.set(textBlockWidth+operand.width, heightOffset);

                    container.addChild(leftBracket);
                    container.addChild(rightBracket);
                    container.addChild(operand);
                    if (isResponsive)
                        return makeResponsiveContainer(container);
                    return container;
                }
                
        }
    }
    console.assert(false, "Oops, shouldn't've come here!");
}

function makeResponsiveContainer(container) {
    container.interactive = true;
    container.buttonMode = true;
    container.hitArea = new PIXI.Rectangle(0, 0, container.width, container.height);
    var highlightRect = new PIXI.Graphics();
    highlightRect.lineStyle(0, 0xffffff);
    highlightRect.beginFill(0xffffff);
    highlightRect.drawRect(0, 0, container.width, container.height);
    highlightRect.endFill();
    highlightRect.alpha = 0;

    // TODO: make only the deepest selected node highlighted and reactive + hightling of overlapping zones works wacky
    container.mouseover = function(mouseData) {
        highlightRect.alpha = 0.4;
    }

    container.mouseout = function(mouseData) {
        highlightRect.alpha = 0;
    }

    container.addChild(highlightRect);
    return container;
}

function makeResponsiveSubstitution(container, newNode) {
    container.newNode = newNode;

    container.interactive = true;
    container.buttonMode = true;
    container.hitArea = new PIXI.Rectangle(0, 0, extraSettings.screenWidth, container.height);
    container.on("click", returnSubstitutionId);
    var highlightRect = new PIXI.Graphics();
    highlightRect.lineStyle(0, 0xffffff);
    highlightRect.beginFill(0xffffff);
    highlightRect.drawRect(0, 0, extraSettings.screenWidth, container.height);
    highlightRect.endFill();
    highlightRect.alpha = 0;

    // TODO: make only the deepest selected node highlighted and reactive + hightling of overlapping zones works wacky
    container.mouseover = function(mouseData) {
        highlightRect.alpha = 0.4;
    }

    container.mouseout = function(mouseData) {
        highlightRect.alpha = 0;
    }

    function returnSubstitutionId(event) {
        //console.log(container.newNode);
        redrawMainExpression(false, container.newNode);
    }

    container.addChild(highlightRect);
    return container;
}