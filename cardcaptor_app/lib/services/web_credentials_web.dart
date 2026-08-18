import 'package:dio/dio.dart';
import 'package:dio/browser.dart';


void configureWebCredentials(Dio dio) {
  dio.httpClientAdapter = BrowserHttpClientAdapter(withCredentials: true);
}
