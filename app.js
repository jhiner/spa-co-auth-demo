var auth0 = new auth0.WebAuth({
  domain:       AUTH0_DOMAIN,
  clientID:     AUTH0_CLIENT_ID,
  callbackURL:  AUTH0_CALLBACK_URL
});

$(document).ready(function() {

  console.log('here');

  // utility functions
  // clear local storage upon logout
  var logout = function() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    window.location.href = "/";
  };

  // app functionality
  // check hash for access_token, id_token
  auth0.parseHash(window.location.hash, function(err, result) {
    handleParseHash(err, result);
  });

  function handleParseHash(err, result) {
    console.log('handleParseHash');
    if (err) {
      console.log(err.error);
      $('#msg').text(err.error);
      $('#msg').show();
    }

    // check if we are calling back from auth0 with access_token
    if (result && result.idToken) {
      console.log('loading profile...');
      $('#login-form').hide();
      
      localStorage.setItem('access_token', result.accessToken);
      localStorage.setItem('id_token', result.idToken);

      $('#idToken').text(result.idToken);
      $('#accessToken').text(result.accessToken);

      auth0.client.userInfo(result.accessToken, function (err, profile) {
        console.log('userinfo result');
        console.log(profile);
        if (profile) {
          $('.nickname').text(profile.nickname);
          $('.avatar').attr('src', profile.picture).show();
        }
        $('#profile').show();
        $('#msg').hide();
        $('#index_content').hide();
      });

    } else if (result && result.error) {
      console.log('error: ' + result.error);
    }

  }

  $('.btn-logout').click(function(e) {
    e.preventDefault();
    logout();
  });


  function getTokensAfterAuthenticate() {
    console.log('Starting getTokensAfterAuthenticate');

    auth0.renewAuth({
      responseType: 'id_token token',
      scope: 'openid profile read:todo',
      audience: 'http://todoapi2.api',
      redirectUri: 'http://myapp.com:8080',
      usePostMessage: false
    }, function(err, result) {
      handleParseHash(err, result);
    });
  }

  $('#btn-login').click(function(e) {
    // use cross-origin sign in
    var req = new XMLHttpRequest();
    req.addEventListener('load', function() {
      var data = JSON.parse(this.responseText);
      // handle response
      console.log(data);
      if (this.status === 200) {
        // now redirect to /authorize
        // getTokensAfterAuthenticate();
        // you can send the login ticket and it is ignored
        window.location.href='https://login0.myauth0.com/authorize?login_ticket=' + data.login_ticket + '&scope=openid profile read%3Atodo offline_access&response_type=id_token token&audience=http%3A%2F%2Ftodoapi2.api&sso=true&prompt=none&client_id=wZ7ZkOh7O738OJrwRshzOTeE5rCHgVER&redirect_uri=http%3A%2F%2Fmyapp.com%3A8080%2F&nonce=mynonce';
      } else {
        console.log(data.error);
        console.log(data.error_description);
        $('#error_msg').text(data.error_description);
      }
    });

    req.open('POST', 'https://login0.myauth0.com/co/authenticate');
    req.withCredentials = true;
    req.setRequestHeader('Content-Type', 'application/json');
    var data = {
      client_id: AUTH0_CLIENT_ID,
      credential_type: 'http://auth0.com/oauth/grant-type/password-realm',
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
      realm:'Initial-Connection'
    }
    
    data = JSON.stringify(data);
    req.send(data);
  });

});
