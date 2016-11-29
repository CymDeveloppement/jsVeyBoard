/*!
 * jsVeyboard v0.0.1 (https://github.com/CymDeveloppement/jsVeyBoard)
 * Copyright 2016 SARL CYM DEVELOPPEMENT.
 * Licensed under the GPL v3
 */


function jsveyboard(identifier, style)
{
	UID = $(identifier).attr('id');
	if (typeof UID == 'undefined') {
		UID = 'jsVeyboard'+jsVeyBoardNumber;
		jsVeyBoardNumber = jsVeyBoardNumber + 1;
		$(identifier).attr('id', UID);
	}
	keyboard = makeKeyboard(identifier, style, UID);
	
	dispKeyboard(identifier, keyboard, style, UID);

	
}

function makeKeyboard(id, style, UID)
{
	var keyboardPattern = Pattern[style.style];
	var htmlKeyboard = '<div class="jsVeyboardBlock" id="pad' + UID + '">';
	for (let line in keyboardPattern) {
		htmlKeyboard = htmlKeyboard + '<div class="row">';
		for (let button in keyboardPattern[line]) {
			htmlKeyboard = htmlKeyboard + makeButton(keyboardPattern[line][button], style, UID);
  		}
  		htmlKeyboard = htmlKeyboard + '</div>';
	}
	htmlKeyboard = htmlKeyboard + '</div>';
	return htmlKeyboard;
}

function makeButton(name, style, UID)
{
	classUID = 'jsveyboardClass'+UID;
	
	effectiveClass = classUID + ' btn-jsveyboard ';
	if (name == 'BLANK') {
		effectiveName = '';
		effectiveClass = effectiveClass + 'blankJsveyboard ';
	} else {
		effectiveName = name;
	}

	if (name.length == 1) {
		
		effectiveClass = effectiveClass + ' oneCharButton' + UID + ' ';
	}

	effectiveClass = effectiveClass + style.btnstyle;
	
	actionButton = "keyPress('" + name + "', '" + UID + "');";

	dataAttr = '';
	minwidth = '';

	if (getSpecialKey(name).hasOwnProperty('icon')) {
		 effectiveName = '<span class="glyphicon ' + getSpecialKey(name).icon + '" aria-hidden="true"></span>';
	}

	if (getSpecialKey(name).hasOwnProperty('name')) {
		 effectiveName = getSpecialKey(name).name;
	}

	if (getSpecialKey(name).hasOwnProperty('minwidth')) {
		 minwidth = 'min-width:' + getSpecialKey(name).minwidth + 'px;';
	}

	if (getSpecialKey(name).hasOwnProperty('onClick')) {
		 actionButton = getSpecialKey(name).onClick + "('" + UID + "', $(this))";
	}

	if (getSpecialKey(name).hasOwnProperty('style')) {
		 effectiveClass = classUID + ' btn-jsveyboard ' + getSpecialKey(name).style;
	}

	if (getSpecialKey(name).hasOwnProperty('data')) {
		 dataAttr = 'data-keys="' + getSpecialKey(name).data + '"';
	}
	
	return '<div class="' + effectiveClass + '" onclick="' + actionButton + '" ' + dataAttr + ' style="' + minwidth + '">' + effectiveName.replace(/\\/g, '') + '</div>';
}

function dispKeyboard(id, keyboard, style, UID)
{

	$(keyboard).insertAfter(id);
	

	if (style.show == 'always') {
		$('#pad' + UID).css('display','block');
		$('<div style="height:' + $('#pad' + UID).height() + 'px;"></div>').insertAfter('#pad'+UID);
		setKeySize(UID, style);

		

	}

	if (style.show == 'focus') {

		$('.jsveyboardClass'+UID).click(function(){
			jsVeyBoardNoFadeOut = 1;
		});

		$('#'+UID).focus(function() {
			$('#pad' + UID).fadeIn('600');
			$('html, body').animate( { scrollTop: ($('#'+UID).position().top + $('#pad' + UID).height()) }, 2000);
			setKeySize(UID, style);
			setLeftPosition(UID);
		});


		$('#'+UID).focusout(function(e) {
		  //$('html, body').animate( { scrollTop: ($('#'+UID).position().top - $('#pad' + UID).height()) }, 2000);
		 setTimeout(function(){ lostFocus(UID); }, 1000);
		});
		
	}

	setLeftPosition(UID);
	
}

