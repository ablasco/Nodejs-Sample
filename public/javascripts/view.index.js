var MF = {};

/**
 * Utility function to render the fact.
 * @param data
 */
MF.renderFact = function(data) {
    var fDate = data.ts || new Date(),
        d = new Date(fDate),
        strDate = d.toLocaleDateString() + ', ' + d.toLocaleTimeString(),
        fUser = data.author || 'anonymous',
        fBody = data.fact;

    var tpl =
        '<div class="post">' +
            '<div class="title">' +
            '<p><small>Posted on ' + strDate + ' by <a href="#">' + fUser + '</a></small></p>' +
            '</div>' +
            '<div class="entry">' +
            '<p>' + fBody + '</p>' +
            '</div>' +
        '</div>';

    return tpl;
};

/**
 * Lists all facts about a given hero.
 */
MF.listFacts = function() {
    var name = $(this).text();

    $('#content h2').text(name);
    $('#facts div').remove();
    $.getJSON('/hero/' + name, function(data) {
        for (var i = 0; i < data.length; i++) {
            var tpl = MF.renderFact(data[i]);
            $(tpl).appendTo('#facts');
        }
    });
    $('#content').show();

    return false;
};

/**
 * Adds a new fact about the selected hero.
 */
MF.addFact = function() {
    var name = $('#content h2').text();
    var fact = $('#new-fact').val();

    $.ajax({
        type: "POST",
        url: "/hero/add-fact",
        data: JSON.stringify({ author: 'anonymous-form', name: name, fact: fact }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function(data) {
            var tpl = MF.renderFact(fact);
            $(tpl).appendTo('#facts');

            $('#new-fact').val('');
        },

        error: function(err) {
            var msg = 'Status: ' + err.status + ': ' + err.responseText;
            alert(msg);
        }
    });

    return false;
};


$(function() {
    // Initial state.
    $('#content').hide();

    $('#add-new-fact').button({disabled: true});
    $('#new-fact').bind('keyup', function(evt) {
        var noValue = (evt.target.value === ''),
            btn = $('#add-new-fact');

        btn.button("option", "disabled", noValue);
    });

    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $("#dialog:ui-dialog").dialog("destroy");
    $('#show-add')
        .button()
        .click(function() {
            $("#new-fact-form").dialog({
                modal: true
            });
        });

    // Binding event handlers.
    $('#heroes li a').click(MF.listFacts);
    $('#add-new-fact').click(MF.addFact);
});
