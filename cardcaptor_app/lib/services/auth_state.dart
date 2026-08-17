import 'package:flutter/foundation.dart';
import '../models/user_profile.dart';
import 'auth_service.dart';

enum AuthStatus { unknown, loggedOut, loggedIn }

class AuthState extends ChangeNotifier {
  final AuthService _authService = AuthService();

  AuthStatus status = AuthStatus.unknown;
  UserProfile? currentUser;
  String? lastError;

  Future<void> checkSession() async {
    try {
      final profile = await _authService.me();
      currentUser = profile;
      status = profile != null ? AuthStatus.loggedIn : AuthStatus.loggedOut;
    } catch (_) {
      status = AuthStatus.loggedOut;
    }
    notifyListeners();
  }

  Future<bool> login(String username, String password) async {
    try {
      lastError = null;
      await _authService.login(username, password);
      currentUser = await _authService.me();
      status = AuthStatus.loggedIn;
      notifyListeners();
      return true;
    } catch (e) {
      lastError = 'Login failed. Check your username and password.';
      status = AuthStatus.loggedOut;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register({
    required String userName,
    required String displayName,
    required String password,
    required String starterPokemon,
  }) async {
    try {
      lastError = null;
      await _authService.register(
        userName: userName,
        displayName: displayName,
        password: password,
        starterPokemon: starterPokemon,
      );
      currentUser = await _authService.me();
      status = AuthStatus.loggedIn;
      notifyListeners();
      return true;
    } catch (e) {
      lastError = 'Registration failed: $e';
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    currentUser = null;
    status = AuthStatus.loggedOut;
    notifyListeners();
  }
}
