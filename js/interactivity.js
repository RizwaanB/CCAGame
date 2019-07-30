jQuery('#credits').on('click', function() {
  var message = 'You clicked on game background';
  jQuery('#credits').append(
    '<p>'+message+'</p>'
  )
});
