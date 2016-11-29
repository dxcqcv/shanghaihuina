$('#addReview').click(function(e) {
  $('.alert.alert-danger').hide();
  if(!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
    if($('.alert.alert-danger').length) {
      $('.alert.alert-danger').show();
    } else {
      $(this).parent().prepend('<div role="alert" class="alert alert-danger">99900 All fields required, please try again.</div>');
    }
    return false;
  }
});