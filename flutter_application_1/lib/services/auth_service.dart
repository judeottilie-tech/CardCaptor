import 'dart:convert';

import 'api_client.dart';

class AuthService {
  final _dio = ApiClient().dio;

  Future<void> login(String username, String password) async {
    final credentials = base64Encode(utf8.encode('$username:$password'));
    await _dio.post(
      '/auth/login',
      options: Options(headers: {'Authorization': 'Basic $credentials'}),
    );
  }

  Future<void> logout() async {
    await _dio.get('/auth/logout');
  }

  Future<Map<String, dynamic>> me() async {
    final response = await _dio.get('/auth/me');
    return response.data;
  }
}
