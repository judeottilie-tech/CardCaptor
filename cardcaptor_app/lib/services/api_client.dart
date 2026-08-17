import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;

  late final Dio dio;
  late final CookieJar cookieJar;

  ApiClient._internal() {
    dio = Dio(BaseOptions(
      // TODO: change this depending on the backend
      // Android emulator -> http://10.0.2.2:5000/api
      // iOS simulator    -> http://localhost:5000/api
      // Physical device  -> http://<your-machine-LAN-IP>:5000/api
      // Production       -> https://your-deployed-api.example.com/api
      baseUrl: 'http://localhost:5000/api',
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      validateStatus: (status) => status != null && status < 500,
    ));

    cookieJar = CookieJar();
    dio.interceptors.add(CookieManager(cookieJar));
  }

  Future<void> clearCookies() async {
    await cookieJar.deleteAll();
  }
}
