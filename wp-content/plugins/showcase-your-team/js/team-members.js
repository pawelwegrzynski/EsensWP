jQuery(document).ready(function($) {

  $('.teammembers-tab').on('click', function() {

        var teamMemberURL = $(this).data('teammemberurl');

        if (teamMemberURL) {
          window.location.href = teamMemberURL;
        }

  });

  $('.teammembers-tab .icons-block a').on('click', function(e) {

      e.stopPropagation();
  });

});
