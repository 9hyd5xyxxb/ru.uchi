function drawArrow(startPoint, endPoint, bend) {
	var firstSegment = new paper.Segment({
	    point: [startPoint, constants.rulerY],
	    handleOut: [(endPoint - startPoint) / 2 + 10, -bend]
	});

	var secondSegment = new paper.Segment({
	    point: [endPoint, constants.rulerY],
	});

	var arrowLeft = new paper.Segment({
	    point: [endPoint-3, constants.rulerY-11],
	});

	var arrowLeft1 = new paper.Segment({
	    point: [endPoint, constants.rulerY],
	});

	var arrowBetween = new paper.Segment({
	    point: [endPoint-10, constants.rulerY-2],
	});

	var arrowRight = new paper.Segment({
	    point: [endPoint, constants.rulerY],
	});

	new paper.Path({
	    segments: [firstSegment, secondSegment, arrowLeft, arrowLeft1, arrowBetween, arrowRight],
	    strokeColor: 'red'
	});
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}