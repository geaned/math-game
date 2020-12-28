function goToPreviousExpression() {   // for a 'cancel turn' button
    if (expressionProgression.length > 1)
        redrawMainExpression(true);
}

function goToFirstExpression() {    // for a 'retry from the start' button
    if (expressionProgression.length > 1) {
        expressionProgression = expressionProgression.slice(0, 2);
        redrawMainExpression(true);
    }
}