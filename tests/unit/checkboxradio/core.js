define( [
	"jquery",
	"ui/checkboxradio"
], function( $ ) {

module( "Checkboxradio: core" );
test( "Checkbox - Initial class structure", function( assert ) {
	expect( 2 );
	var input = $("#check"),
		label = $("label[for=check]");

	input.checkboxradio();
	assert.hasClasses( input, "ui-helper-hidden-accessible ui-checkboxradio" );
	assert.hasClasses( label, "ui-button ui-widget ui-checkboxradio-label ui-corner-all",
		true, "Label has proper classes" );
});

test( "Radios - Initial class structure", function( assert ) {
	expect( 6 );
	var inputs = $( "#radio0 input" ),
		labels = $( "#radio0 label" );

	inputs.checkboxradio();
	inputs.each( function() {
		assert.hasClasses( this, "ui-helper-hidden-accessible" );
	});
	labels.each( function() {
		assert.hasClasses( this, "ui-button" );
	});
});

function radioFormAssert( noForm, form1, form2, assert ) {
	var others,
		noFormElement = $( "#radio0 .ui-button" + noForm ),
		form1Element = $( "#radio1 .ui-button" + form1 ),
		form2Element = $( "#radio2 .ui-button" + form2 );

	assert.hasClasses( noFormElement, "ui-state-active" );
	$( "#radio0" ).find( ".ui-button" ).not( noFormElement ).each( function(){
		assert.lacksClasses( this, "ui-state-active" );
	});

	assert.hasClasses( form1Element, "ui-state-active" );
	others = $( "#radio1" ).find( ".ui-button" ).not( form1Element );
	others.each( function(){
		assert.lacksClasses( this, "ui-state-active" );
	});
	assert.hasClasses( form2Element, "ui-state-active" );
	$( "#radio2" ).find( ".ui-button" ).not( form2Element ).each( function(){
		assert.lacksClasses( this, "ui-state-active" );
	});
}

test( "radio groups", function( assert ) {
	expect( 36 );
	$( "input[type=radio]").checkboxradio();
	radioFormAssert( ":eq(0)", ":eq(2)", ":eq(2)", assert );

	// click outside of forms
	$( "#radio0 .ui-button:eq(1)" ).simulate( "click" );
	radioFormAssert(":eq(1)", ":eq(2)", ":eq(2)", assert );

	// click in first form
	$( "#radio1 .ui-button:eq(0)").simulate( "click" );
	radioFormAssert( ":eq(1)", ":eq(0)", ":eq(2)", assert );

	// click in second form
	$("#radio2 .ui-button:eq(0)" ).simulate( "click" );
	radioFormAssert( ":eq(1)", ":eq(0)", ":eq(0)", assert );
});

asyncTest(
	"Checkbox/Radiobutton do not show focused State when using keyboard navigation",
	function( assert ) {
		expect( 2 );
		var check = $( "#check" ).checkboxradio(),
			label = $( "label[for='check']" );
		assert.lacksClasses( label, "ui-state-focus" );
		check.focus();
		setTimeout(function() {
			assert.hasClasses( label, "ui-state-focus" );
			start();
		} );
	}
);

asyncTest( "Ensure checked after single click on checkbox label button", function( assert ) {
	expect( 2 );

	$( "#check2" ).checkboxradio().change( function() {
		var label = $( this ).checkboxradio( "widget" );
		ok( this.checked, "checked ok" );

		assert.hasClasses( label, "ui-state-active" );
	});

	// Support: Opera
	// Opera doesn't trigger a change event when this is done synchronously.
	// This seems to be a side effect of another test, but until that can be
	// tracked down, this delay will have to do.
	setTimeout(function() {
		$( "#check2" ).checkboxradio( "widget" ).simulate( "click" );
		start();
	});
});

test( "Checkbox creation requires a label, and finds it in all cases", function( assert ) {
	expect( 7 );
	var groups = [
		"<span><label for='t7092a'></label><input type='checkbox' id='t7092a'></span>",
		"<span><input type='checkbox' id='t7092b'><label for='t7092b'></label></span>",
		"<span><span><input type='checkbox' id='t7092c'></span><label for='t7092c'></label></span>",
		"<span><input type='checkbox' id='t7092d'></span><span><label for='t7092d'></label></span>",
		"<span><input type='checkbox' id='t7092e'><span><label for='t7092e'></label></span>",
		"<span><label><input type='checkbox' id='t7092f'></label></span>",
		"<span><input type='checkbox' id='check:7534'><label for='check:7534'>Label</label></span>"
	];

	$.each( groups, function( index, markup ) {
		var group = $( markup );

		group.find( "input[type=checkbox]" ).checkboxradio();
		assert.hasClasses( group.find( "label" ), "ui-button" );
	} );
});

asyncTest(
	"Resetting a button's form should refresh, the visual state of the checkbox to match.",
	function( assert ) {
		expect( 2 );
		var form = $( "<form>" +
			"<label for='c1'></label><input id='c1' type='checkbox' checked>" +
			"</form>" ),
			checkbox = form.find( "input[type=checkbox]" ).checkboxradio(),
			widget = checkbox.checkboxradio( "widget" );

		checkbox.prop( "checked", false ).checkboxradio( "refresh" );
		assert.lacksClasses( widget, "ui-state-active" );

		form.get( 0 ).reset();

		setTimeout(function() {
			assert.hasClasses( widget, "ui-state-active" );
			start();
		}, 1 );
	}
);

test( "Calling checkboxradio on an unsupported element throws an error", function( assert ) {
	expect( 2 );
	var error = new Error( "Can't create checkboxradio on element.nodeName=div and element.type=undefined" );
	assert.raises(
		function() {
			$( "<div>" ).checkboxradio();
		},
		error,
		"Proper error thrown"
	);
	error = new Error( "Can't create checkboxradio on element.nodeName=input and element.type=button" );
	assert.raises(
		function() {
			$( "<input type='button'>" ).checkboxradio();
		},
		error,
		"Proper error thrown"
	);
});
test( "Calling checkboxradio on an input with no label throws an error", function( assert ) {
	expect( 1 );
	var error = new Error( "No label found for checkboxradio widget" );
	assert.raises(
		function() {
			$( "<input type='checkbox'>" ).checkboxradio();
		},
		error,
		"Proper error thrown"
	);
});

} );
