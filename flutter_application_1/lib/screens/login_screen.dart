final _authService = AuthService();

Future<void> _handleLogin() async {
  try {
    await _authService.login(usernameController.text, passwordController.text);
    // navigate to home screen
  } catch (e) {
    // show "invalid login" error
  }
}