function setKeySize(UID, style)
{
	if (style.hasOwnProperty('btnwidth')) {
		$('.oneCharButton'+UID).width(style.btnwidth);
	} else {
		maxSize = 0;
		$('.oneCharButton'+UID).each(function() {
			if ($(this).width() > maxSize) {maxSize = $(this).width()}
		});
		$('.oneCharButton'+UID).width(maxSize);
	}

	height = 0;
	$('.jsveyboardClass'+UID).each(function() {
		if ($(this).height() > height) {height = $(this).height()}
	});
	$('.jsveyboardClass'+UID).height(height);
}

function setLeftPosition(UID)
{
	jsVeyboardPosition = $('#' + UID).position().left - (($('#pad' + UID).width() - $('#' + UID).width()) / 2);
	$('#pad' + UID).css('left',jsVeyboardPosition-20);

}

function getSpecialKey(name)
{
	specialKey = false ;
	if (SpecialKeys.hasOwnProperty(name)) {
		specialKey = SpecialKeys[name];
	}
	return specialKey;
}

function keyPress(key, id)
{
	$('#'+id).val($('#'+id).val() + key);
}

function backSpace(id, caller)
{
	$('#'+id).val($('#'+id).val().slice(0,-1));
}

function space(id, caller)
{
	$('#'+id).val($('#'+id).val() + ' ');
	console.log('SPACE');
}

function shift(id, caller)
{
	console.log(caller.attr('data-keys'));

	if (caller.attr('data-keys') == 'lower') {
		$('.oneCharButton'+id).each(function(){
				$(this).html($(this).html().toUpperCase());
				$(this).attr('onclick', "keyPress('" + $(this).html().toUpperCase() + "', '" + id + "');");
				$(caller).attr('data-keys', 'upper');
		});
	}else if (caller.attr('data-keys') == 'upper') {
		$('.oneCharButton'+id).each(function(){
			$(this).html($(this).html().toLowerCase());
			$(this).attr('onclick', "keyPress('" + $(this).html().toLowerCase() + "', '" + id + "');");
			$(caller).attr('data-keys', 'lower');
		});
	}
}

function lostFocus(id)
{
	if (jsVeyBoardNoFadeOut == 0) {
		$('#pad' + id).fadeOut('600');
	} else {
		$('#'+id).focus();
		jsVeyBoardNoFadeOut = 0;
	}
}



Pattern = {
			MOBILE: {
						'line1': ['1','2','3'],
						'line2': ['4','5','6'],
						'line3': ['7','8','9'],
						'line4': ['UNDO','0','CHECK']
					},
			MOBILEONE: {
						'line1': ['1','2','3','4','5','6','7','8','9','0','CHECK']
					},
			AZERTY: {
						'line1': ['a','z','e','r','t','y','u','i','o','p','UNDO'],
						'line2': ['SHIFT','q','s','d','f','g','h','j','k','l','m'],
						'line3': ['w','x','c','v','b','n','OK'],
						'line4': ['SPACE']
					},
			QWERTY: {
						'line1': ['q','w','e','r','t','y','u','i','o','p','UNDO'],
						'line2': ['SHIFT','a','s','d','f','g','h','j','k','l'],
						'line3': ['z','x','c','v','b','n','m','OK'],
						'line4': ['SPACE']
					},
			AZERTYFULL: {
						'line0': ['1','2','3','4','5','6','7','8','9','0','@'],
						'line1': ['a','z','e','r','t','y','u','i','o','p','UNDO'],
						'line2': ['SHIFT','q','s','d','f','g','h','j','k','l','m'],
						'line3': ['w','x','c','v','b','n','\\\'',';','.'],
						'line4': ['BLANK','SPACE','OK']
					},
			QWERTYFULL: {
						'line0': ['1','2','3','4','5','6','7','8','9','0','@'],
						'line1': ['q','w','e','r','t','y','u','i','o','p','UNDO'],
						'line2': ['SHIFT','a','s','d','f','g','h','j','k','l',';'],
						'line3': ['z','x','c','v','b','n','m','\\\'','.'],
						'line4': ['BLANK','SPACE','OK']
					}

};

SpecialKeys = {
				UNDO: {
					onClick: 'backSpace',
					icon: 'glyphicon-chevron-left',
					style: 'btn btn-lg btn-danger'
				},
				OK: {
					onClick: '',
					icon: 'glyphicon-ok',
					style: 'btn btn-lg btn-success',
					name: 'Suivant'
				},
				CHECK: {
					onClick: '',
					icon: 'glyphicon-ok',
					style: 'btn btn-lg btn-success'
				},
				SHIFT: {
					onClick: 'shift',
					icon: 'glyphicon-arrow-up',
					data: 'lower'
				},
				SPACE: {
					onClick: 'space',
					minwidth: '300',
					name: ''
				}
}

jsVeyBoardNumber = 0;
jsVeyBoardNoFadeOut = 0;