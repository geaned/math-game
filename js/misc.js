function isInBlock(pointerX, pointerY, boxX, boxY, boxWidth, boxHeight) {
    if (pointerX >= boxX && pointerX <= boxX + boxWidth && pointerY >= boxY && pointerY <= boxY + boxHeight)
        return true;
    else
        return false;
}

function getDeepestContainer(x, y, nodes) {
    //console.log([x, y]);
    var nodeAmount = nodes.length;
    var deepestContainerClicked = 0;
    for (nodeNum = 0; nodeNum < nodeAmount; nodeNum++) {
        if (isInBlock(x, y, nodes[nodeNum].x, nodes[nodeNum].y, nodes[nodeNum].width, nodes[nodeNum].height) && nodes[nodeNum].nodeId > deepestContainerClicked) {
            deepestContainerClicked = nodes[nodeNum].nodeId;
        }
    }
    //console.log(deepestContainerClicked);
    return deepestContainerClicked;
}

function repositionExpressionContainer(container, isCenter) {
    if (isCenter) {
        container.position.set((extraSettings.screenWidth-container.width)/2, (extraSettings.screenHeight-container.height)/2);

    } else {
        container.position.set((extraSettings.screenWidth-container.width)/2, (extraSettings.screenHeight*extraSettings.partOfScreenDedicatedToExpression-container.height)/2);
    }
    container.nodeData = getAllNodeBlocksCoords(container, [], 0, 0);
}

function getAllNodeBlocksCoords(container, NodeDataArray, absoluteCoordX, absoluteCoordY) {
    if (container.hasOwnProperty('expressionTreeNodeId')) {
        NodeDataArray.push({
            nodeId: container.expressionTreeNodeId,
            x: absoluteCoordX+container.x,
            y: absoluteCoordY+container.y,
            width: container.width,
            height: container.height
        });
        for (let child of container.children) {
            NodeDataArray = getAllNodeBlocksCoords(child, NodeDataArray, absoluteCoordX+container.x, absoluteCoordY+container.y);
        }
    }
    return NodeDataArray;
}

function getAllNodeBlocksCoords(container, NodeDataArray, absoluteCoordX, absoluteCoordY) {
    if (container.hasOwnProperty('expressionTreeNodeId')) {
        NodeDataArray.push({
            nodeId: container.expressionTreeNodeId,
            x: absoluteCoordX+container.x,
            y: absoluteCoordY+container.y,
            width: container.width,
            height: container.height
        });
        for (let child of container.children) {
            NodeDataArray = getAllNodeBlocksCoords(child, NodeDataArray, absoluteCoordX+container.x, absoluteCoordY+container.y);
        }
    }
    return NodeDataArray;
}
