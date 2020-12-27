function redrawMainExpression(newExpressionNode) {
    expressionRoot = newExpressionNode;
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
        var selectedNode = getDeepestContainer(posX, posY, outputContainer.nodeData);
        var applicableSubstitutions = twf.api.findApplicableSubstitutionsInSelectedPlace(expressionRoot, [selectedNode], config);
        
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

function drawExpression(x, y, expressionNode, isResponsive) {
    var container = new PIXI.Container();
    container.x = x;
    container.y = y;
    var type = expressionNode.nodeType.name$;
    var value = expressionNode.value;
    container.expressionTreeNodeId = expressionNode.nodeId;
    container.respectiveIdentifier = expressionNode.identifier;

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
                var plus_signs = [];
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
                            plus_signs.push(text);
                            var textBlockWidth = PIXI.TextMetrics.measureText("+", style).width;
                            curOffset += textBlockWidth;
                        }
                    }
                }
                
                for (let part of parts) {
                    part.y = (maxHeight-part.height)/2;
                    container.addChild(part);
                }
                for (let sign of plus_signs) {
                    sign.y = (maxHeight-sign.height)/2;
                    container.addChild(sign);
                }
                if (isResponsive)
                    return makeResponsiveContainer(container);
                return container;

            case "-":
                var text = new PIXI.Text("-", style);
                text.position.set(0, 0);
                var textBlockWidth = PIXI.TextMetrics.measureText("-", style).width;
                var variable_part = drawExpression(textBlockWidth, 0, expressionNode.children.array_hd7ov6$_0[0], isResponsive);
                
                container.addChild(text);
                container.addChild(variable_part);
                if (isResponsive)
                    return makeResponsiveContainer(container);
                return container;

            case "*":
                var curOffset = 0;
                var maxHeight = 0;
                var parts = [];
                var multiply_signs = [];
                var childrenAmount = expressionNode.children.array_hd7ov6$_0.length;
                for (let childNum = 0; childNum < childrenAmount; childNum++) {
                    var newBlock = drawExpression(curOffset, 0, expressionNode.children.array_hd7ov6$_0[childNum], isResponsive);
                    curOffset += newBlock.width;
                    maxHeight = Math.max(maxHeight, newBlock.height);
                    parts.push(newBlock);

                    if (childNum < childrenAmount-1) {
                        var text = new PIXI.Text("*", style);
                        text.position.set(curOffset, 0);
                        multiply_signs.push(text);
                        var textBlockWidth = PIXI.TextMetrics.measureText("*", style).width;
                        curOffset += textBlockWidth;
                    }
                }
                
                for (let part of parts) {
                    part.y = (maxHeight-part.height)/2;
                    container.addChild(part);
                }
                for (let sign of multiply_signs) {
                    sign.y = (maxHeight-sign.height)/2;
                    container.addChild(sign);
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

            default:    // ATTENTION: currectly means only unary mathematical functions which are not operators
                if (value === "") {     // ATTENTION: this currently only means full expression (hence shouldn't be reactive)
                    var fullContainer = drawExpression(0, 0, expressionNode.children.array_hd7ov6$_0[0], isResponsive);
                    container.addChild(fullContainer);
                    return container;

                } else {
                    var left_side = new PIXI.Text(value+"(", style);
                    var textBlockWidth = PIXI.TextMetrics.measureText(value+"(", style).width;
                    var textBlockHeight = PIXI.TextMetrics.measureText(value+"(", style).height;

                    var operand = drawExpression(textBlockWidth, 0, expressionNode.children.array_hd7ov6$_0[0], isResponsive);
                    var heightOffset = (operand.height-textBlockHeight)/2;
                    left_side.position.set(0, heightOffset);

                    var right_side = new PIXI.Text(")", style);
                    right_side.position.set(textBlockWidth+operand.width, heightOffset);

                    container.addChild(left_side);
                    container.addChild(right_side);
                    container.addChild(operand);
                    if (isResponsive)
                        return makeResponsiveContainer(container);
                    return container;
                }
                
        }
    }
    console.assert(true, {msg: "Oops, shouldn't've come here!"});
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
    container.hitArea = new PIXI.Rectangle(0, 0, renderer.width, container.height);
    container.on("click", returnSubstitutionId);
    var highlightRect = new PIXI.Graphics();
    highlightRect.lineStyle(0, 0xffffff);
    highlightRect.beginFill(0xffffff);
    highlightRect.drawRect(0, 0, renderer.width, container.height);
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
        redrawMainExpression(container.newNode);
    }

    container.addChild(highlightRect);
    return container;
}