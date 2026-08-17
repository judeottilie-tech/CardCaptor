import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance; // one shared instance for the whole app

  late final Dio dio;

  ApiClient._internal() {
    dio = Dio(BaseOptions(baseUrl: 'https://localhost:5001/api'));
    final cookieJar = CookieJar(); // keeps cookies in memory for the app's lifetime
    dio.interceptors.add(CookieManager(cookieJar));
  }
}