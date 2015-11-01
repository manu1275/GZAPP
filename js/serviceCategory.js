$(function () {
    var userApiKey = "w0Ndvl6kd9OlBH9nuHl";
    var siteUrl="https://klkservice.freshdesk.com/helpdesk/tickets.json";
    var siteHeader = {};
    var priority = 1;
    var checkedItems = {}, checkedCategories = [];
$('.list-group.checked-list-box .list-group-item').each(function () {
        
        // Settings
        var $widget = $(this),
            $checkbox = $('<input type="checkbox" class="hidden" />'),
            color = ($widget.data('color') ? $widget.data('color') : "primary"),
            style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };
            
        $widget.css('cursor', 'pointer')
        $widget.append($checkbox);

        // Event Handlers
        $widget.on('click', function () {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
            $checkbox.triggerHandler('change');
            updateDisplay();
        });
        $checkbox.on('change', function () {
            updateDisplay();
        });
          

        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');

            // Set the button's state
            $widget.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $widget.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$widget.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $widget.addClass(style + color + ' active');
            } else {
                $widget.removeClass(style + color + ' active');
            }
        }

        // Initialization
        function init() {
            
            if ($widget.data('checked') == true) {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
            }
            
            updateDisplay();

            // Inject the icon if applicable
            if ($widget.find('.state-icon').length == 0) {
                $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
            }
        }
        init();
    });
    
    $('#get-checked-data').on('click', function(event) {
        event.preventDefault(); 
        $('#category-list-box li.active').each(function(idx, li) {
                checkedItems = {}
                checkedItems.service = $(li).text();
                checkedItems.category =$(li).parent().data("id");
                checkedCategories.push(checkedItems);
        });

        $("#create-ticket-modal").css("display","block");
        $("#service-selection").css("display","none");
    });

    $(".btn-group > button.btn").on("click", function(){
        priority = $(this).data("id");
    });

    var descriptionData = function(){

        return JSON.stringify(checkedCategories);
    }

    $('#create-ticket-btn').on('click', function(){
        var authorizationKey = btoa(userApiKey+":X");

        var serviceData = {
            "helpdesk_ticket":{
                "description":descriptionData(),
                "subject":$("#ticket-subject").val(),
                "email":$("#user-email").val(),
                "priority":priority,
                "status":2
            },
            "cc_emails":$("#cc-emails").val()
        };

        serviceData = JSON.stringify(serviceData);

        console.log(serviceData);
        
        siteHeader = {'Authorization': 'Basic '+authorizationKey, 'Content-Type': 'application/json'};
        
        $.ajax({
            url: siteUrl,
            headers: siteHeader,
            type: "POST",
            dataType: 'json',
            data: serviceData,
            success: function(response, status){
                console.log('response is ', response, 'status is ', status);
            },
            error: function(status){
                console.log('status is ', status);  
            }
        });
    });
});