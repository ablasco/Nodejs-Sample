var MF = {};

/**
 * Utility function to render the fact.
 * @param data
 */
MF.renderFact = function(data) {
    var id = data._id || null,
        fDate = data.ts || new Date(),
        d = new Date(fDate),
        strDate = d.toLocaleDateString() + ', ' + d.toLocaleTimeString(),
        fUser = data.author || 'anonymous',
        fBody = data.fact;

    var tpl =
        '<div class="post">' +
            '<div class="hidden">' + id + '</div>' +
            '<div class="title">' +
                '<p><small>Posted on ' + strDate + ' by <a href="#">' + fUser + '</a></small></p>' +
            '</div>' +
            '<div class="entry">' +
                '<p>' + fBody + '</p>' +
            '</div>' +
//            '<p class="links">' +
//                '<a href="#" class="more">Read More</a>' +
//                '&nbsp;&nbsp;&nbsp;' +
//                '<a href="#" class="comments">No Comments</a>' +
//            '</p>' +
            '<p class="links">' +
                '<a href="#" class="edit">Edit</a>' +
                '&nbsp;&nbsp;&nbsp;' +
                '<a href="#" class="delete">Delete</a>' +
            '</p>' +
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
            // Render template.
            var tpl = MF.renderFact(data[i]);
            $(tpl).appendTo('#facts');
        }

        // Binding button events.
        $('.post').each(function(idx, el) {
            var id = $(el).find('.hidden').text(),
                hero = $('#content h2').text(),
                fact = $(el).find('.entry p').text();
            console.log('found id:', id);

            $('.edit', el).click(function() {
                console.log('editing:', id);
                $("#new-fact-form").dialog({
                    modal: true,
                    title: 'Edit fact'
                });

                $('#new-fact-form #fact-id').val(id);
                $('#new-fact-form #hero').val(hero);
                $('#new-fact-form #new-fact').val(fact);

                $('#add-new-fact').unbind('click');
                $('#add-new-fact').click(MF.editFact);

                return false;
            });

            $('.delete', el).click(function() {
                console.log('deleting:', id);

                $("#dialog-confirm").dialog({
                    resizable: false,
                    height: 200,
                    modal: true,
                    title: 'Confirmation',
                    buttons: {
                        "Delete fact": function() {
                            $.ajax({
                                type: "GET",
                                url: "/hero/delete-fact/" + id,
                                //url: "/hero/delete-fact",
                                //data: JSON.stringify({ id: id }),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",

                                success: function(data) {
                                    console.log('deleted: ', id);
/*
                                    var tpl = MF.renderFact(fact);
                                    $(tpl).appendTo('#facts');

                                    $('#new-fact').val('');
*/
                                },

                                error: function(err) {
                                    var msg = 'Status: ' + err.status + ': ' + err.responseText;
                                    alert(msg);
                                }
                            });


                            $(this).dialog("close");
                        },
                        Cancel: function() {
                            $(this).dialog("close");
                        }
                    }
                });

                return false;
            });

        });

    });
    $('#content').show();

    return false;
};

/**
 * Adds a new fact about the selected hero.
 */
MF.addFact = function() {
    var name = $('#content h2').text(),
        fact = $('#new-fact').val();

    $.ajax({
        type: "POST",
        url: "/hero/add-fact",
        data: JSON.stringify({ author: 'anonymous-form', hero: name, fact: fact }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function(data) {
//            var tpl = MF.renderFact(fact);
//            $(tpl).appendTo('#facts');
//
//            $('#new-fact').val('');
        },

        error: function(err) {
            var msg = 'Status: ' + err.status + ': ' + err.responseText;
            alert(msg);
        }
    });

    return false;
};

/**
 * Updates a given fact.
 */
MF.editFact = function() {
    var name = $('#content h2').text(),
        fact = $('#new-fact').val(),
        id = $('#fact-id').val();

    $.ajax({
        type: "POST",
        url: "/hero/edit-fact",
        data: JSON.stringify({ id: id, author: 'anonymous-form', hero: name, fact: fact }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function(data) {
//            var tpl = MF.renderFact(fact);
//            $(tpl).appendTo('#facts');
//
//            $('#new-fact').val('');
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
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $("#dialog:ui-dialog").dialog("destroy");


    $('#add-new-fact').button({disabled: true});
    $('#new-fact').bind('keyup', function(evt) {
        var noValue = (evt.target.value === ''),
            btn = $('#add-new-fact');

        btn.button("option", "disabled", noValue);
    });

    // Binding event handlers.
    $('#heroes li a').click(MF.listFacts);

    $('#show-add')
        .button()
        .click(function() {
            $("#new-fact-form").dialog({
                modal: true,
                title: 'Add new fact'
            });
            $('#add-new-fact').click(MF.addFact);

            return false;
        });

});
