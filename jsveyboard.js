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
	
	effectiveClass = 'btn-jsveyboard ';
	if (name == 'BLANK') {
		effectiveName = '';
		effectiveClass = effectiveClass + 'blankJsveyboard ';
	} else {
		effectiveName = name;
	}

	effectiveClass = effectiveClass + style.btnstyle;
	actionButton = "keyPress('" + name + "', '" + UID + "');";

	if (getSpecialKey(name).hasOwnProperty('icon')) {
		 effectiveName = '<span class="glyphicon ' + getSpecialKey(name).icon + '" aria-hidden="true"></span>';
	}

	if (getSpecialKey(name).hasOwnProperty('onClick')) {
		 actionButton = getSpecialKey(name).onClick + "('" + UID + "')";
	}

	if (getSpecialKey(name).hasOwnProperty('style')) {
		 effectiveClass = 'btn-jsveyboard ' + getSpecialKey(name).style;
	}
	
	return '<div class="' + effectiveClass + '" onclick="' + actionButton + '">' + effectiveName + '</div>';
}

function dispKeyboard(id, keyboard, style, UID)
{

	$(keyboard).insertAfter(id);
	//alert();
	jsVeyboardPosition = $(id).position().left - (($('#pad' + UID).width() - $(id).width()) / 2);
	$('#pad' + UID).css('left',jsVeyboardPosition);

	if (style.show == 'always') {
		$('#pad' + UID).css('display','block');
	}

	if (style.show == 'focus') {

		$('#'+UID).focus(function() {
		  //$('#pad' + UID).css('display','block');
		  $('#pad' + UID).fadeIn('600');
		  console.log($('#'+UID).scrollTop());
		  $('html, body').animate( { scrollTop: ($('#'+UID).position().top + $('#pad' + UID).height()) }, 2000);
		});

		$('#'+UID).focusout(function() {
		  $('html, body').animate( { scrollTop: ($('#'+UID).position().top - $('#pad' + UID).height()) }, 2000);
		  $('#pad' + UID).fadeOut('600');
		});
		
	}
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
function backSpace(id)
{
	alert(id);
}

Pattern = {
			MOBILE: {
						'line1': ['1','2','3'],
						'line2': ['4','5','6'],
						'line3': ['7','8','9'],
						'line4': ['UNDO','0','OK']
					},
			MOBILE2: {
						'line1': ['1','2','3','4','5'],
						'line2': ['6','7','8','9','0'],
						'line3': ['BLANK','BLANK','BLANK','UNDO','OK']
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
					icon: 'glyphicon-ok'
				}
}

jsVeyBoardNumber = 0;