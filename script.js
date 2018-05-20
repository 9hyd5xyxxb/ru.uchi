var constants = {
	rulerY: 78,
	rulerStart: 35,
	rulerEnd: 39,
	rulerHeight: 83,
	rulerWidth: 875,
	rulerDivision: 39
};

var StateModel = {
	initial: 'initial',
	waitingFirstValue: 'waitingFirstValue',
	firstValueWrong: 'firstValueWrong',
	firstValueRight: 'firstValueRight',
	waitingSecondValue: 'waitingSecondValue',
	secondValueWrong: 'secondValueWrong',
	secondValueRight: 'secondValueRight',
	waitingThirdValue: 'waitingThirdValue',
	thirdValueWrong: 'thirdValueWrong',
	thirdValueRight: 'thirdValueRight',
	complete: 'complete'
};

window.onload = function() {
	var first = getRandomInt(6, 9);
	var sum = getRandomInt(11, 14);
	var second = sum - first;
	var canvas = document.getElementById('myCanvas');
	paper.setup(canvas);

	firstPoint = constants.rulerStart;
	secondPoint = firstPoint + (constants.rulerDivision * first);
	thirdPoint = secondPoint + (constants.rulerDivision * second);

	var state$$ = new Rx.BehaviorSubject(StateModel.initial);
	state$$.subscribe(function(next) {
		switch (next) {
			case StateModel.initial:
				console.log(next);
				legendFirst.textContent = first;
				legendSecond.textContent = second;
				drawArrow(firstPoint, secondPoint, 140);
				firstInput.style.display = 'inline-block';
				// firstInput.focus();
				break;
			case StateModel.waitingFirstValue:
				console.log(next);
				break;
			case StateModel.firstValueWrong:
				console.log(next);
				legendFirst.style['background-color'] = '#ffce4e';
				break;
			case StateModel.firstValueRight:
				console.log(next);
				legendFirst.style['background-color'] = '#fff';
				firstInputWrapper.textContent = firstInput.value;
				drawArrow(secondPoint, thirdPoint, 100);
				secondInput.style.display = 'initial';
				secondInput.focus();
				break;
			case StateModel.waitingSecondValue:
				console.log(next);
				break;
			case StateModel.secondValueWrong:
				console.log(next);
				legendSecond.style['background-color'] = '#ffce4e';
				break;
			case StateModel.secondValueRight:
				console.log(next);
				legendSecond.style['background-color'] = '#fff';
				secondInputWrapper.textContent = secondInput.value;
				[].some.call(legendSum.childNodes, function(x) {
					if (x.data === '?') x.remove();
				});
				thirdInput.style.display = 'initial';
				thirdInput.focus();
				break;
			case StateModel.waitingThirdValue:
				console.log(next);
				break;
			case StateModel.thirdValueWrong:
				console.log(next);
				thirdInput.style.color = 'red';
				break;
			case StateModel.thirdValueRight:
				console.log(next);
				legendSum.textContent = thirdInput.value;
				break;
			default:
				console.log(next);
		}
	});
	
	firstInputWrapper.style.left = constants.rulerStart + (secondPoint - firstPoint) / 2 + 'px';
	secondInputWrapper.style.left = constants.rulerStart + (secondPoint - firstPoint) + (thirdPoint - secondPoint) / 2 + 'px';

	var firstAnswerStream$ = Rx.Observable.fromEvent(firstInput, 'keyup');
	var secondAnswerStream$ = Rx.Observable.fromEvent(secondInput, 'keyup');
	var thirdAnswerStream$ = Rx.Observable.fromEvent(thirdInput, 'keyup');

	var firstAnswerStreamSwitchToSecond$ = Rx.Observable.defer(function() {
		state$$.next(StateModel.waitingFirstValue);

		return firstAnswerStream$.switchMap(function(event) {
			if (firstInput.value === first.toString()) {
				state$$.next(StateModel.firstValueRight);
				return secondAnswerStreamSwitchToThird$;
			}

			state$$.next(StateModel.firstValueWrong);
			return Rx.Observable.empty();
		});
	});

	var secondAnswerStreamSwitchToThird$ = Rx.Observable.defer(function() {
		state$$.next(StateModel.waitingSecondValue);

		return secondAnswerStream$.switchMap(function(event) {
			if (secondInput.value === second.toString()) {
				state$$.next(StateModel.secondValueRight);
				return thirdAnswerStreamSwitch$;
			}

			state$$.next(StateModel.secondValueWrong);
			return Rx.Observable.empty();
		});
	});

	var thirdAnswerStreamSwitch$ = Rx.Observable.defer(function() {
		state$$.next(StateModel.waitingThirdValue);

		return thirdAnswerStream$.switchMap(function(event) {
			if (thirdInput.value === sum.toString()) {
				state$$.next(StateModel.thirdValueRight);
				return Rx.Observable.empty().startWith(null);
			}

			state$$.next(StateModel.thirdValueWrong);
			return Rx.Observable.empty();
		});
	});
	
	var init = firstAnswerStreamSwitchToSecond$;
	init.subscribe(function() {state$$.next(StateModel.complete)});
	paper.view.draw();
}
