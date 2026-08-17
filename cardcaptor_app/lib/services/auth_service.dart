import 'dart:convert';
import 'package:dio/dio.dart';
import '../models/user_profile.dart';
import 'api_client.dart';

class AuthException implements Exception {
  final String message;
  AuthException(this.message);
  @override
  String toString() => message;
}

class AuthService {
  final Dio _dio = ApiClient().dio;

  Future<void> login(String username, String password) async {
    final credentials = base64Encode(utf8.encode('$username:$password'));
    final response = await _dio.post(
      '/auth/login',
      options: Options(headers: {'Authorization': 'Basic $credentials'}),
    );
    if (response.statusCode != 200) {
      throw AuthException('Invalid username or password.');
    }
  }

  Future<void> register({
    required String userName,
    required String displayName,
    required String password,
    required String starterPokemon,
  }) async {
    final encodedPassword = base64Encode(utf8.encode(password));
    final response = await _dio.post('/auth/register', data: {
      'userName': userName,
      'displayName': displayName,
      'password': encodedPassword,
      'starterPokemon': starterPokemon,
    });
    if (response.statusCode != 200) {
      throw AuthException(response.data?.toString() ?? 'Registration failed.');
    }
  }

  Future<void> logout() async {
    await _dio.get('/auth/logout');
    await ApiClient().clearCookies();
  }

  Future<UserProfile?> me() async {
    final response = await _dio.get('/auth/me');
    if (response.statusCode == 200) {
      return UserProfile.fromJson(response.data);
    }
    return null;
  }
}
