jQuery(function ($) {
	// Render the reCAPTCHA
	$('#reminderModal, #activationModal, #signupModal').on('show.bs.modal', function (e) {
		var captcha = $(e.currentTarget).find('.recaptcha');

		if (typeof grecaptcha !== 'undefined' && !captcha.html().length) {
	       EasyLogin.reWidgetId = grecaptcha.render(captcha[0], {'sitekey' : EasyLogin.options.recaptchaSiteKey});
		}
	}).on('hidden.bs.modal', function (e) {
        grecaptcha.reset(EasyLogin.reWidgetId);
	});

	// Clear the hash when the reset and activation modals are closing
	$('#resetModal, #activateModal').on('hide.bs.modal', function () {
		window.location.hash = '';
	});

	$('.avatar-container select').on('change', function () {
		$.get(EasyLogin.options.ajaxUrl, {action: 'avatarPreview', type: $(this).val()}, function (response) {
			if (response.success) 
				$('.avatar-image').attr('src', response.message);
		}, 'json');
	});

	$('#settingsModal a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var modal = $('#settingsModal');
		var action = $(e.target).attr('href').replace('#', '');
		
		modal.find('form').attr('action', action != 'connectTab' ? action : '');

		modal.find('.alert').hide();

		if (action == 'settingsMessages') {
			$.get(EasyLogin.options.ajaxUrl, {action: 'getContacts'}, function(response) {
				if (response.success) {
					var list = modal.find('.contact-list');
					list.html('');
					
					for (var i = 0; i < response.message.length; i++) {
						list.append(tmpl('contactItemTemplate', response.message[i]));
					}

				}
			}, 'json');
		}
	});

	$('.ajax-form').on('click', '.social-connect a', function(e) {
		EasyLogin.alert(EasyLogin.trans('connecting') + $(this).text() + '...', 0, $(e.delegateTarget));
	});

	// Open password reset and activation modals if we
	// found a reminder in the hash. Eg: #reset-123456
	var hash = window.location.hash;
	switch ( hash.substr(1, hash.indexOf('-')-1) ) {
		case 'reset':
			var modal = $('#resetModal');
			modal.find('[name="reminder"]').val( hash.substr(hash.indexOf('-')+1, hash.length ) );
			modal.modal('show');
		break;

		case 'activate':
			var modal = $('#activateModal');
			modal.find('[name="reminder"]').val( hash.substr(hash.indexOf('-')+1, hash.length ) );
			modal.modal('show');
			modal.on('shown.bs.modal', function (){
				modal.find('form').trigger('submit');
			});
		break;

		case 'settings':
			var modal = $('#settingsModal');
			modal.modal('show');
			modal.find('a[href="#connectTab"]').tab('show');

			window.location.hash = '';
		break;
	}
});



EasyLogin.ajaxFormCb.ticket_new = function (message, form) {
   EasyLogin.alert('ticket submitted!', 1, form);
    if (message.length)
      setTimeout(function() {
		window.location.href = message;
	}, 2000);
	else 
		window.location.reload();
    // EasyLogin.alert(message, 1, form);
};



// Register ajaxForm callbacks

EasyLogin.ajaxFormCb.refund_ticket_new = function(message, form) {
    EasyLogin.alert('ticket submitted!', 1, form);
   if (message.length)
      setTimeout(function() {
		window.location.href = message;
	}, 2000);
	else 
		window.location.reload();
    // EasyLogin.alert(message, 1, form);
};


EasyLogin.ajaxFormCb.bitcoin_payment = function (message) {
	if (message.length)
		window.location.href = message;
	else 
		window.location.reload();
};


EasyLogin.ajaxFormCb.disable_gfactor =
EasyLogin.ajaxFormCb.enable_gfactor = function (m, form) {
EasyLogin.alert('Google authentication settings has been changed', 1, form);
	window.location.reload();
};

EasyLogin.ajaxFormCb.login_gfactor = function (message) {
	
		window.location.href = message;
}; 


EasyLogin.ajaxFormCb.buy_now = function(m, form) {
	
     setTimeout(function() {
		window.location.reload();
	}, 2000);
    EasyLogin.alert('Your purchase is successful, please check your purchased to view product!', 1, form);

};

