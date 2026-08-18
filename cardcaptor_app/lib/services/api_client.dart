import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'web_credentials_stub.dart'
    if (dart.library.html) 'web_credentials_web.dart';

/// Single shared HTTP client for the whole app.
///
/// On mobile/desktop, Dio doesn't manage cookies itself, so we attach a
/// CookieJar via CookieManager: it stores the cookie set by
/// POST /api/auth/login and replays it on every later request.
///
/// On web, this is unnecessary AND unsupported — dio_cookie_manager
/// explicitly refuses to run in a browser, because the browser itself
/// already stores and sends cookies for you (same as any fetch() call).
/// All we have to do on web is set withCredentials so cross-origin
/// requests actually include/accept cookies.
class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;

  late final Dio dio;
  CookieJar? cookieJar;

  ApiClient._internal() {
    dio = Dio(BaseOptions(
      // TODO: change this depending on where/how you're running the backend.
      // Android emulator -> http://10.0.2.2:5000/api
      // iOS simulator    -> http://localhost:5000/api
      // Physical device  -> http://<your-machine-LAN-IP>:5000/api
      // Flutter web      -> whatever origin your backend's FrontendUrl/CORS
      //                     policy allows (see appsettings.Development.json)
      // Production       -> https://your-deployed-api.example.com/api
      baseUrl: 'https://localhost:7257/api',
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      validateStatus: (status) => status != null && status < 500,
    ));

    if (kIsWeb) {
      configureWebCredentials(dio);
    } else {
      cookieJar = CookieJar();
      dio.interceptors.add(CookieManager(cookieJar!));
    }
  }

  /// Wipes stored cookies — call this on logout so a stale session cookie
  /// can't linger around. On web there's nothing for us to clear directly;
  /// the browser owns the cookie and /api/auth/logout expiring it
  /// server-side is what actually matters.
  Future<void> clearCookies() async {
    await cookieJar?.deleteAll();
  }
}
