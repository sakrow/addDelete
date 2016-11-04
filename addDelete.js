/*
 * AddDelete!: Plugin to add delete/add buttons on forms lists
 * @author Victor Portero Cantera <contacto@sakrow.com>
 * http://sakrow.com
 * License GNU/GPL & MIT
 */

(function($) {

    'use strict';

    var count = 0;
    var saves = [];

    $.fn.addDelete = function(options) {

        var settings = $.extend({
            deleteText: 'Delete',
            aditionText: 'Add',
        }, options);

        var className = this.attr('class');

        $('.' + className).children().each(function(index, element) {
            $(element).attr('data-delete', index);
            buttonDeleteAdd(element, index, settings.deleteText);
        });

        buttonDeleteActionAdd();

        this.each(function(index, element) {
            $(element).attr('data-adition', index);
            buttonAditionAdd(this, index, settings.aditionText);
        });

        buttonAditionActionAdd();

        return this;
    };

    function getNext(selector) {
        return $(selector).length + 1;
    }

    function buttonDeleteAdd(element, id, text) {
        var html = '<button class="deleteButton" data-delete="' + id + '">' + text + '</button>';
        $(element).append(html);
    };

    function buttonAditionAdd(element, id, text) {
        var html = '<button class="addButton" data-adition="' + id + '">' + text + '</button>';
        $(element).append(html);
    };

    function buttonDeleteActionAdd() {
        $('.deleteButton').on('click', function(event) {
            event.preventDefault();
            var idDelete = $(this).parent().attr('data-delete');
            var count = $(this).parents('[data-adition]').children('[data-delete]').length;
            var element = $(this).parents('[data-adition]').children('[data-delete=' + idDelete + ']');

            if (count == 1) {
                var idSave = $(this).parents('[data-adition]').attr('data-adition');
                saveElement(idSave, element);
            }

            element.remove();
        });
    }

    function buttonAditionActionAdd() {
        $('.addButton').on('click', function(event) {
            event.preventDefault();
            cloneElement($(this).attr('data-adition'));
        });
    }

    function cloneElement(adition) {
        var element = $('[data-adition="' + adition + '"]');
        var newElement = '';
        var count = element.children('[data-delete]').length;

        if (count == 0) {
            newElement = saves[adition];
        }

        if (count !== 0) {
            newElement = element.children('[data-delete]').last().clone();
        }

        var id = getNext($('[data-delete]:not(button)'));
        newElement.attr('data-delete', id);
        newElement.find('button.deleteButton').attr('data-delete', id);
        resetForm(newElement);
        changeArrayIndex(newElement)
        newElement.insertBefore(element.children('button'));
        buttonDeleteActionAdd();
    }

    function saveElement(id, element) {
        var saveElement = element.clone();
        resetForm(saveElement);
        saves[id] = saveElement;
    }

    function resetForm(form) {
        form.find('input:text, input:password, input:file, select, textarea').val('');
        form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
    }

    function changeArrayIndex(newElement) {
        newElement.find('[name]').each(function(){
            this.name = this.name.replace(/\[(\d+)\]/, function(str,p1){
                return '[' + (parseInt(p1,10)+1) + ']';
            });
        });
    }

}(jQuery));