EasyLogin.ajaxFormCb.login = function (message) {
	if (message.length)
		window.location.href = message;
	else 
		window.location.reload();
};

EasyLogin.ajaxFormCb.signup = function (message) {
	var display = $('#signupModal').css('display');

	if (message === true && display !== 'block') {
		window.location.reload();
	} else if (message.redirect !== undefined) {
		if (message.redirect)
			window.location.href = message.redirect;
		else 
			window.location.reload();
	} else if (display === 'block') {
		$('#signupSuccessModal').modal('show');
	}
};

EasyLogin.ajaxFormCb.activation = function () {
	if ($('#activationModal').css('display') == 'block')
		$('#activationSuccessModal').modal('show');
	else
		window.location.reload();
};

EasyLogin.ajaxFormCb.activate = function () {
	$('#activateSuccessModal').modal('show');
};

EasyLogin.ajaxFormCb.reminder = function () {
	if ($('#reminderModal').css('display') == 'block')
		$('#reminderSuccessModal').modal('show');
	else
		window.location.reload();
};

EasyLogin.ajaxFormCb.reset = function () {
	if ($('#resetModal').css('display') == 'block')
		$('#resetSuccessModal').modal('show');
	else
		window.location.href = window.location.origin + window.location.pathname;
};

EasyLogin.ajaxFormCb.settingsAccount =
EasyLogin.ajaxFormCb.settingsProfile = 
EasyLogin.ajaxFormCb.settingsMessages = function (m, form) {
	EasyLogin.alert(EasyLogin.trans('changes_saved'), 1, form);
};

EasyLogin.ajaxFormCb.settingsPassword = function (m, form) {
	form.find('input').val('');
	EasyLogin.alert(EasyLogin.trans('pass_changed'), 1, form);
};

EasyLogin.ajaxFormCb.webmasterContact = function (m, form) {
	form.find('[name="message"]').val('');

	EasyLogin.alert(EasyLogin.trans('message_sent'), 1, form);
};


EasyLogin.ajaxFormCb.withdraw_bitcoin = function (m, form) {

	EasyLogin.alert('Fund transfer successful & will be available after 1 confirmations', 1, form);
};


$(document).ready(function(){
    $('.filterable .btn-filter').click(function(){
        var $panel = $(this).parents('.filterable'),
        $filters = $panel.find('.filters input'),
        $tbody = $panel.find('.table tbody');
        if ($filters.prop('disabled') == true) {
            $filters.prop('disabled', false);
            $filters.first().focus();
        } else {
            $filters.val('').prop('disabled', true);
            $tbody.find('.no-result').remove();
            $tbody.find('tr').show();
        }
    });

    $('.filterable .filters input').keyup(function(e){
        /* Ignore tab key */
        var code = e.keyCode || e.which;
        if (code == '9') return;
        /* Useful DOM data and selectors */
        var $input = $(this),
        inputContent = $input.val().toLowerCase(),
        $panel = $input.parents('.filterable'),
        column = $panel.find('.filters th').index($input.parents('th')),
        $table = $panel.find('.table'),
        $rows = $table.find('tbody tr');
        /* Dirtiest filter function ever ;) */
        var $filteredRows = $rows.filter(function(){
            var value = $(this).find('td').eq(column).text().toLowerCase();
            return value.indexOf(inputContent) === -1;
        });
        /* Clean previous no-result if exist */
        $table.find('tbody .no-result').remove();
        /* Show all rows, hide filtered ones (never do that outside of a demo ! xD) */
        $rows.show();
        $filteredRows.hide();
        /* Prepend no-result row if all rows are filtered */
        if ($filteredRows.length === $rows.length) {
            $table.find('tbody').prepend($('<tr class="no-result text-center"><td colspan="'+ $table.find('.filters th').length +'">No result found</td></tr>'));
        }
    });
});


function countdowntimes() {
    var livedt = new Date();
    var h = livedt.getHours();
    var m = livedt.getMinutes();
    var s = livedt.getSeconds();
    m = latestTime(m);
    s = latestTime(s);
    document.getElementById('preview').innerHTML =
    h + ":" + m + ":" + s;
    var t = setTimeout(countdowntimes, 500);
}
function latestTime(i) {
    if (i < 10) {i = "0" + i};  // include a zero in front of real clock numbers < 10
    return i;
}